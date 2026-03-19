// NEXUS Alert — Storage Manager Tests
// Comprehensive tests for race conditions, data integrity, and migration

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Chrome storage API
const mockStorage = {
  local: {
    data: {},
    listeners: [],

    async get(keys) {
      if (!keys) return { ...this.data };
      if (typeof keys === 'string') return { [keys]: this.data[keys] };
      if (Array.isArray(keys)) {
        const result = {};
        for (const key of keys) {
          if (key in this.data) result[key] = this.data[key];
        }
        return result;
      }
      return {};
    },

    async set(items) {
      const changes = {};
      for (const [key, value] of Object.entries(items)) {
        const oldValue = this.data[key];
        this.data[key] = value;
        changes[key] = { oldValue, newValue: value };
      }

      // Trigger change listeners
      for (const listener of this.listeners) {
        listener(changes, 'local');
      }
    },

    async remove(keys) {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const changes = {};
      for (const key of keysArray) {
        const oldValue = this.data[key];
        delete this.data[key];
        changes[key] = { oldValue };
      }

      for (const listener of this.listeners) {
        listener(changes, 'local');
      }
    },

    async clear() {
      const changes = {};
      for (const key of Object.keys(this.data)) {
        changes[key] = { oldValue: this.data[key] };
      }
      this.data = {};

      for (const listener of this.listeners) {
        listener(changes, 'local');
      }
    },

    async getBytesInUse() {
      return JSON.stringify(this.data).length;
    },

    QUOTA_BYTES: 10485760, // 10MB
  },

  onChanged: {
    addListener(callback) {
      mockStorage.local.listeners.push(callback);
    },
    removeListener(callback) {
      const index = mockStorage.local.listeners.indexOf(callback);
      if (index !== -1) mockStorage.local.listeners.splice(index, 1);
    },
  },
};

global.chrome = { storage: mockStorage };
global.performance = {
  mark: vi.fn(),
  measure: vi.fn(),
};

