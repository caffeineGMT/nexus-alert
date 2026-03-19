// NEXUS Alert — Popup Core Module (Performance Optimized)
// Only essential UI initialization - everything else is lazy-loaded

import { storage, getConfig, updateConfig } from './popup-storage.js';

// ─── Performance Monitoring ──────────────────────────────────────
performance.mark('popup-start');

let perfMarkers = {
  start: performance.now(),
  domReady: null,
  storageReady: null,
  uiReady: null,
  complete: null
};

function measurePerformance() {
  perfMarkers.complete = performance.now();

  const totalTime = perfMarkers.complete - perfMarkers.start;
  const metrics = {
    total: Math.round(totalTime),
    storage: perfMarkers.storageReady ? Math.round(perfMarkers.storageReady - perfMarkers.start) : 0,
    ui: perfMarkers.uiReady ? Math.round(perfMarkers.uiReady - perfMarkers.storageReady) : 0
  };

  console.log(`[Popup Performance] Total: ${metrics.total}ms | Storage: ${metrics.storage}ms | UI: ${metrics.ui}ms`);

  // Track if we hit our <500ms goal
  if (metrics.total < 500) {
    console.log('✅ Performance goal achieved (<500ms)');
  } else {
    console.warn(`⚠️ Performance goal missed: ${metrics.total}ms (target: <500ms)`);
  }

  // Send metrics to analytics (deferred)
  if (window.sendPerformanceMetrics) {
    window.sendPerformanceMetrics(metrics);
  }

  return metrics;
}

// ─── Lazy Module Loader ──────────────────────────────────────────
const lazyModules = {
  analytics: null,
  settings: null,
  referral: null,
  i18n: null,
  onboarding: null
};

async function loadModule(name, scriptPath) {
  if (lazyModules[name]) return lazyModules[name];

  try {
    performance.mark(`load-${name}-start`);
    const module = await import(scriptPath);
    performance.mark(`load-${name}-end`);
    performance.measure(`load-${name}`, `load-${name}-start`, `load-${name}-end`);

    lazyModules[name] = module;
    console.log(`[Lazy Load] ${name} loaded`);
    return module;
  } catch (err) {
    console.error(`[Lazy Load] Failed to load ${name}:`, err);
    return null;
  }
}

// Defer analytics/Sentry to avoid blocking initial render
function deferAnalytics() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadModule('analytics', './popup-analytics.js');
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      loadModule('analytics', './popup-analytics.js');
    }, 1000);
  }
}

// Load i18n after initial render
function deferI18n() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadModule('i18n', './popup-i18n.js').then(mod => {
        if (mod && mod.translatePage) {
          mod.translatePage();
        }
      });
    }, { timeout: 500 });
  } else {
    setTimeout(() => {
      loadModule('i18n', './popup-i18n.js').then(mod => {
        if (mod && mod.translatePage) {
          mod.translatePage();
        }
      });
    }, 200);
  }
}

// Load onboarding system after initial render
function deferOnboarding() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadModule('onboarding', '../popup-onboarding.js').then(mod => {
        if (mod && mod.default) {
          const onboarding = new mod.default();
          onboarding.init();

          if (mod.FeatureTooltips) {
            const tooltips = new mod.FeatureTooltips();
            tooltips.init();
          }

          // Make globally available for settings reset
          window.onboardingManager = onboarding;
        }
      });
    }, { timeout: 800 });
  } else {
    setTimeout(() => {
      loadModule('onboarding', '../popup-onboarding.js').then(mod => {
        if (mod && mod.default) {
          const onboarding = new mod.default();
          onboarding.init();

          if (mod.FeatureTooltips) {
            const tooltips = new mod.FeatureTooltips();
            tooltips.init();
          }

          // Make globally available for settings reset
          window.onboardingManager = onboarding;
        }
      });
    }, 400);
  }
}

// ─── Toast System (Critical - Keep Inline) ──────────────────────
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Make globally available
window.showToast = showToast;

// ─── Essential UI Initialization ─────────────────────────────────
let currentConfig = null;

