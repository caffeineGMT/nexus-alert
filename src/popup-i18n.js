// NEXUS Alert — Internationalization Module (Lazy Loaded)
// Translation system for popup UI

export const i18n = {
  getMessage: (key, substitutions) => {
    if (typeof chrome === 'undefined' || !chrome.i18n) {
      return key;
    }
    return chrome.i18n.getMessage(key, substitutions) || key;
  },

  // Auto-translate elements with data-i18n attributes
  translatePage: () => {
    performance.mark('i18n-start');

    try {
      // Translate elements with data-i18n attributes
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = i18n.getMessage(key);

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      });

      // Set language attribute
      if (typeof chrome !== 'undefined' && chrome.i18n) {
        document.documentElement.lang = chrome.i18n.getUILanguage().split('-')[0];
      }

      // Translate title
      document.title = i18n.getMessage('appTitle') || 'NEXUS Alert';

      performance.mark('i18n-end');
      performance.measure('i18n-translate', 'i18n-start', 'i18n-end');

      console.log('[i18n] Page translated');
    } catch (err) {
      console.error('[i18n] Translation failed:', err);
    }
  }
};

// Export the translatePage function directly
export const translatePage = i18n.translatePage;
export const getMessage = i18n.getMessage;

export default i18n;
