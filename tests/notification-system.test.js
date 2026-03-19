/**
 * NEXUS Alert — Notification System Test Suite
 * Cross-platform testing for smart throttling, snooze, and quiet hours
 *
 * Test Coverage:
 * - Smart notification throttling (daily caps, burst protection, per-location cooldown)
 * - Snooze functionality (15min, 1hr, 4hr, 8hr, custom durations)
 * - Quiet hours (manual and OS Do Not Disturb)
 * - Sound alerts (10 different presets)
 * - Notification stats tracking
 *
 * Platform Support:
 * - macOS (Chrome, Edge, Arc)
 * - Windows (Chrome, Edge)
 * - Linux (Chrome, Chromium)
 */

// ─── Test Configuration ─────────────────────────────────────────────

const TEST_CONFIG = {
  dailyNotificationCap: 50,
  burstProtection: true,
  burstMaxNotifs: 5,
  burstWindowMinutes: 10,
  perLocationCooldown: 5,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  respectOsQuietHours: true,
  soundEnabled: true,
  soundType: 'chime',
  soundVolume: 70,
  notificationStats: {
    totalSent: 0,
    dailyCount: 0,
    lastResetDate: null,
    burstHistory: [],
    locationLastNotified: {},
  },
};

// ─── Test Utilities ─────────────────────────────────────────────────

function mockConfig(overrides = {}) {
  return { ...TEST_CONFIG, ...overrides };
}

function mockChrome() {
  return {
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn(),
      },
    },
    notifications: {
      create: jest.fn(),
    },
    runtime: {
      sendMessage: jest.fn(),
    },
    idle: {
      queryState: jest.fn(),
    },
  };
}

// ─── Smart Throttling Tests ─────────────────────────────────────────

describe('Smart Notification Throttling', () => {
  test('Daily cap: blocks notifications after reaching limit', () => {
    const config = mockConfig({
      notificationStats: {
        dailyCount: 50,
        lastResetDate: new Date().toDateString(),
      },
    });

    const result = shouldThrottle(config, 5020);

    expect(result.throttled).toBe(true);
    expect(result.reason).toBe('daily_cap');
    expect(result.cap).toBe(50);
  });

  test('Daily cap: resets at midnight local time', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const config = mockConfig({
      notificationStats: {
        dailyCount: 50,
        lastResetDate: yesterday.toDateString(),
      },
    });

    const result = shouldThrottle(config, 5020);

    expect(result.throttled).toBe(false);
    // After throttle check, dailyCount should reset to 0
  });

  test('Burst protection: blocks rapid-fire notifications', () => {
    const now = Date.now();
    const recentNotifs = [
      now - 60000, // 1 min ago
      now - 120000, // 2 min ago
      now - 180000, // 3 min ago
      now - 240000, // 4 min ago
      now - 300000, // 5 min ago
    ];

    const config = mockConfig({
      burstProtection: true,
      burstMaxNotifs: 5,
      burstWindowMinutes: 10,
      notificationStats: {
        burstHistory: recentNotifs,
      },
    });

    const result = shouldThrottle(config, 5020);

    expect(result.throttled).toBe(true);
    expect(result.reason).toBe('burst_protection');
    expect(result.burst).toBe(5);
  });

  test('Per-location cooldown: prevents spam from same location', () => {
    const now = Date.now();
    const locationId = 5020;

    const config = mockConfig({
      perLocationCooldown: 5,
      notificationStats: {
        locationLastNotified: {
          [locationId]: now - 120000, // 2 minutes ago
        },
      },
    });

    const result = shouldThrottle(config, locationId);

    expect(result.throttled).toBe(true);
    expect(result.reason).toBe('location_cooldown');
    expect(result.remainingMin).toBeGreaterThan(0);
  });

  test('Premium users: unlimited daily notifications', () => {
    const config = mockConfig({
      tier: 'premium',
      notificationStats: {
        dailyCount: 500, // Way over free tier limit
      },
    });

    const result = shouldThrottle(config, 5020);

    expect(result.throttled).toBe(false);
  });
});

// ─── Snooze Functionality Tests ─────────────────────────────────────

describe('Snooze Functionality', () => {
  test('isSnoozed: returns true when within snooze period', () => {
    const futureTime = new Date(Date.now() + 30 * 60 * 1000); // 30 min from now
    const config = mockConfig({ snoozeUntil: futureTime.toISOString() });

    expect(isSnoozed(config)).toBe(true);
  });

  test('isSnoozed: returns false when snooze period expired', () => {
    const pastTime = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago
    const config = mockConfig({ snoozeUntil: pastTime.toISOString() });

    expect(isSnoozed(config)).toBe(false);
  });

  test('isSnoozed: returns false when not snoozed', () => {
    const config = mockConfig({ snoozeUntil: null });

    expect(isSnoozed(config)).toBe(false);
  });

  test('snoozeNotifications: sets correct expiration time', async () => {
    const chrome = mockChrome();
    global.chrome = chrome;

    await snoozeNotifications(60); // 1 hour

    expect(chrome.storage.local.set).toHaveBeenCalled();
    const call = chrome.storage.local.set.mock.calls[0][0];
    const snoozeUntil = new Date(call.config.snoozeUntil);
    const expectedTime = new Date(Date.now() + 60 * 60 * 1000);

    expect(Math.abs(snoozeUntil - expectedTime)).toBeLessThan(1000); // Within 1 second
  });
});

// ─── Quiet Hours Tests ──────────────────────────────────────────────

