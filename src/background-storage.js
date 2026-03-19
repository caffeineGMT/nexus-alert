// NEXUS Alert — Background Storage Adapter
// Provides helper functions for background script using centralized storage manager

import { storageManager } from './storage-manager.js';

/**
 * Initialize storage manager for background context
 * Must be called during service worker startup
 */
export async function initBackgroundStorage() {
  const PRELOAD_KEYS = [
    'config',
    'locations',
    'slotHistory',
    'lastCheck',
    'lastFoundSlots',
    'userProfile',
    'failureCount',
    'lastError',
    'lastErrorTime',
  ];

  await storageManager.init(PRELOAD_KEYS);
  console.log('[BackgroundStorage] Initialized');
}

/**
 * Get config with safe defaults
 */
export async function getConfig() {
  return await storageManager.get('config', {
    enabled: true,
    program: 'NEXUS',
    interval: 3,
    lastCheck: null,
    locations: [5020], // Blaine, WA
    filters: {},
    notifications: {
      desktop: true,
      badge: true,
      autoOpen: false,
      frequency: '30',
      quietHours: false,
      quietFrom: '22:00',
      quietTo: '07:00',
    },
    sound: {
      enabled: true,
      type: 'chime',
      volume: 70,
    },
    favorites: [],
    snoozeUntil: null,
    snoozeAutoResume: true,
    dailyNotificationCap: 50,
    burstProtection: true,
    burstMaxNotifs: 5,
    burstWindowMinutes: 10,
    perLocationCooldown: 5,
    respectOsQuietHours: true,
    notificationStats: {
      totalSent: 0,
      lastResetDate: null,
      dailyCount: 0,
      burstHistory: [],
      locationLastNotified: {},
    },
    notifiedSlots: {},
  });
}

/**
 * Update config atomically (prevents race conditions)
 */
export async function updateConfig(partial) {
  return await storageManager.update('config', async (current) => {
    const defaults = await getConfig();
    return { ...defaults, ...current, ...partial };
  });
}

/**
 * Get user profile
 */
export async function getUserProfile() {
  return await storageManager.get('userProfile', {
    email: '',
    plan: 'free',
    licenseKey: null,
    installDate: Date.now(),
    referralCode: null,
    referredBy: null,
  });
}

/**
 * Update user profile atomically
 */
export async function updateUserProfile(partial) {
  return await storageManager.update('userProfile', async (current) => {
    const defaults = await getUserProfile();
    return { ...defaults, ...current, ...partial };
  });
}

/**
 * Record slot in history atomically
 */
export async function recordSlotInHistory(slot) {
  return await storageManager.update('slotHistory', (history = []) => {
    const updated = [...history];
    updated.push({
      locationId: slot.locationId,
      startTimestamp: slot.startTimestamp,
      endTimestamp: slot.endTimestamp,
      seenAt: Date.now(),
    });

    // Keep last 500 entries
    return updated.slice(-500);
  });
}

/**
 * Update notification stats atomically
 */
export async function updateNotificationStats(updater) {
  return await storageManager.update('config', async (config) => {
    const stats = config.notificationStats || {
      totalSent: 0,
      lastResetDate: null,
      dailyCount: 0,
      burstHistory: [],
      locationLastNotified: {},
    };

    const updated = await updater(stats);

    return {
      ...config,
      notificationStats: updated,
    };
  });
}

/**
 * Get multiple values in one call
 */
export async function getBatch(keys) {
  return await storageManager.getBatch(keys);
}

/**
 * Transaction: Update multiple keys atomically
 */
export async function transaction(updates) {
  return await storageManager.transaction(updates);
}

/**
 * Subscribe to storage changes
 */
export function onChange(key, callback) {
  return storageManager.onChange(key, callback);
}

/**
 * Get storage stats
 */
export async function getStorageStats() {
  return await storageManager.getStats();
}

/**
 * Cleanup on service worker suspend
 */
export async function cleanup() {
  return await storageManager.cleanup();
}

// Auto-cleanup on suspend
if (typeof self !== 'undefined' && self.addEventListener) {
  self.addEventListener('suspend', () => {
    cleanup().catch(err => {
      console.error('[BackgroundStorage] Cleanup failed:', err);
    });
  });
}

export default {
  init: initBackgroundStorage,
  getConfig,
  updateConfig,
  getUserProfile,
  updateUserProfile,
  recordSlotInHistory,
  updateNotificationStats,
  getBatch,
  transaction,
  onChange,
  getStorageStats,
  cleanup,
};
