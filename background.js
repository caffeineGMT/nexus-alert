// NEXUS Alert — Background Service Worker
// Polls CBP's public scheduler API for available appointment slots

import { isSlotInDateRange, isSlotInTimeRange, isDuplicate, pruneOldSlots } from './src/slotFilters.js';
import { initSentry, captureError, setUser } from './src/sentry.js';

// Initialize error tracking
initSentry();

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
  soundType: 'chime',
  soundVolume: 70,
  autoOpenBooking: false,
  desktopNotificationsEnabled: true,
  badgeEnabled: true,
  notifFrequency: '30',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  favoriteLocations: [],
  notifiedSlots: {},
  tier: 'free',
  email: '',
  lastCheckedAt: null,
};

// ─── Initialization ────────────────────────────────────────────────

// Helper function to track events via Plausible
async function trackEvent(eventName, data = {}) {
  // Fire-and-forget: send both analytics requests in parallel, don't block caller
  const requests = [
    fetch('https://api.nexus-alert.com/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: eventName, timestamp: Date.now(), metadata: data }),
    }),
    fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'nexus-alert.com', name: eventName, url: 'ext://nexus-alert', props: data }),
    }),
  ];
  Promise.allSettled(requests).catch(() => {});
}

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
    captureError(err, { context: 'fetchAndCacheLocations' });
    await chrome.storage.local.set({
      lastError: 'Unable to connect to CBP servers. This is usually temporary — we\'ll retry automatically.',
      lastErrorTime: Date.now()
    });
    return {};
  }
}

// ─── Slot Checking ─────────────────────────────────────────────────

