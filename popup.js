// NEXUS Alert — Popup Entry Point (Performance Optimized)
// Coordinates between optimized core and legacy render functions

// Performance marker
performance.mark('popup-entry-start');

// Import optimized core module (this handles essential init + lazy loading)
import './src/popup-core.js';

// Import legacy code for render functions (needed by core)
// This runs after core init, so it doesn't block critical path
import('./popup-legacy.js').then(() => {
  console.log('[Popup] Legacy render functions loaded');
  performance.mark('popup-legacy-loaded');
  performance.measure('popup-legacy-load', 'popup-entry-start', 'popup-legacy-loaded');
}).catch(err => {
  console.error('[Popup] Failed to load legacy functions:', err);
});