describe('StorageManager', () => {
  let StorageManager, storageManager;

  beforeEach(async () => {
    // Reset mock storage
    mockStorage.local.data = {};
    mockStorage.local.listeners = [];

    // Dynamic import to get fresh instance
    const module = await import('../src/storage-manager.js');
    StorageManager = module.default;
    storageManager = module.storageManager;
  });

  afterEach(() => {
    storageManager.cache.clear();
    storageManager.pendingWrites.clear();
  });

  describe('Initialization', () => {
    it('should initialize with preloaded keys', async () => {
      mockStorage.local.data = {
        config: { enabled: true },
        locations: [5020],
      };

      await storageManager.init(['config', 'locations']);

      expect(storageManager.initialized).toBe(true);
      expect(storageManager.cache.size).toBe(2);
      expect(storageManager.cache.get('config')).toEqual({ enabled: true });
    });

    it('should only initialize once', async () => {
      await storageManager.init();
      const firstInit = storageManager.initialized;

      await storageManager.init();
      expect(storageManager.initialized).toBe(firstInit);
    });
  });

  describe('Basic Operations', () => {
    it('should get value from cache', async () => {
      storageManager.cache.set('test', 'cached_value');

      const value = await storageManager.get('test');
      expect(value).toBe('cached_value');
    });

    it('should fallback to storage if not in cache', async () => {
      mockStorage.local.data.test = 'storage_value';

      const value = await storageManager.get('test');
      expect(value).toBe('storage_value');
      expect(storageManager.cache.get('test')).toBe('storage_value');
    });

    it('should return default value if key does not exist', async () => {
      const value = await storageManager.get('nonexistent', 'default');
      expect(value).toBe('default');
    });

    it('should set value and update cache immediately', async () => {
      await storageManager.set('test', 'new_value', { immediate: true });

      expect(storageManager.cache.get('test')).toBe('new_value');
      expect(mockStorage.local.data.test).toBe('new_value');
    });

    it('should batch get multiple keys', async () => {
      mockStorage.local.data = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      };

      const result = await storageManager.getBatch(['key1', 'key2']);
      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });
  });

  describe('Race Condition Prevention', () => {
    it('should prevent concurrent writes to same key', async () => {
      const updates = [];

      // Simulate 10 concurrent updates
      const promises = Array.from({ length: 10 }, (_, i) =>
        storageManager.update('counter', (current = 0) => {
          updates.push(i);
          return current + 1;
        })
      );

      await Promise.all(promises);

      const final = await storageManager.get('counter');
      expect(final).toBe(10); // All updates should be applied
      expect(updates.length).toBe(10); // All updates should have run
    });

    it('should handle read-modify-write atomically', async () => {
      await storageManager.set('config', { count: 0 }, { immediate: true });

      // Concurrent increments
      await Promise.all([
        storageManager.update('config', (cfg) => ({ ...cfg, count: cfg.count + 1 })),
        storageManager.update('config', (cfg) => ({ ...cfg, count: cfg.count + 1 })),
        storageManager.update('config', (cfg) => ({ ...cfg, count: cfg.count + 1 })),
      ]);

      const final = await storageManager.get('config');
      expect(final.count).toBe(3); // No lost updates
    });

    it('should execute transactions atomically', async () => {
      await storageManager.transaction({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      expect(mockStorage.local.data.key1).toBe('value1');
      expect(mockStorage.local.data.key2).toBe('value2');
      expect(mockStorage.local.data.key3).toBe('value3');
    });
  });

  describe('Cross-Context Sync', () => {
    it('should update cache when storage changes from another context', (done) => {
      storageManager.cache.set('test', 'old_value');

      const unsubscribe = storageManager.onChange('test', (newValue, oldValue) => {
        expect(oldValue).toBe('old_value');
        expect(newValue).toBe('new_value');
        expect(storageManager.cache.get('test')).toBe('new_value');
        unsubscribe();
        done();
      });

      // Simulate external change
      mockStorage.local.set({ test: 'new_value' });
    });

    it('should notify wildcard listeners for any key', (done) => {
      let changeCount = 0;

      const unsubscribe = storageManager.onChange('*', (key, newValue) => {
        changeCount++;
        if (changeCount === 2) {
          unsubscribe();
          done();
        }
      });

      mockStorage.local.set({ key1: 'value1', key2: 'value2' });
    });

    it('should allow unsubscribing from changes', async () => {
      let callCount = 0;

      const unsubscribe = storageManager.onChange('test', () => {
        callCount++;
      });

      await mockStorage.local.set({ test: 'value1' });
      expect(callCount).toBe(1);

      unsubscribe();

      await mockStorage.local.set({ test: 'value2' });
      expect(callCount).toBe(1); // Should not increase
    });
  });

  describe('Data Loss Prevention', () => {
    it('should retry failed writes with exponential backoff', async () => {
      let attemptCount = 0;

      // Mock storage failure
      const originalSet = mockStorage.local.set;
      mockStorage.local.set = async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Storage temporarily unavailable');
        }
        return originalSet.apply(mockStorage.local, arguments);
      };

      await storageManager.set('test', 'value', { immediate: true });

      expect(attemptCount).toBe(3); // Should retry 3 times
      expect(mockStorage.local.data.test).toBe('value');

      // Restore
      mockStorage.local.set = originalSet;
    });

    it('should flush pending writes', async () => {
      storageManager.set('key1', 'value1');
      storageManager.set('key2', 'value2');

      expect(mockStorage.local.data.key1).toBeUndefined();

      await storageManager.flush();

      expect(mockStorage.local.data.key1).toBe('value1');
      expect(mockStorage.local.data.key2).toBe('value2');
    });

    it('should restore pending writes on flush failure', async () => {
      storageManager.set('key1', 'value1');

      // Mock flush failure
      const originalSet = mockStorage.local.set;
      mockStorage.local.set = async () => {
        throw new Error('Flush failed');
      };

      try {
        await storageManager.flush();
      } catch (err) {
        // Expected
      }

      // Restore
      mockStorage.local.set = originalSet;

      // Pending writes should be restored
      expect(storageManager.pendingWrites.get('key1')).toBe('value1');
    });
  });

  describe('Critical Keys', () => {
    it('should write critical keys immediately', async () => {
      await storageManager.set('config', { enabled: true });

      // Should be in storage immediately (not debounced)
      expect(mockStorage.local.data.config).toEqual({ enabled: true });
    });

    it('should use WAL for critical writes', async () => {
      await storageManager.set('licenseKey', 'abc123', { immediate: true, useWAL: true });

      // WAL should be cleared after successful write
      const wal = await mockStorage.local.get('__wal_pending_writes');
      expect(wal.__wal_pending_writes || []).toHaveLength(0);
    });
  });

  describe('Storage Stats', () => {
    it('should return storage usage stats', async () => {
      await storageManager.set('test', 'x'.repeat(1000), { immediate: true });

      const stats = await storageManager.getStats();

      expect(stats).toHaveProperty('bytesInUse');
      expect(stats).toHaveProperty('quota');
      expect(stats).toHaveProperty('percentUsed');
      expect(stats).toHaveProperty('cacheSize');
      expect(stats).toHaveProperty('pendingWrites');
    });
  });

  describe('Cleanup', () => {
    it('should flush pending writes on cleanup', async () => {
      storageManager.set('key1', 'value1');
      storageManager.set('key2', 'value2');

      await storageManager.cleanup();

      expect(mockStorage.local.data.key1).toBe('value1');
      expect(mockStorage.local.data.key2).toBe('value2');
    });
  });
});