describe('Quiet Hours', () => {
  test('isInQuietHours: blocks during configured quiet period', () => {
    // Mock time to 23:00 (11 PM)
    const mockDate = new Date();
    mockDate.setHours(23, 0, 0, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const config = mockConfig({
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
    });

    expect(isInQuietHours(config)).toBe(true);
  });

  test('isInQuietHours: allows notifications outside quiet hours', () => {
    // Mock time to 14:00 (2 PM)
    const mockDate = new Date();
    mockDate.setHours(14, 0, 0, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const config = mockConfig({
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
    });

    expect(isInQuietHours(config)).toBe(false);
  });

  test('isInQuietHours: handles midnight wrap correctly', () => {
    // Mock time to 02:00 (2 AM)
    const mockDate = new Date();
    mockDate.setHours(2, 0, 0, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const config = mockConfig({
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
    });

    expect(isInQuietHours(config)).toBe(true);
  });
});

// ─── OS Do Not Disturb Tests ────────────────────────────────────────

describe('OS Do Not Disturb Detection', () => {
  test('macOS: detects locked screen as quiet mode', async () => {
    const chrome = mockChrome();
    chrome.runtime.getPlatformInfo = jest.fn().mockResolvedValue({ os: 'mac' });
    chrome.idle.queryState.mockResolvedValue('locked');
    global.chrome = chrome;

    const isQuiet = await isOsInQuietMode();

    expect(isQuiet).toBe(true);
  });

  test('Windows: respects notification permission state', async () => {
    const chrome = mockChrome();
    chrome.runtime.getPlatformInfo = jest.fn().mockResolvedValue({ os: 'win' });
    chrome.permissions.contains = jest.fn().mockResolvedValue(false);
    global.chrome = chrome;

    const isQuiet = await isOsInQuietMode();

    expect(isQuiet).toBe(true);
  });

  test('Linux: gracefully handles unsupported detection', async () => {
    const chrome = mockChrome();
    chrome.runtime.getPlatformInfo = jest.fn().mockResolvedValue({ os: 'linux' });
    global.chrome = chrome;

    const isQuiet = await isOsInQuietMode();

    expect(isQuiet).toBe(false); // Default to allowing notifications
  });
});

// ─── Sound Alert Tests ──────────────────────────────────────────────

describe('Sound Alerts', () => {
  test('playAlertSound: creates offscreen document if needed', async () => {
    const chrome = mockChrome();
    chrome.runtime.getContexts = jest.fn().mockResolvedValue([]);
    chrome.offscreen = {
      createDocument: jest.fn().mockResolvedValue(undefined),
    };
    global.chrome = chrome;

    await playAlertSound('chime', 70);

    expect(chrome.offscreen.createDocument).toHaveBeenCalledWith({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play alert sound when new slots are found',
    });
  });

  test('playAlertSound: sends message with correct sound type', async () => {
    const chrome = mockChrome();
    chrome.runtime.getContexts = jest.fn().mockResolvedValue([{ contextType: 'OFFSCREEN_DOCUMENT' }]);
    global.chrome = chrome;

    await playAlertSound('urgent', 85);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: 'playSound',
      soundType: 'urgent',
      volume: 85,
    });
  });
});

// ─── Notification Stats Tests ───────────────────────────────────────

describe('Notification Statistics', () => {
  test('recordNotification: increments counters correctly', async () => {
    const config = mockConfig({
      notificationStats: {
        totalSent: 10,
        dailyCount: 5,
        burstHistory: [],
        locationLastNotified: {},
      },
    });

    await recordNotification(config, 5020);

    expect(config.notificationStats.dailyCount).toBe(6);
    expect(config.notificationStats.totalSent).toBe(11);
    expect(config.notificationStats.burstHistory.length).toBe(1);
    expect(config.notificationStats.locationLastNotified[5020]).toBeDefined();
  });
});

// ─── Manual Testing Checklist ──────────────────────────────────────

/**
 * CROSS-PLATFORM MANUAL TESTING CHECKLIST
 *
 * □ macOS (Chrome):
 *   □ Snooze 15min → verify banner shows countdown
 *   □ Snooze 1hr → verify notifications blocked
 *   □ Resume snooze → verify notifications resume
 *   □ Enable macOS Do Not Disturb → verify notifications pause
 *   □ Set quiet hours 22:00-07:00 → verify notifications blocked during period
 *   □ Test all 10 sound presets → verify audio plays correctly
 *   □ Trigger burst protection → verify max 5 notifs in 10min
 *   □ Reach daily cap → verify throttling message
 *
 * □ macOS (Edge):
 *   □ Same tests as Chrome
 *   □ Verify OS DND detection works
 *
 * □ Windows (Chrome):
 *   □ Same snooze tests
 *   □ Enable Windows Focus Assist → verify detection
 *   □ Test notification sound output
 *   □ Verify daily cap reset at midnight local time
 *
 * □ Windows (Edge):
 *   □ Same tests as Chrome
 *   □ Verify native Windows notifications
 *
 * □ Linux (Chrome/Chromium):
 *   □ Same snooze tests
 *   □ Test sound playback (ALSA/PulseAudio)
 *   □ Verify notification display (GNOME/KDE)
 *   □ Test quiet hours functionality
 *
 * □ All Platforms:
 *   □ Per-location cooldown → notify for location A, verify 5min delay before next notif
 *   □ Reset notification stats → verify counters reset to 0
 *   □ Premium tier → verify unlimited daily cap
 *   □ Notification button "Snooze 1hr" → verify quick snooze works
 *   □ Volume slider 0-100 → verify sound scales correctly
 *   □ Disable sound → verify no audio plays
 *
 * □ Edge Cases:
 *   □ Snooze during quiet hours → verify both respected
 *   □ Change timezone → verify quiet hours adjust correctly
 *   □ System sleep → verify snooze timer doesn't drift
 *   □ Extension reload → verify snooze state persists
 *   □ Multiple locations → verify per-location throttling independent
 */

export {
  TEST_CONFIG,
  mockConfig,
  mockChrome,
};
