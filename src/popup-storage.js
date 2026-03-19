// NEXUS Alert — Storage Module (Refactored to use centralized StorageManager)
// Provides backward-compatible API while delegating to the new storage manager

import { storageManager } from './storage-manager.js';

/**
 * Legacy StorageCache wrapper
 * Delegates to centralized StorageManager for better race condition handling
 */
class StorageCache {
  constructor() {
    // Delegate to storage manager
    this._manager = storageManager;
  }

  async init(keys = []) {
    return await this._manager.init(keys);
  }

  async get(key, defaultValue = null) {
    return await this._manager.get(key, defaultValue);
  }

  async getBatch(keys) {
    return await this._manager.getBatch(keys);
  }

  set(key, value) {
    // Non-blocking set (backward compatible)
    this._manager.set(key, value).catch(err => {
      console.error(`[StorageCache] Set failed for ${key}:`, err);
    });
  }

  setBatch(items) {
    for (const [key, value] of Object.entries(items)) {
      this.set(key, value);
    }
  }

  async flush() {
    return await this._manager.flush();
  }

  async clear(clearStorage = false) {
    if (clearStorage) {
      return await this._manager.clear();
    } else {
      this._manager.cache.clear();
      this._manager.pendingWrites.clear();
    }
  }

  // Expose storage manager for advanced usage
  get manager() {
    return this._manager;
  }
}

// Singleton instance (backward compatible)
export const storage = new StorageCache();

// Helper functions for common operations
export async function getConfig() {
  return await storage.get('config', {
    enabled: true,
    program: 'NEXUS',
    interval: 3,
    lastCheck: null,
    locations: [],
    filters: {},
    notifications: {
      desktop: true,
      badge: true,
      autoOpen: false,
      frequency: '30',
      quietHours: false,
      quietFrom: '22:00',
      quietTo: '07:00'
    },
    sound: {
      enabled: true,
      type: 'chime',
      volume: 70
    },
    favorites: [],
    email: '',
    plan: 'free',
    licenseKey: null
  });
}

export async function updateConfig(partial) {
  // Use atomic update to prevent race conditions
  return await storage.manager.update('config', async (current) => {
    const defaults = {
      enabled: true,
      program: 'NEXUS',
      interval: 3,
      lastCheck: null,
      locations: [],
      filters: {},
      notifications: {
        desktop: true,
        badge: true,
        autoOpen: false,
        frequency: '30',
        quietHours: false,
        quietFrom: '22:00',
        quietTo: '07:00'
      },
      sound: {
        enabled: true,
        type: 'chime',
        volume: 70
      },
      favorites: [],
    };
    return { ...defaults, ...current, ...partial };
  });
}

export async function getSlotHistory() {
  return await storage.get('slotHistory', []);
}

export async function addSlotToHistory(slot) {
  // Use atomic update to prevent race conditions
  return await storage.manager.update('slotHistory', (history = []) => {
    const updated = [...history];
    updated.unshift({ ...slot, timestamp: new Date().toISOString() });

    // Keep last 100 slots
    if (updated.length > 100) {
      updated.splice(100);
    }

    return updated;
  });
}

export async function clearSlotHistory() {
  storage.set('slotHistory', []);
}

// Initialize on import
if (typeof chrome !== 'undefined' && chrome.storage) {
  // Preload common keys for instant access
  const COMMON_KEYS = ['config', 'slotHistory', 'locations', 'liveSlots', 'referralStats'];
  storage.init(COMMON_KEYS).catch(err => {
    console.error('[popup-storage] Failed to initialize:', err);
  });
}
