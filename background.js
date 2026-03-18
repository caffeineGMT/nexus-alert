// NEXUS Alert — Background Service Worker
// Polls CBP's public scheduler API for available appointment slots

import { isSlotInDateRange, isSlotInTimeRange, isDuplicate, pruneOldSlots } from './src/slotFilters.js';

const API_BASE = 'https://ttp.cbp.dhs.gov/schedulerapi';
const SLOTS_ENDPOINT = `${API_BASE}/slots`;
const LOCATIONS_ENDPOINT = `${API_BASE}/locations/`;

// Default configuration
const DEFAULT_CONFIG = {
  enabled: true,
  pollIntervalMinutes: 3,
  locations: [5020], // Blaine, WA (closest to Vancouver)
  program: 'NEXUS',
  dateRange: { start: null, end: null },
  timeRange: { start: null, end: null },
  soundEnabled: true,
  autoOpenBooking: false,
  notifiedSlots: {},
  tier: 'free',
  email: '',
  lastCheckedAt: null,
};

// ─── Initialization ────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.local.set({
      config: DEFAULT_CONFIG,
      slotHistory: [],
      installDate: Date.now(), // Track install date for upgrade banner timing
      bannerDismissed: false,
    });
    await fetchAndCacheLocations();
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
  }
  await setupAlarm();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'check-slots') {
    await checkAllLocations();
  }
});

// ─── Alarm Setup ───────────────────────────────────────────────────

async function setupAlarm() {
  const { config, failureCount } = await chrome.storage.local.get(['config', 'failureCount']);
  const baseInterval = config?.pollIntervalMinutes || DEFAULT_CONFIG.pollIntervalMinutes;
  let effectiveInterval = Math.min(baseInterval * Math.pow(2, failureCount || 0), 30);

  // Free tier: clamp to 30 min minimum
  if (config?.tier !== 'premium') {
    effectiveInterval = Math.max(effectiveInterval, 30);
  }

  await chrome.alarms.clear('check-slots');
  chrome.alarms.create('check-slots', {
    delayInMinutes: 0.1,
    periodInMinutes: effectiveInterval,
  });
  console.log(`[NEXUS Alert] Backoff: failureCount=${failureCount || 0}, interval=${effectiveInterval}min`);
}

// ─── Location Fetching ─────────────────────────────────────────────

async function fetchAndCacheLocations() {
  try {
    const programs = ['NEXUS', 'Global Entry', 'SENTRI'];
    const allLocations = {};

    for (const program of programs) {
      const url = `${LOCATIONS_ENDPOINT}?serviceName=${encodeURIComponent(program)}&operational=true&temporary=false&inviteOnly=false`;
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const locations = await resp.json();
      for (const loc of locations) {
        allLocations[loc.id] = {
          id: loc.id,
          name: loc.name,
          shortName: loc.shortName || loc.name,
          address: loc.address,
          city: loc.city,
          state: loc.state,
          country: loc.countryCode || loc.country,
          timezone: loc.tzData || loc.timezone,
          services: loc.services || [program],
          operational: loc.operational,
        };
      }
    }

    await chrome.storage.local.set({ locations: allLocations });
    console.log(`[NEXUS Alert] Cached ${Object.keys(allLocations).length} locations`);
    return allLocations;
  } catch (err) {
    console.error('[NEXUS Alert] Failed to fetch locations:', err);
    await chrome.storage.local.set({
      lastError: 'Could not reach CBP API. Check your connection.',
      lastErrorTime: Date.now()
    });
    return {};
  }
}

// ─── Slot Checking ─────────────────────────────────────────────────

async function checkAllLocations() {
  const { config } = await chrome.storage.local.get('config');
  if (!config?.enabled) return;

  // Free tier: enforce 30-min rate limit
  if (config.tier !== 'premium') {
    const { lastCheckedAt } = await chrome.storage.local.get('lastCheckedAt');
    if (lastCheckedAt && Date.now() - lastCheckedAt < 30 * 60 * 1000) {
      console.log('[NEXUS Alert] Free tier: skipping check, < 30min since last');
      return;
    }
  }

  console.log(`[NEXUS Alert] Checking ${config.locations.length} location(s)...`);

  const results = [];
  let hasError = false;
  let errorMessage = '';

  try {
    for (const locationId of config.locations) {
      try {
        const slots = await checkLocation(locationId, config);
        if (slots.length > 0) {
          results.push({ locationId, slots });
        }
        await sleep(1000);
      } catch (err) {
        console.error(`[NEXUS Alert] Error checking location ${locationId}:`, err);
        hasError = true;
        errorMessage = err.message || 'Could not reach CBP API. Check your connection.';
        throw err; // Re-throw to trigger outer catch
      }
    }

    // Update last check timestamp & store found slots for the popup
    const foundSlots = [];
    for (const { locationId, slots } of results) {
      for (const slot of slots) {
        foundSlots.push({ ...slot, locationId });
      }
    }
    await chrome.storage.local.set({
      lastCheck: new Date().toISOString(),
      lastFoundSlots: foundSlots,
      lastCheckedAt: Date.now(),
    });

    // Record slot history
    if (foundSlots.length > 0) {
      await recordSlotHistory(foundSlots);
    }

    // Send notifications for new slots
    if (results.length > 0) {
      await notifyNewSlots(results, config);
    }

    // Update badge
    const totalSlots = results.reduce((sum, r) => sum + r.slots.length, 0);
    await updateBadge(totalSlots);

    // Success: reset error state and alarm interval
    await chrome.storage.local.set({
      lastError: null,
      lastErrorTime: null,
      failureCount: 0
    });
    await setupAlarm();

  } catch (err) {
    // Error occurred: increment failure count and store error
    const { failureCount = 0 } = await chrome.storage.local.get('failureCount');
    const newCount = failureCount + 1;
    await chrome.storage.local.set({
      lastError: errorMessage || err.message || 'Could not reach CBP API. Check your connection.',
      lastErrorTime: Date.now(),
      failureCount: newCount
    });
    console.error(`[NEXUS Alert] Check failed, failureCount now: ${newCount}`);
  }
}

