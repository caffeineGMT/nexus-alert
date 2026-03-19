// NEXUS Alert — Data Migration System
// Handles schema versioning and data migrations across extension updates

/**
 * Migration registry
 * Each migration transforms data from version N to N+1
 */
const migrations = [
  // Migration 0 -> 1: Initial schema
  {
    version: 1,
    description: 'Initial schema - normalize config structure',
    async up(storage) {
      const config = await storage.get('config', {});

      // Ensure all config keys exist with defaults
      const normalized = {
        enabled: config.enabled ?? true,
        program: config.program || 'NEXUS',
        interval: config.pollIntervalMinutes || config.interval || 3,
        lastCheck: config.lastCheck || config.lastCheckedAt || null,
        locations: Array.isArray(config.locations) ? config.locations : [5020],
        filters: config.filters || config.dateRange || {},
        notifications: {
          desktop: config.desktopNotificationsEnabled ?? config.notifications?.desktop ?? true,
          badge: config.badgeEnabled ?? config.notifications?.badge ?? true,
          autoOpen: config.autoOpenBooking ?? config.notifications?.autoOpen ?? false,
          frequency: config.notifFrequency || config.notifications?.frequency || '30',
          quietHours: config.quietHoursEnabled ?? config.notifications?.quietHours ?? false,
          quietFrom: config.quietHoursStart || config.notifications?.quietFrom || '22:00',
          quietTo: config.quietHoursEnd || config.notifications?.quietTo || '07:00',
        },
        sound: {
          enabled: config.soundEnabled ?? config.sound?.enabled ?? true,
          type: config.soundType || config.sound?.type || 'chime',
          volume: config.soundVolume ?? config.sound?.volume ?? 70,
        },
        favorites: Array.isArray(config.favoriteLocations) ? config.favoriteLocations : (config.favorites || []),
        email: config.email || '',
        plan: config.tier || config.plan || 'free',
        licenseKey: config.licenseKey || null,
      };

      await storage.set('config', normalized, { immediate: true });
      console.log('[Migration v1] Config normalized');
    }
  },

  // Migration 1 -> 2: Add notification stats and throttling
  {
    version: 2,
    description: 'Add notification stats and smart throttling',
    async up(storage) {
      const config = await storage.get('config', {});

      // Add new fields for notification management
      const updated = {
        ...config,
        snoozeUntil: config.snoozeUntil || null,
        snoozeAutoResume: config.snoozeAutoResume ?? true,
        dailyNotificationCap: config.dailyNotificationCap || (config.plan === 'premium' ? Infinity : 50),
        burstProtection: config.burstProtection ?? true,
        burstMaxNotifs: config.burstMaxNotifs || 5,
        burstWindowMinutes: config.burstWindowMinutes || 10,
        perLocationCooldown: config.perLocationCooldown || 5,
        respectOsQuietHours: config.respectOsQuietHours ?? true,
        notificationStats: config.notificationStats || {
          totalSent: 0,
          lastResetDate: null,
          dailyCount: 0,
          burstHistory: [],
          locationLastNotified: {},
        },
      };

      // Migrate old notifiedSlots to new format
      if (config.notifiedSlots && typeof config.notifiedSlots === 'object') {
        // Keep notifiedSlots but ensure it's pruned
        updated.notifiedSlots = config.notifiedSlots;
      } else {
        updated.notifiedSlots = {};
      }

      await storage.set('config', updated, { immediate: true });
      console.log('[Migration v2] Notification stats added');
    }
  },

  // Migration 2 -> 3: Separate user data from config
  {
    version: 3,
    description: 'Separate user profile from config for better organization',
    async up(storage) {
      const config = await storage.get('config', {});

      // Extract user profile data
      const userProfile = {
        email: config.email || '',
        plan: config.plan || 'free',
        licenseKey: config.licenseKey || null,
        installDate: await storage.get('installDate', Date.now()),
        referralCode: config.referralCode || null,
        referredBy: config.referredBy || null,
      };

      // Save user profile separately
      await storage.set('userProfile', userProfile, { immediate: true });

      // Remove user data from config (keep config focused on settings)
      const { email, plan, licenseKey, referralCode, referredBy, ...cleanConfig } = config;

      await storage.set('config', cleanConfig, { immediate: true });

      console.log('[Migration v3] User profile separated from config');
    }
  },

  // Future migrations go here...
  // {
  //   version: 4,
  //   description: 'Add feature X',
  //   async up(storage) {
  //     // Migration logic
  //   }
  // },
];

