/**
 * Cross-Browser Polyfill for Extension APIs
 * Ensures consistent API surface across Chrome, Firefox, Safari, and Edge
 */

// Browser detection
export const BROWSER = (() => {
  if (typeof browser !== 'undefined' && browser.runtime) {
    return 'firefox';
  }
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    // Check for Edge-specific features
    if (navigator.userAgent.includes('Edg/')) {
      return 'edge';
    }
    // Check for Safari-specific features
    if (typeof safari !== 'undefined' || navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      return 'safari';
    }
    return 'chrome';
  }
  return 'unknown';
})();

console.log(`[Browser Detection] Running on: ${BROWSER}`);

// Unified browser API namespace
// Firefox uses 'browser' (with promises), Chrome uses 'chrome' (with callbacks)
export const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

/**
 * Promisify Chrome callback-based APIs for consistency
 * Firefox already returns promises, so this is a no-op there
 */
function promisify(fn, context) {
  return function (...args) {
    // Firefox: already returns promises
    if (BROWSER === 'firefox') {
      return fn.apply(context, args);
    }

    // Chrome/Edge/Safari: wrap callback in promise
    return new Promise((resolve, reject) => {
      fn.apply(context, [...args, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result);
        }
      }]);
    });
  };
}

/**
 * Cross-browser storage API
 */
export const storage = {
  local: {
    get: promisify(browserAPI.storage.local.get, browserAPI.storage.local),
    set: promisify(browserAPI.storage.local.set, browserAPI.storage.local),
    remove: promisify(browserAPI.storage.local.remove, browserAPI.storage.local),
    clear: promisify(browserAPI.storage.local.clear, browserAPI.storage.local),
  },
  sync: {
    get: promisify(browserAPI.storage.sync.get, browserAPI.storage.sync),
    set: promisify(browserAPI.storage.sync.set, browserAPI.storage.sync),
    remove: promisify(browserAPI.storage.sync.remove, browserAPI.storage.sync),
    clear: promisify(browserAPI.storage.sync.clear, browserAPI.storage.sync),
  },
};

/**
 * Cross-browser tabs API
 */
export const tabs = {
  create: promisify(browserAPI.tabs.create, browserAPI.tabs),
  query: promisify(browserAPI.tabs.query, browserAPI.tabs),
  update: promisify(browserAPI.tabs.update, browserAPI.tabs),
  remove: promisify(browserAPI.tabs.remove, browserAPI.tabs),
};

/**
 * Cross-browser notifications API
 */
export const notifications = {
  create: promisify(browserAPI.notifications.create, browserAPI.notifications),
  clear: promisify(browserAPI.notifications.clear, browserAPI.notifications),
  getAll: promisify(browserAPI.notifications.getAll, browserAPI.notifications),
};

/**
 * Cross-browser runtime API
 */
export const runtime = {
  getURL: browserAPI.runtime.getURL.bind(browserAPI.runtime),
  sendMessage: promisify(browserAPI.runtime.sendMessage, browserAPI.runtime),
  onMessage: browserAPI.runtime.onMessage,
  onInstalled: browserAPI.runtime.onInstalled,
  getManifest: browserAPI.runtime.getManifest.bind(browserAPI.runtime),
  id: browserAPI.runtime.id,
};

/**
 * Cross-browser alarms API
 */
export const alarms = {
  create: browserAPI.alarms.create.bind(browserAPI.alarms),
  clear: promisify(browserAPI.alarms.clear, browserAPI.alarms),
  clearAll: promisify(browserAPI.alarms.clearAll, browserAPI.alarms),
  get: promisify(browserAPI.alarms.get, browserAPI.alarms),
  getAll: promisify(browserAPI.alarms.getAll, browserAPI.alarms),
  onAlarm: browserAPI.alarms.onAlarm,
};

/**
 * Cross-browser action API (Chrome/Edge) vs browserAction API (Firefox)
 */
export const action = (() => {
  const api = browserAPI.action || browserAPI.browserAction;
  return {
    setBadgeText: promisify(api.setBadgeText, api),
    setBadgeBackgroundColor: promisify(api.setBadgeBackgroundColor, api),
    setIcon: promisify(api.setIcon, api),
    setTitle: promisify(api.setTitle, api),
    openPopup: api.openPopup ? api.openPopup.bind(api) : () => {
      console.warn('[Polyfill] openPopup not supported on this browser');
    },
  };
})();

/**
 * Offscreen document API (Chrome MV3) vs Audio playback (Firefox)
 * Firefox doesn't have offscreen API, uses different approach
 */
export const offscreen = {
  createDocument: async (options) => {
    if (BROWSER === 'firefox') {
      // Firefox: No offscreen API, will handle audio differently
      console.log('[Polyfill] Firefox: Using alternative audio playback method');
      return null;
    }

    if (browserAPI.offscreen) {
      return promisify(browserAPI.offscreen.createDocument, browserAPI.offscreen)(options);
    }

    console.warn('[Polyfill] Offscreen API not available');
    return null;
  },
  hasDocument: async () => {
    if (BROWSER === 'firefox') {
      return false;
    }

    if (browserAPI.runtime.getContexts) {
      const contexts = await browserAPI.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
      });
      return contexts.length > 0;
    }

    return false;
  },
};

/**
 * Feature detection utilities
 */
export const features = {
  supportsOffscreenDocuments: BROWSER === 'chrome' || BROWSER === 'edge',
  supportsServiceWorker: BROWSER !== 'firefox',
  supportsBackgroundScripts: BROWSER === 'firefox',
  supportsDeclarativeNetRequest: !!browserAPI.declarativeNetRequest,
  supportsScripting: !!browserAPI.scripting,
};

/**
 * Browser-specific quirks and workarounds
 */
export const quirks = {
  // Firefox: alarms have minimum interval of 1 minute
  minAlarmInterval: BROWSER === 'firefox' ? 1 : 0.1,

  // Safari: storage limits are more restrictive
  storageQuotaBytes: BROWSER === 'safari' ? 5 * 1024 * 1024 : 10 * 1024 * 1024,

  // Firefox: doesn't support requireInteraction in notifications
  supportsRequireInteraction: BROWSER !== 'firefox',

  // Firefox: doesn't support notification buttons
  supportsNotificationButtons: BROWSER !== 'firefox',
};

console.log('[Polyfill] Initialized with features:', features);
console.log('[Polyfill] Browser quirks:', quirks);
