// NEXUS Alert — Centralized Storage Manager
// Provides atomic operations, cross-context sync, data migration, and race condition prevention

/**
 * Mutex implementation for atomic storage operations
 * Prevents race conditions when multiple contexts (popup, background) access storage
 */
class StorageMutex {
  constructor() {
    this.locks = new Map(); // key -> Promise
    this.queue = new Map(); // key -> Array of pending operations
  }

  /**
   * Acquire lock for a key
   * @param {string} key - Storage key to lock
   * @returns {Promise<Function>} Release function
   */
  async acquire(key) {
    // Wait for existing lock to release
    while (this.locks.has(key)) {
      await this.locks.get(key);
    }

    // Create new lock
    let releaseFn;
    const lockPromise = new Promise(resolve => {
      releaseFn = resolve;
    });

    this.locks.set(key, lockPromise);

    // Return release function
    return () => {
      this.locks.delete(key);
      releaseFn();
    };
  }

  /**
   * Execute operation with lock
   * @param {string} key - Storage key to lock
   * @param {Function} operation - Async operation to execute
   * @returns {Promise<*>} Operation result
   */
  async withLock(key, operation) {
    const release = await this.acquire(key);
    try {
      return await operation();
    } finally {
      release();
    }
  }
}

/**
 * Write-Ahead Log for critical operations
 * Ensures data isn't lost if extension crashes during write
 */
class WriteAheadLog {
  constructor() {
    this.logKey = '__wal_pending_writes';
  }

  /**
   * Log a pending write operation
   * @param {string} key - Storage key
   * @param {*} value - Value to write
   */
  async logWrite(key, value) {
    const log = await chrome.storage.local.get(this.logKey);
    const pending = log[this.logKey] || [];
    pending.push({
      key,
      value,
      timestamp: Date.now(),
      id: `${key}-${Date.now()}-${Math.random()}`
    });
    await chrome.storage.local.set({ [this.logKey]: pending });
  }

  /**
   * Commit a write (remove from log)
   * @param {string} key - Storage key
   */
  async commitWrite(key) {
    const log = await chrome.storage.local.get(this.logKey);
    const pending = (log[this.logKey] || []).filter(entry => entry.key !== key);
    await chrome.storage.local.set({ [this.logKey]: pending });
  }

  /**
   * Recover pending writes (run on startup)
   */
  async recover() {
    const log = await chrome.storage.local.get(this.logKey);
    const pending = log[this.logKey] || [];

    if (pending.length > 0) {
      console.log(`[WAL] Recovering ${pending.length} pending write(s)...`);

      for (const entry of pending) {
        try {
          await chrome.storage.local.set({ [entry.key]: entry.value });
          console.log(`[WAL] Recovered write for key: ${entry.key}`);
        } catch (err) {
          console.error(`[WAL] Failed to recover write for ${entry.key}:`, err);
        }
      }

      // Clear log after recovery
      await chrome.storage.local.set({ [this.logKey]: [] });
    }
  }
}

/**
 * Centralized Storage Manager
 * Main interface for all storage operations across popup, background, and content scripts
 */
