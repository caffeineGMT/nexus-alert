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
  // ─── New: Snooze Settings ────────────────────────────────
  snoozeUntil: null, // ISO timestamp or null
  snoozeAutoResume: true,
  // ─── New: Smart Throttling Settings ──────────────────────
  dailyNotificationCap: 50, // Max notifications per day (free: 50, premium: unlimited)
  burstProtection: true, // Prevent notification spam
  burstMaxNotifs: 5, // Max 5 notifications
  burstWindowMinutes: 10, // Within 10 minutes
  perLocationCooldown: 5, // Minutes between notifications for same location
  respectOsQuietHours: true, // Auto-detect OS Do Not Disturb (where possible)
  // ─── Notification Analytics ──────────────────────────────
  notificationStats: {
    totalSent: 0,
    lastResetDate: null,
    dailyCount: 0,
    burstHistory: [], // Array of timestamps for burst detection
    locationLastNotified: {}, // { locationId: timestamp }
  },
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

// ─── OS Do Not Disturb Detection ────────────────────────────────────

async function isOsInQuietMode() {
  // Chrome extension APIs don't expose OS DND status directly
  // Best effort: check notification permission state (some OSes revoke when DND active)
  try {
    const permission = await chrome.permissions.contains({ permissions: ['notifications'] });
    if (!permission) return true; // Notifications blocked = treat as DND

    // Platform-specific heuristics
    const platformInfo = await chrome.runtime.getPlatformInfo();
    const os = platformInfo.os;

    // On macOS: Check if screen is locked (heuristic via idle state)
    if (os === 'mac') {
      const idleState = await chrome.idle.queryState(60); // Check if idle for 60s
      if (idleState === 'locked') return true;
    }

    return false;
  } catch (err) {
    console.warn('[NEXUS Alert] Could not detect OS quiet mode:', err);
    return false;
  }
}

// ─── Snooze Check ────────────────────────────────────────────────────

function isSnoozed(config) {
  if (!config.snoozeUntil) return false;
  const snoozeEnd = new Date(config.snoozeUntil).getTime();
  const now = Date.now();

  if (now >= snoozeEnd) {
    // Snooze period ended - auto-clear if enabled
    if (config.snoozeAutoResume) {
      return false; // Will be cleared by caller
    }
  }

  return now < snoozeEnd;
}

// ─── Smart Notification Throttling ──────────────────────────────────

async function shouldThrottle(config, locationId) {
  const stats = config.notificationStats || DEFAULT_CONFIG.notificationStats;
  const now = Date.now();

  // 1. Daily cap check (reset at midnight local time)
  const today = new Date().toDateString();
  if (stats.lastResetDate !== today) {
    // Reset daily counter
    stats.lastResetDate = today;
    stats.dailyCount = 0;
  }

  const dailyCap = config.tier === 'premium' ? Infinity : (config.dailyNotificationCap || 50);
  if (stats.dailyCount >= dailyCap) {
    console.log(`[NEXUS Alert] Daily notification cap reached (${dailyCap})`);
    return { throttled: true, reason: 'daily_cap', cap: dailyCap };
  }

  // 2. Burst protection (prevent notification spam)
  if (config.burstProtection) {
    const burstWindow = (config.burstWindowMinutes || 10) * 60 * 1000;
    const burstMax = config.burstMaxNotifs || 5;

    // Clean old entries from burst history
    stats.burstHistory = (stats.burstHistory || []).filter(t => now - t < burstWindow);

    if (stats.burstHistory.length >= burstMax) {
      console.log(`[NEXUS Alert] Burst protection active: ${burstMax} notifs in ${config.burstWindowMinutes}min`);
      return { throttled: true, reason: 'burst_protection', burst: stats.burstHistory.length };
    }
  }

  // 3. Per-location cooldown (don't spam same location)
  if (locationId && config.perLocationCooldown) {
    stats.locationLastNotified = stats.locationLastNotified || {};
    const lastNotified = stats.locationLastNotified[locationId];
    const cooldownMs = config.perLocationCooldown * 60 * 1000;

    if (lastNotified && now - lastNotified < cooldownMs) {
      const remainingMin = Math.ceil((cooldownMs - (now - lastNotified)) / 60000);
      console.log(`[NEXUS Alert] Location ${locationId} cooldown active (${remainingMin}min remaining)`);
      return { throttled: true, reason: 'location_cooldown', remainingMin };
    }
  }

  return { throttled: false };
}