async function checkLocation(locationId, config) {
  const params = new URLSearchParams({
    orderBy: 'soonest',
    limit: '500',
    locationId: String(locationId),
    minimum: '1',
  });

  const resp = await fetch(`${SLOTS_ENDPOINT}?${params}`);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} for location ${locationId}`);
  }

  let slots = await resp.json();

  // Filter by date and time range
  slots = slots.filter(s => isSlotInDateRange(s, config) && isSlotInTimeRange(s, config));

  return slots;
}

// ─── Slot History ──────────────────────────────────────────────────

async function recordSlotHistory(slots) {
  const { slotHistory = [] } = await chrome.storage.local.get('slotHistory');
  const now = Date.now();

  for (const slot of slots) {
    slotHistory.push({
      locationId: slot.locationId,
      startTimestamp: slot.startTimestamp,
      endTimestamp: slot.endTimestamp,
      seenAt: now,
    });
  }

  // Keep only last 500 entries to avoid storage bloat
  const trimmed = slotHistory.slice(-500);
  await chrome.storage.local.set({ slotHistory: trimmed });
}

// ─── Notifications ─────────────────────────────────────────────────

async function notifyNewSlots(results, config) {
  const { locations } = await chrome.storage.local.get('locations');
  const notified = config.notifiedSlots || {};
  let newCount = 0;

  for (const { locationId, slots } of results) {
    const locName = locations?.[locationId]?.name || `Location ${locationId}`;

    for (const slot of slots) {
      if (isDuplicate({ ...slot, locationId }, notified)) continue;
      const key = `${locationId}-${slot.startTimestamp}`;

      newCount++;
      notified[key] = Date.now();

      const date = new Date(slot.startTimestamp);
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = slot.startTimestamp.split('T')[1];

      chrome.notifications.create(`slot-${key}`, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'NEXUS Slot Available!',
        message: `${locName}\n${dateStr} at ${timeStr}`,
        priority: 2,
        requireInteraction: true,
        buttons: [{ title: 'Book Now' }],
      });
    }
  }

  if (newCount > 0) {
    // Play sound alert if enabled
    if (config.soundEnabled) {
      await playAlertSound();
    }

    // Auto-open booking page if enabled
    if (config.autoOpenBooking) {
      chrome.tabs.create({ url: 'https://ttp.cbp.dhs.gov/' });
    }

    // Clean old notified entries (older than 24 hours)
    config.notifiedSlots = pruneOldSlots(notified);
    await chrome.storage.local.set({ config });
    console.log(`[NEXUS Alert] Sent ${newCount} new notification(s)`);
  }
}

// ─── Sound Alert ───────────────────────────────────────────────────

async function playAlertSound() {
  try {
    // Use offscreen document to play audio (MV3 requirement)
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
    });

    if (existingContexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play alert sound when new slots are found',
      });
    }

    chrome.runtime.sendMessage({ action: 'playSound' });
  } catch (err) {
    console.error('[NEXUS Alert] Failed to play sound:', err);
  }
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notifId, btnIndex) => {
  if (notifId.startsWith('slot-') && btnIndex === 0) {
    chrome.tabs.create({ url: 'https://ttp.cbp.dhs.gov/' });
  }
});

chrome.notifications.onClicked.addListener((notifId) => {
  if (notifId.startsWith('slot-')) {
    chrome.tabs.create({ url: 'https://ttp.cbp.dhs.gov/' });
  }
});

// ─── Badge ─────────────────────────────────────────────────────────

async function updateBadge(count) {
  if (count > 0) {
    await chrome.action.setBadgeText({ text: String(count) });
    await chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
  } else {
    await chrome.action.setBadgeText({ text: '' });
  }
}

// ─── Message Handling (from popup) ─────────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'checkNow') {
    checkAllLocations().then(() => sendResponse({ success: true }));
    return true;
  }
  if (msg.action === 'updateConfig') {
    chrome.storage.local.get('config', ({ config }) => {
      const newConfig = { ...config, ...msg.config };
      chrome.storage.local.set({ config: newConfig }, async () => {
        await setupAlarm();
        sendResponse({ success: true });
      });
    });
    return true;
  }
  if (msg.action === 'getStatus') {
    chrome.storage.local.get(['config', 'lastCheck', 'locations', 'lastFoundSlots', 'slotHistory', 'lastError', 'lastErrorTime', 'failureCount'], (data) => {
      sendResponse(data);
    });
    return true;
  }
  if (msg.action === 'refreshLocations') {
    fetchAndCacheLocations().then(() => sendResponse({ success: true }));
    return true;
  }
  if (msg.action === 'clearHistory') {
    chrome.storage.local.set({ slotHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// ─── Helpers ───────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