describe('Migrations', () => {
  let runMigrations, createBackup, restoreBackup;

  beforeEach(async () => {
    mockStorage.local.data = {};
    mockStorage.local.listeners = [];

    const module = await import('../src/migrations.js');
    runMigrations = module.runMigrations;
    createBackup = module.createBackup;
    restoreBackup = module.restoreBackup;
  });

  it('should run pending migrations in order', async () => {
    // Start with old schema
    mockStorage.local.data = {
      schemaVersion: 0,
      config: {
        enabled: true,
        pollIntervalMinutes: 5,
      },
    };

    const { storageManager } = await import('../src/storage-manager.js');
    await storageManager.init();

    await runMigrations(0, 3, storageManager);

    const config = await storageManager.get('config');

    // Should have normalized config (migration v1)
    expect(config).toHaveProperty('notifications');
    expect(config).toHaveProperty('sound');

    // Should have notification stats (migration v2)
    expect(config).toHaveProperty('notificationStats');

    // Should have user profile separated (migration v3)
    const userProfile = await storageManager.get('userProfile');
    expect(userProfile).toBeDefined();
  });

  it('should create backups before migration', async () => {
    mockStorage.local.data = {
      config: { enabled: true },
      locations: [5020],
    };

    const { storageManager } = await import('../src/storage-manager.js');
    await storageManager.init();

    const backup = await createBackup(storageManager);

    expect(backup).toHaveProperty('timestamp');
    expect(backup).toHaveProperty('version');
    expect(backup).toHaveProperty('data');
    expect(backup.data.config).toEqual({ enabled: true });
  });

  it('should restore from backup', async () => {
    const { storageManager } = await import('../src/storage-manager.js');
    await storageManager.init();

    // Create backup
    mockStorage.local.data = { test: 'original' };
    await createBackup(storageManager);

    // Modify data
    await storageManager.set('test', 'modified', { immediate: true });
    expect(await storageManager.get('test')).toBe('modified');

    // Restore
    await restoreBackup(-1, storageManager);
    expect(await storageManager.get('test')).toBe('original');
  });
});
