// NEXUS Alert — Optimized Storage Module
// High-performance Chrome storage with caching, batching, and debouncing

class StorageCache {
  constructor() {
    this.cache = new Map();
    this.pendingWrites = new Map();
    this.writeTimer = null;
    this.WRITE_DEBOUNCE_MS = 300;
    this.initialized = false;
  }

  /**
   * Initialize cache by batch-reading all keys from storage
   * @param {string[]} keys - Keys to preload
   */
  async init(keys = []) {
    if (this.initialized) return;

    performance.mark('storage-init-start');

    try {
      // Batch read all keys in one call
      const data = await chrome.storage.local.get(keys.length > 0 ? keys : null);

      // Populate cache
      for (const [key, value] of Object.entries(data)) {
        this.cache.set(key, value);
      }

      this.initialized = true;
      performance.mark('storage-init-end');
      performance.measure('storage-init', 'storage-init-start', 'storage-init-end');

      console.log(`[StorageCache] Initialized with ${this.cache.size} keys`);
    } catch (err) {
      console.error('[StorageCache] Init failed:', err);
      throw err;
    }
  }

  /**
   * Get value from cache (instant) or storage (async fallback)
   * @param {string} key
   * @param {*} defaultValue
   */
  async get(key, defaultValue = null) {
    // Return from cache if available
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Fallback to storage if not in cache
    try {
      const result = await chrome.storage.local.get(key);
      const value = result[key] ?? defaultValue;
      this.cache.set(key, value);
      return value;
    } catch (err) {
      console.error(`[StorageCache] Get failed for ${key}:`, err);
      return defaultValue;
    }
  }

  /**
   * Get multiple values in one batched call
   * @param {string[]} keys
   */
  async getBatch(keys) {
    const result = {};
    const missingKeys = [];

    // Check cache first
    for (const key of keys) {
      if (this.cache.has(key)) {
        result[key] = this.cache.get(key);
      } else {
        missingKeys.push(key);
      }
    }

    // Fetch missing keys from storage in one call
    if (missingKeys.length > 0) {
      try {
        const storageData = await chrome.storage.local.get(missingKeys);
        for (const [key, value] of Object.entries(storageData)) {
          this.cache.set(key, value);
          result[key] = value;
        }
      } catch (err) {
        console.error('[StorageCache] Batch get failed:', err);
      }
    }

    return result;
  }

  /**
   * Set value with debounced write
   * Updates cache immediately, writes to storage after debounce delay
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    // Update cache immediately for instant reads
    this.cache.set(key, value);

    // Queue for debounced write
    this.pendingWrites.set(key, value);

    // Debounce writes
    clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      this.flush();
    }, this.WRITE_DEBOUNCE_MS);
  }

  /**
   * Set multiple values
   * @param {Object} items - Key-value pairs
   */
  setBatch(items) {
    for (const [key, value] of Object.entries(items)) {
      this.cache.set(key, value);
      this.pendingWrites.set(key, value);
    }

    clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      this.flush();
    }, this.WRITE_DEBOUNCE_MS);
  }

  /**
   * Immediately flush all pending writes to storage
   */
  async flush() {
    if (this.pendingWrites.size === 0) return;

    const writes = Object.fromEntries(this.pendingWrites);
    this.pendingWrites.clear();

    try {
      await chrome.storage.local.set(writes);
      console.log(`[StorageCache] Flushed ${Object.keys(writes).length} keys`);
    } catch (err) {
      console.error('[StorageCache] Flush failed:', err);
      // Restore to pending on failure
      for (const [key, value] of Object.entries(writes)) {
        this.pendingWrites.set(key, value);
      }
    }
  }

  /**
   * Clear cache and optionally storage
   * @param {boolean} clearStorage - Also clear storage
   */
  async clear(clearStorage = false) {
    this.cache.clear();
    this.pendingWrites.clear();
    clearTimeout(this.writeTimer);

    if (clearStorage) {
      try {
        await chrome.storage.local.clear();
        console.log('[StorageCache] Storage cleared');
      } catch (err) {
        console.error('[StorageCache] Clear failed:', err);
      }
    }
  }
}

// Singleton instance
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
  const current = await getConfig();
  const updated = { ...current, ...partial };
  storage.set('config', updated);
  return updated;
}

export async function getSlotHistory() {
  return await storage.get('slotHistory', []);
}

export async function addSlotToHistory(slot) {
  const history = await getSlotHistory();
  history.unshift({ ...slot, timestamp: new Date().toISOString() });

  // Keep last 100 slots
  if (history.length > 100) {
    history.splice(100);
  }

  storage.set('slotHistory', history);
  return history;
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