async function checkAllLocations() {
  // Single storage read instead of two separate reads
  const { config, lastCheckedAt } = await chrome.storage.local.get(['config', 'lastCheckedAt']);
  if (!config?.enabled) return;

  // Set user context for error tracking
  if (config.email) {
    setUser({ email: config.email, tier: config.tier || 'free' });
  }

  // Free tier: enforce 30-min rate limit
  if (config.tier !== 'premium') {
    if (lastCheckedAt && Date.now() - lastCheckedAt < 30 * 60 * 1000) {
      console.log('[NEXUS Alert] Free tier: skipping check, < 30min since last');
      return { skipped: true, reason: 'rate_limited', nextCheckIn: Math.ceil((30 * 60 * 1000 - (Date.now() - lastCheckedAt)) / 60000) };
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
        errorMessage = err.message || 'Unable to connect to CBP servers. This is usually temporary — we\'ll retry automatically.';
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

    // Only report to Sentry after 3 consecutive failures (reduces noise)
    if (newCount >= 3) {
      captureError(err, {
        context: 'checkAllLocations',
        failureCount: newCount,
        locations: config.locations,
      });
    }

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
    throw new Error(`CBP returned error ${resp.status} for location ${locationId}. Retrying shortly.`);
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

// ─── Quiet Hours Check ──────────────────────────────────────────────

function isInQuietHours(config) {
  if (!config.quietHoursEnabled) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = (config.quietHoursStart || '22:00').split(':').map(Number);
  const [endH, endM] = (config.quietHoursEnd || '07:00').split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  // Wraps midnight (e.g., 22:00 - 07:00)
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

// ─── Notification Frequency Check ───────────────────────────────────

function shouldReNotify(key, notified, config) {
  const freq = config.notifFrequency || '30';
  const lastNotifiedAt = notified[key];
  if (!lastNotifiedAt) return true; // Never notified

  if (freq === 'once') return false;
  if (freq === 'always') return true;

  const minutesSince = (Date.now() - lastNotifiedAt) / 60000;
  return minutesSince >= parseInt(freq);
}

// ─── Notifications ─────────────────────────────────────────────────

async function notifyNewSlots(results, config) {
  // Skip notifications during quiet hours
  if (isInQuietHours(config)) {
    console.log('[NEXUS Alert] Quiet hours active, skipping notifications');
    return;
  }

  const { locations } = await chrome.storage.local.get('locations');
  const notified = config.notifiedSlots || {};
  let newCount = 0;

  for (const { locationId, slots } of results) {
    const locName = locations?.[locationId]?.name || `Location ${locationId}`;

    for (const slot of slots) {
      const key = `${locationId}-${slot.startTimestamp}`;

      if (!shouldReNotify(key, notified, config)) continue;

      newCount++;
      notified[key] = Date.now();

      // Only create desktop notification if enabled
      if (config.desktopNotificationsEnabled !== false) {
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
          title: `🎯 ${config.program || 'NEXUS'} Appointment Found!`,
          message: `${locName} — ${dateStr} at ${timeStr}\nSlots fill fast — tap to book before it's gone!`,
          priority: 2,
          requireInteraction: true,
          buttons: [{ title: 'Book This Slot →' }],
        });
      }
    }
  }

  if (newCount > 0) {
    // Track notification sent event (Plausible)
    trackEvent('notification_sent', {
      count: newCount,
      tier: config.tier || 'free',
      program: config.program || 'NEXUS'
    });

    // Play sound alert if enabled
    if (config.soundEnabled) {
      await playAlertSound(config.soundType, config.soundVolume);
    }

    // Auto-open booking page if enabled
    if (config.autoOpenBooking) {
      chrome.tabs.create({ url: 'https://ttp.cbp.dhs.gov/' });
    }

    // Clean old notified entries (older than 24 hours)
    config.notifiedSlots = pruneOldSlots(notified);
    await chrome.storage.local.set({ config });
    console.log(`[NEXUS Alert] Sent ${newCount} new notification(s)`);

    // Trigger referral prompt after first successful notification
    await checkAndPromptReferral();
  }
}

// ─── Sound Alert ───────────────────────────────────────────────────

async function playAlertSound(soundType, volume) {
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

    chrome.runtime.sendMessage({
      action: 'playSound',
      soundType: soundType || 'chime',
      volume: volume ?? 70
    });
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
  const { config } = await chrome.storage.local.get('config');
  if (config?.badgeEnabled === false) {
    await chrome.action.setBadgeText({ text: '' });
    return;
  }
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
    checkAllLocations().then((result) => {
      if (result && result.skipped) {
        sendResponse({ success: false, skipped: true, reason: result.reason, nextCheckIn: result.nextCheckIn });
      } else {
        sendResponse({ success: true });
      }
    });
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
  if (msg.action === 'trackEvent') {
    // Track conversion events for analytics
    const { event, data } = msg;
    console.log(`[NEXUS Alert] Event tracked: ${event}`, data);

    // Send to backend analytics API
    fetch('https://api.nexus-alert.com/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: Date.now(),
      }),
    }).catch(err => {
      console.error('[NEXUS Alert] Failed to track event:', err);
    });

    sendResponse({ success: true });
    return true;
  }
  if (msg.action === 'testSound') {
    playAlertSound(msg.soundType, msg.volume).then(() => sendResponse({ success: true }));
    return true;
  }
});

// ─── Helpers ───────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Referral Prompts ──────────────────────────────────────────────

async function checkAndPromptReferral() {
  const { firstSlotNotifiedAt, referralPromptShown } = await chrome.storage.local.get([
    'firstSlotNotifiedAt',
    'referralPromptShown',
  ]);

  // Set the timestamp of first successful notification
  if (!firstSlotNotifiedAt) {
    await chrome.storage.local.set({ firstSlotNotifiedAt: Date.now() });
  }

  // Show referral prompt only once, after first successful notification
  if (!referralPromptShown && firstSlotNotifiedAt) {
    const { config } = await chrome.storage.local.get('config');
    const email = config?.email || '';

    if (email) {
      // Generate referral code
      const code = btoa(email).substring(0, 8).toUpperCase();
      const shareUrl = `https://nexus-alert.com?ref=${code}`;

      // Show notification with referral CTA
      chrome.notifications.create('referral-prompt', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🎉 Loving NEXUS Alert? Share the love!',
        message: 'Refer a friend and you both get 1 month of Premium free. Tap to grab your unique link.',
        priority: 1,
        requireInteraction: false,
      });

      await chrome.storage.local.set({ referralPromptShown: true });
    }
  }
}

// Handle referral notification clicks
chrome.notifications.onClicked.addListener((notifId) => {
  if (notifId === 'referral-prompt') {
    chrome.action.openPopup();
  }
});