async function recordNotification(config, locationId) {
  const stats = config.notificationStats || DEFAULT_CONFIG.notificationStats;
  const now = Date.now();

  // Increment daily counter
  stats.dailyCount = (stats.dailyCount || 0) + 1;
  stats.totalSent = (stats.totalSent || 0) + 1;

  // Add to burst history
  stats.burstHistory = stats.burstHistory || [];
  stats.burstHistory.push(now);

  // Update per-location timestamp
  if (locationId) {
    stats.locationLastNotified = stats.locationLastNotified || {};
    stats.locationLastNotified[locationId] = now;
  }

  // Save updated stats
  config.notificationStats = stats;
  await chrome.storage.local.set({ config });
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
  // 1. Check if snoozed
  if (isSnoozed(config)) {
    const snoozeEnd = new Date(config.snoozeUntil);
    const remainingMin = Math.ceil((snoozeEnd.getTime() - Date.now()) / 60000);
    console.log(`[NEXUS Alert] Notifications snoozed for ${remainingMin} more minute(s)`);
    return;
  }

  // Auto-clear expired snooze
  if (config.snoozeUntil && Date.now() >= new Date(config.snoozeUntil).getTime()) {
    config.snoozeUntil = null;
    await chrome.storage.local.set({ config });
  }

  // 2. Check quiet hours
  if (isInQuietHours(config)) {
    console.log('[NEXUS Alert] Quiet hours active, skipping notifications');
    return;
  }

  // 3. Check OS Do Not Disturb (if enabled)
  if (config.respectOsQuietHours) {
    const osQuiet = await isOsInQuietMode();
    if (osQuiet) {
      console.log('[NEXUS Alert] OS Do Not Disturb active, skipping notifications');
      return;
    }
  }

  const { locations } = await chrome.storage.local.get('locations');
  const notified = config.notifiedSlots || {};
  let newCount = 0;
  let throttledCount = 0;

  for (const { locationId, slots } of results) {
    const locName = locations?.[locationId]?.name || `Location ${locationId}`;

    // 4. Check smart throttling for this location
    const throttleCheck = await shouldThrottle(config, locationId);
    if (throttleCheck.throttled) {
      throttledCount++;
      console.log(`[NEXUS Alert] Throttled notifications for ${locName}: ${throttleCheck.reason}`);
      continue; // Skip this location
    }

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
          buttons: [
            { title: 'Book This Slot →' },
            { title: 'Snooze 1hr' }
          ],
        });
      }

      // Record this notification in stats
      await recordNotification(config, locationId);
    }
  }

  if (newCount > 0) {
    // Track notification sent event (Plausible)
    trackEvent('notification_sent', {
      count: newCount,
      tier: config.tier || 'free',
      program: config.program || 'NEXUS',
      throttled: throttledCount,
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
    console.log(`[NEXUS Alert] Sent ${newCount} new notification(s)${throttledCount > 0 ? `, throttled ${throttledCount}` : ''}`);

    // Trigger referral prompt after first successful notification
    await checkAndPromptReferral();
  }

  if (throttledCount > 0 && newCount === 0) {
    console.log(`[NEXUS Alert] All notifications throttled (${throttledCount} locations)`);
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
chrome.notifications.onButtonClicked.addListener(async (notifId, btnIndex) => {
  if (notifId.startsWith('slot-')) {
    if (btnIndex === 0) {
      // Book This Slot button
      chrome.tabs.create({ url: 'https://ttp.cbp.dhs.gov/' });
    } else if (btnIndex === 1) {
      // Snooze 1hr button
      await snoozeNotifications(60);
      chrome.notifications.create('snooze-confirmation', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '⏸️ Notifications Snoozed',
        message: 'You won\'t receive alerts for the next hour. We\'ll resume automatically.',
        priority: 0,
      });
    }
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

// Snooze helper function
async function snoozeNotifications(minutes) {
  const { config } = await chrome.storage.local.get('config');
  const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  config.snoozeUntil = snoozeUntil;
  await chrome.storage.local.set({ config });
  console.log(`[NEXUS Alert] Snoozed until ${snoozeUntil}`);

  // Track snooze event
  trackEvent('notification_snoozed', { duration_minutes: minutes, tier: config.tier || 'free' });
}

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
  // ─── New: Snooze Controls ────────────────────────────────────────
  if (msg.action === 'snooze') {
    snoozeNotifications(msg.minutes).then(() => sendResponse({ success: true }));
    return true;
  }
  if (msg.action === 'unsnooze') {
    chrome.storage.local.get('config', async ({ config }) => {
      config.snoozeUntil = null;
      await chrome.storage.local.set({ config });
      sendResponse({ success: true });
    });
    return true;
  }
  if (msg.action === 'getSnoozeStatus') {
    chrome.storage.local.get('config', ({ config }) => {
      const snoozed = isSnoozed(config);
      const remaining = snoozed ? Math.ceil((new Date(config.snoozeUntil).getTime() - Date.now()) / 60000) : 0;
      sendResponse({ snoozed, snoozeUntil: config.snoozeUntil, remainingMinutes: remaining });
    });
    return true;
  }
  if (msg.action === 'resetNotificationStats') {
    chrome.storage.local.get('config', async ({ config }) => {
      config.notificationStats = DEFAULT_CONFIG.notificationStats;
      await chrome.storage.local.set({ config });
      sendResponse({ success: true });
    });
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