class StorageManager {
  constructor() {
    this.cache = new Map();
    this.pendingWrites = new Map();
    this.writeTimer = null;
    this.mutex = new StorageMutex();
    this.wal = new WriteAheadLog();
    this.listeners = new Map(); // key -> Set of callbacks
    this.initialized = false;
    this.currentVersion = 3; // Current schema version

    // Configuration
    this.WRITE_DEBOUNCE_MS = 300;
    this.CRITICAL_KEYS = ['config', 'licenseKey', 'subscriptionData']; // Immediate writes
    this.MAX_RETRY_ATTEMPTS = 3;
    this.RETRY_DELAY_MS = 1000;

    // Bind methods for use as event handlers
    this.handleStorageChange = this.handleStorageChange.bind(this);

    // Listen for storage changes from other contexts
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.onChanged.addListener(this.handleStorageChange);
    }
  }

  /**
   * Initialize storage manager
   * Runs migrations, recovers pending writes, preloads cache
   * @param {string[]} preloadKeys - Keys to preload into cache
   */
  async init(preloadKeys = []) {
    if (this.initialized) return;

    performance.mark('storage-manager-init-start');

    try {
      // 1. Recover any pending writes from previous session
      await this.wal.recover();

      // 2. Run migrations if needed
      await this.runMigrations();

      // 3. Preload cache
      const data = await chrome.storage.local.get(preloadKeys.length > 0 ? preloadKeys : null);
      for (const [key, value] of Object.entries(data)) {
        this.cache.set(key, value);
      }

      this.initialized = true;
      performance.mark('storage-manager-init-end');
      performance.measure('storage-manager-init', 'storage-manager-init-start', 'storage-manager-init-end');

      console.log(`[StorageManager] Initialized with ${this.cache.size} cached keys`);
    } catch (err) {
      console.error('[StorageManager] Initialization failed:', err);
      throw err;
    }
  }

  /**
   * Handle storage changes from other contexts
   * Invalidates cache and notifies listeners
   * @param {Object} changes - Chrome storage changes
   * @param {string} areaName - Storage area (local/sync)
   */
  handleStorageChange(changes, areaName) {
    if (areaName !== 'local') return;

    for (const [key, change] of Object.entries(changes)) {
      // Update cache
      if (change.newValue !== undefined) {
        this.cache.set(key, change.newValue);
      } else {
        this.cache.delete(key);
      }

      // Notify listeners
      const listeners = this.listeners.get(key);
      if (listeners) {
        for (const callback of listeners) {
          try {
            callback(change.newValue, change.oldValue);
          } catch (err) {
            console.error(`[StorageManager] Listener error for ${key}:`, err);
          }
        }
      }

      // Notify wildcard listeners
      const wildcardListeners = this.listeners.get('*');
      if (wildcardListeners) {
        for (const callback of wildcardListeners) {
          try {
            callback(key, change.newValue, change.oldValue);
          } catch (err) {
            console.error(`[StorageManager] Wildcard listener error:`, err);
          }
        }
      }
    }
  }

  /**
   * Subscribe to changes for a specific key
   * @param {string} key - Storage key (use '*' for all changes)
   * @param {Function} callback - Called when key changes
   * @returns {Function} Unsubscribe function
   */
  onChange(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  /**
   * Get value from storage with caching
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default if key doesn't exist
   * @returns {Promise<*>} Value
   */
  async get(key, defaultValue = null) {
    // Return from cache if available
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Fallback to storage
    try {
      const result = await chrome.storage.local.get(key);
      const value = result[key] ?? defaultValue;
      this.cache.set(key, value);
      return value;
    } catch (err) {
      console.error(`[StorageManager] Get failed for ${key}:`, err);
      return defaultValue;
    }
  }

  /**
   * Get multiple keys in one batched call
   * @param {string[]} keys - Keys to fetch
   * @returns {Promise<Object>} Key-value pairs
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

    // Fetch missing keys
    if (missingKeys.length > 0) {
      try {
        const storageData = await chrome.storage.local.get(missingKeys);
        for (const [key, value] of Object.entries(storageData)) {
          this.cache.set(key, value);
          result[key] = value;
        }
      } catch (err) {
        console.error('[StorageManager] Batch get failed:', err);
      }
    }

    return result;
  }

  /**
   * Set value with optional immediate write
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {Object} options - { immediate: boolean, useWAL: boolean }
   * @returns {Promise<void>}
   */
  async set(key, value, options = {}) {
    const { immediate = this.CRITICAL_KEYS.includes(key), useWAL = immediate } = options;

    // Update cache immediately
    this.cache.set(key, value);

    if (immediate) {
      // Write immediately with mutex
      await this.mutex.withLock(key, async () => {
        try {
          if (useWAL) {
            await this.wal.logWrite(key, value);
          }
          await this.writeWithRetry(key, value);
          if (useWAL) {
            await this.wal.commitWrite(key);
          }
        } catch (err) {
          console.error(`[StorageManager] Immediate write failed for ${key}:`, err);
          throw err;
        }
      });
    } else {
      // Queue for debounced write
      this.pendingWrites.set(key, value);
      clearTimeout(this.writeTimer);
      this.writeTimer = setTimeout(() => {
        this.flush();
      }, this.WRITE_DEBOUNCE_MS);
    }
  }

  /**
   * Atomic update operation (read-modify-write with lock)
   * Prevents race conditions when updating nested objects
   * @param {string} key - Storage key
   * @param {Function} updater - (currentValue) => newValue
   * @param {*} defaultValue - Default if key doesn't exist
   * @returns {Promise<*>} New value
   */
  async update(key, updater, defaultValue = null) {
    return await this.mutex.withLock(key, async () => {
      const current = await this.get(key, defaultValue);
      const updated = await updater(current);
      await this.set(key, updated, { immediate: true });
      return updated;
    });
  }

  /**
   * Transaction: Update multiple keys atomically
   * All writes succeed or all fail
   * @param {Object} updates - Key-value pairs
   * @returns {Promise<void>}
   */
  async transaction(updates) {
    const keys = Object.keys(updates);
    const lockKey = `__transaction_${keys.join('_')}`;

    await this.mutex.withLock(lockKey, async () => {
      try {
        // Log all writes
        for (const [key, value] of Object.entries(updates)) {
          await this.wal.logWrite(key, value);
          this.cache.set(key, value);
        }

        // Write all at once
        await chrome.storage.local.set(updates);

        // Commit all
        for (const key of keys) {
          await this.wal.commitWrite(key);
        }

        console.log(`[StorageManager] Transaction committed: ${keys.length} keys`);
      } catch (err) {
        console.error('[StorageManager] Transaction failed:', err);
        // Rollback cache
        for (const key of keys) {
          this.cache.delete(key);
        }
        throw err;
      }
    });
  }

  /**
   * Write with exponential backoff retry
   * @param {string} key - Storage key
   * @param {*} value - Value to write
   */
  async writeWithRetry(key, value, attempt = 1) {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (err) {
      if (attempt >= this.MAX_RETRY_ATTEMPTS) {
        throw err;
      }

      const delay = this.RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(`[StorageManager] Write failed for ${key}, retry ${attempt}/${this.MAX_RETRY_ATTEMPTS} in ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
      await this.writeWithRetry(key, value, attempt + 1);
    }
  }

  /**
   * Flush all pending writes
   * @returns {Promise<void>}
   */
  async flush() {
    if (this.pendingWrites.size === 0) return;

    const writes = Object.fromEntries(this.pendingWrites);
    this.pendingWrites.clear();

    try {
      await chrome.storage.local.set(writes);
      console.log(`[StorageManager] Flushed ${Object.keys(writes).length} key(s)`);
    } catch (err) {
      console.error('[StorageManager] Flush failed:', err);
      // Restore to pending
      for (const [key, value] of Object.entries(writes)) {
        this.pendingWrites.set(key, value);
      }
      throw err;
    }
  }

  /**
   * Delete key from storage
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  async remove(key) {
    await this.mutex.withLock(key, async () => {
      this.cache.delete(key);
      this.pendingWrites.delete(key);
      await chrome.storage.local.remove(key);
    });
  }

  /**
   * Clear all storage (with optional filter)
   * @param {Function} filter - (key, value) => boolean to keep
   * @returns {Promise<void>}
   */
  async clear(filter = null) {
    if (!filter) {
      this.cache.clear();
      this.pendingWrites.clear();
      await chrome.storage.local.clear();
      return;
    }

    // Selective clear
    const all = await chrome.storage.local.get(null);
    const toRemove = [];

    for (const [key, value] of Object.entries(all)) {
      if (!filter(key, value)) {
        toRemove.push(key);
        this.cache.delete(key);
      }
    }

    if (toRemove.length > 0) {
      await chrome.storage.local.remove(toRemove);
    }
  }

  /**
   * Run pending migrations
   */
  async runMigrations() {
    const { schemaVersion = 0 } = await chrome.storage.local.get('schemaVersion');

    if (schemaVersion >= this.currentVersion) {
      console.log(`[StorageManager] Schema up to date (v${schemaVersion})`);
      return;
    }

    console.log(`[StorageManager] Migrating from v${schemaVersion} to v${this.currentVersion}...`);

    // Import and run migrations
    try {
      const { runMigrations } = await import('./migrations.js');
      await runMigrations(schemaVersion, this.currentVersion, this);

      // Update schema version
      await chrome.storage.local.set({ schemaVersion: this.currentVersion });
      console.log(`[StorageManager] Migration complete: v${this.currentVersion}`);
    } catch (err) {
      console.error('[StorageManager] Migration failed:', err);
      throw err;
    }
  }

  /**
   * Get storage usage stats
   * @returns {Promise<Object>} Usage stats
   */
  async getStats() {
    try {
      const bytesInUse = await chrome.storage.local.getBytesInUse();
      const quota = chrome.storage.local.QUOTA_BYTES || 10485760; // 10MB default

      return {
        bytesInUse,
        quota,
        percentUsed: Math.round((bytesInUse / quota) * 100),
        cacheSize: this.cache.size,
        pendingWrites: this.pendingWrites.size
      };
    } catch (err) {
      console.error('[StorageManager] Failed to get stats:', err);
      return null;
    }
  }

  /**
   * Cleanup on extension suspend/unload
   * Flushes pending writes and commits WAL
   */
  async cleanup() {
    console.log('[StorageManager] Cleanup started...');

    try {
      // Flush any pending writes
      await this.flush();

      // Clear timers
      clearTimeout(this.writeTimer);

      console.log('[StorageManager] Cleanup complete');
    } catch (err) {
      console.error('[StorageManager] Cleanup failed:', err);
    }
  }
}

// Singleton instance
export const storageManager = new StorageManager();

// Helper: Ensure cleanup on extension suspend
if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Service workers: Listen for suspend event
  self.addEventListener?.('suspend', () => {
    storageManager.cleanup();
  });

  // Traditional background pages: Listen for unload
  window.addEventListener?.('beforeunload', () => {
    storageManager.cleanup();
  });
}

export default storageManager;