/**
 * Run all pending migrations
 * @param {number} fromVersion - Current schema version
 * @param {number} toVersion - Target schema version
 * @param {StorageManager} storage - Storage manager instance
 */
export async function runMigrations(fromVersion, toVersion, storage) {
  console.log(`[Migrations] Running migrations from v${fromVersion} to v${toVersion}...`);

  // Filter migrations that need to run
  const pending = migrations.filter(m => m.version > fromVersion && m.version <= toVersion);

  if (pending.length === 0) {
    console.log('[Migrations] No migrations to run');
    return;
  }

  // Run migrations in order
  for (const migration of pending) {
    console.log(`[Migrations] Running v${migration.version}: ${migration.description}`);

    try {
      await migration.up(storage);
      console.log(`[Migrations] ✓ v${migration.version} complete`);
    } catch (err) {
      console.error(`[Migrations] ✗ v${migration.version} failed:`, err);
      throw new Error(`Migration v${migration.version} failed: ${err.message}`);
    }
  }

  console.log(`[Migrations] All migrations complete (now at v${toVersion})`);
}

/**
 * Get migration status
 * @param {StorageManager} storage - Storage manager instance
 * @returns {Promise<Object>} Migration status
 */
export async function getMigrationStatus(storage) {
  const currentVersion = await storage.get('schemaVersion', 0);
  const latestVersion = migrations[migrations.length - 1]?.version || 0;

  return {
    currentVersion,
    latestVersion,
    needsMigration: currentVersion < latestVersion,
    pendingMigrations: migrations.filter(m => m.version > currentVersion && m.version <= latestVersion),
  };
}

/**
 * Create a backup before running migrations
 * @param {StorageManager} storage - Storage manager instance
 * @returns {Promise<Object>} Backup data
 */
export async function createBackup(storage) {
  console.log('[Migrations] Creating backup...');

  // Get all storage data
  const allData = await chrome.storage.local.get(null);

  // Save backup with timestamp
  const backup = {
    timestamp: Date.now(),
    version: await storage.get('schemaVersion', 0),
    data: allData,
  };

  // Store in a separate backup key (keep last 3 backups)
  const existingBackups = await storage.get('__migration_backups', []);
  existingBackups.push(backup);

  // Keep only last 3
  const trimmed = existingBackups.slice(-3);

  await storage.set('__migration_backups', trimmed, { immediate: true });

  console.log(`[Migrations] Backup created (${trimmed.length} total backups stored)`);

  return backup;
}

/**
 * Restore from a backup
 * @param {number} backupIndex - Index of backup to restore (0 = oldest, -1 = latest)
 * @param {StorageManager} storage - Storage manager instance
 */
export async function restoreBackup(backupIndex, storage) {
  const backups = await storage.get('__migration_backups', []);

  if (backups.length === 0) {
    throw new Error('No backups available');
  }

  const backup = backupIndex < 0 ? backups[backups.length + backupIndex] : backups[backupIndex];

  if (!backup) {
    throw new Error(`Backup index ${backupIndex} not found`);
  }

  console.log(`[Migrations] Restoring backup from ${new Date(backup.timestamp).toISOString()}...`);

  // Clear current storage
  await chrome.storage.local.clear();

  // Restore backup data
  await chrome.storage.local.set(backup.data);

  // Invalidate cache
  storage.cache.clear();

  console.log('[Migrations] Backup restored successfully');
}

export default {
  runMigrations,
  getMigrationStatus,
  createBackup,
  restoreBackup,
};