async function initEssentialUI() {
  performance.mark('ui-init-start');

  // Load config from cache (instant if preloaded)
  currentConfig = await getConfig();
  perfMarkers.storageReady = performance.now();

  // Update monitoring toggle
  const enableToggle = document.getElementById('enableToggle');
  if (enableToggle) {
    enableToggle.checked = currentConfig.enabled;
    updateStatusUI(currentConfig.enabled);
  }

  // Update last check time
  if (currentConfig.lastCheck) {
    updateLastCheck(currentConfig.lastCheck);
  }

  // Set selected program
  const programTabs = document.querySelectorAll('.program-tab');
  programTabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.program === currentConfig.program);
    btn.setAttribute('aria-checked', btn.dataset.program === currentConfig.program ? 'true' : 'false');
  });

  perfMarkers.uiReady = performance.now();
  performance.mark('ui-init-end');
  performance.measure('ui-init', 'ui-init-start', 'ui-init-end');

  // Defer heavy UI rendering
  requestAnimationFrame(() => {
    loadLocationsAndSlots();
  });
}

// ─── Tab Navigation (Critical) ────────────────────────────────────
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetTab = btn.dataset.tab;

      // Update active states
      tabButtons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      tabContents.forEach(content => {
        const isTarget = content.id === `tab-${targetTab}`;
        content.classList.toggle('active', isTarget);
        content.hidden = !isTarget;
      });

      // Lazy load tab-specific modules
      if (targetTab === 'settings' && !lazyModules.settings) {
        await loadModule('settings', './popup-settings.js');
      } else if (targetTab === 'refer' && !lazyModules.referral) {
        await loadModule('referral', './popup-referral.js');
      }
    });
  });
}

// ─── Status UI Updates ────────────────────────────────────────────
function updateStatusUI(enabled) {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (statusDot && statusText) {
    statusDot.className = enabled ? 'status-dot active' : 'status-dot inactive';
    statusText.textContent = enabled ? 'Monitoring' : 'Paused';
  }
}

function updateLastCheck(isoString) {
  const lastCheckEl = document.getElementById('lastCheck');
  if (!lastCheckEl || !isoString) return;

  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    let text;
    if (diffMin < 1) text = 'Just now';
    else if (diffMin === 1) text = '1 min ago';
    else if (diffMin < 60) text = `${diffMin} min ago`;
    else if (diffMin < 120) text = '1 hour ago';
    else text = `${Math.floor(diffMin / 60)} hours ago`;

    lastCheckEl.textContent = text;
  } catch (err) {
    console.error('[updateLastCheck] Failed:', err);
  }
}

// ─── Load Locations and Slots (Deferred) ──────────────────────────
async function loadLocationsAndSlots() {
  // These are heavy operations - defer to next frame
  requestAnimationFrame(async () => {
    try {
      // Load data
      const [locations, liveSlots, history] = await Promise.all([
        storage.get('locations', []),
        storage.get('liveSlots', []),
        storage.get('slotHistory', [])
      ]);

      // Render (if render functions are available - they'll be in legacy popup.js for now)
      if (window.renderLocations) {
        window.renderLocations(locations, currentConfig.program, currentConfig.locations, currentConfig.favorites);
      }

      if (window.renderLiveSlots) {
        window.renderLiveSlots(liveSlots, locations);
      }

      if (window.renderSlotHistory) {
        window.renderSlotHistory(history, locations);
      }

      if (window.updateStats) {
        window.updateStats(history, locations);
      }
    } catch (err) {
      console.error('[loadLocationsAndSlots] Failed:', err);
    }
  });
}

// ─── Enable Toggle Handler ─────────────────────────────────────────
function initEnableToggle() {
  const toggle = document.getElementById('enableToggle');
  if (!toggle) return;

  toggle.addEventListener('change', async (e) => {
    const enabled = e.target.checked;

    try {
      await updateConfig({ enabled });
      updateStatusUI(enabled);

      // Send message to background
      chrome.runtime.sendMessage({ type: 'TOGGLE_MONITORING', enabled });

      showToast(enabled ? 'Monitoring enabled' : 'Monitoring paused', 'success');
    } catch (err) {
      console.error('[enableToggle] Failed:', err);
      showToast('Failed to update monitoring status', 'error');
      e.target.checked = !enabled; // Revert
    }
  });
}

// ─── Main Initialization ───────────────────────────────────────────
async function init() {
  perfMarkers.domReady = performance.now();

  try {
    // Critical path: Essential UI only
    await initEssentialUI();
    initTabNavigation();
    initEnableToggle();

    // Defer non-critical modules
    deferI18n();
    deferAnalytics();
    deferOnboarding();

    // Measure performance
    measurePerformance();
  } catch (err) {
    console.error('[Popup Core] Initialization failed:', err);
    showToast('Failed to initialize popup', 'error');
  }
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose for legacy code compatibility
window.updateConfig = updateConfig;
window.getConfig = getConfig;
window.storage = storage;
