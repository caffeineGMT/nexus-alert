/* ═══════════════════════════════════════════════════════════════════════
   NEXUS Alert — In-Popup Onboarding & Tutorial System
   Interactive walkthrough, tooltips, quick start, sample search
   Reduces time-to-first-value to <2 minutes
   ═══════════════════════════════════════════════════════════════════════ */

// ─── Tutorial Steps Configuration ─────────────────────────────────────

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: '👋 Welcome to NEXUS Alert!',
    content: 'Get instant notifications when NEXUS, Global Entry, or SENTRI appointment slots open up at your preferred locations.',
    bullets: [
      '<strong>Real-time monitoring</strong> — We check for new appointments every few minutes',
      '<strong>Instant alerts</strong> — Get notified immediately when slots open',
      '<strong>Multi-location tracking</strong> — Monitor multiple enrollment centers at once'
    ],
    primaryButton: 'Get Started',
    secondaryButton: null
  },
  {
    id: 'search-location',
    title: '🔍 Find Your Location',
    content: 'Start by searching for enrollment centers near you. Try cities like "Blaine", "Seattle", or "San Francisco".',
    bullets: null,
    highlightElement: '#locationSearch',
    primaryButton: 'Try Sample Search',
    secondaryButton: 'Skip',
    action: 'sample-search'
  },
  {
    id: 'add-locations',
    title: '📍 Add Locations to Track',
    content: 'Select enrollment centers from the search results. You can track multiple locations at once for better chances.',
    bullets: null,
    primaryButton: 'Got It',
    secondaryButton: null
  },
  {
    id: 'notifications',
    title: '🔔 Stay Updated',
    content: 'We\'ll check for appointments automatically and notify you when slots open.',
    bullets: [
      '<strong>Auto-refresh</strong> — Extension checks every few minutes',
      '<strong>Manual check</strong> — Click refresh button anytime',
      '<strong>Sound alerts</strong> — Optional sound notifications'
    ],
    highlightElement: '#refreshLocationsBtn',
    primaryButton: 'Perfect!',
    secondaryButton: null
  },
  {
    id: 'complete',
    title: '🎉 You\'re All Set!',
    content: 'NEXUS Alert is now monitoring for appointment slots. We\'ll notify you as soon as one opens up.',
    bullets: [
      '<strong>Refresh anytime</strong> — Click the refresh button to check immediately',
      '<strong>Adjust settings</strong> — Customize notification preferences in settings',
      '<strong>Track progress</strong> — See last check time and status for each location'
    ],
    primaryButton: 'Start Monitoring',
    secondaryButton: null
  }
];

// ─── Onboarding Manager ────────────────────────────────────────────────

export class OnboardingManager {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.completedSteps = new Set();
    this.overlay = null;
    this.tutorialCard = null;
    this.quickStartBanner = null;
  }

  // Initialize onboarding system
  async init() {
    // Check if user has completed popup onboarding
    const { popupOnboardingCompleted, popupOnboardingSkipped } = await chrome.storage.local.get([
      'popupOnboardingCompleted',
      'popupOnboardingSkipped'
    ]);

    if (popupOnboardingCompleted) {
      return; // User already completed onboarding
    }

    if (popupOnboardingSkipped) {
      this.showQuickStartBanner();
      return;
    }

    // First-time user: show tutorial after a brief delay
    setTimeout(() => {
      this.showTutorial();
    }, 500);
  }

  // Show interactive tutorial overlay
  showTutorial() {
    this.isActive = true;
    this.currentStep = 0;
    this.createOverlay();
    this.renderStep();
  }

  // Create tutorial overlay
  createOverlay() {
    // Remove existing overlay if any
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-labelledby', 'tutorial-title');

    this.tutorialCard = document.createElement('div');
    this.tutorialCard.className = 'tutorial-card';
    this.tutorialCard.setAttribute('role', 'document');

    this.overlay.appendChild(this.tutorialCard);
    document.body.appendChild(this.overlay);

    // ESC key to skip
    this.keyHandler = this.handleKeyPress.bind(this);
    document.addEventListener('keydown', this.keyHandler);
  }

  // Render current tutorial step
  renderStep() {
    const step = TUTORIAL_STEPS[this.currentStep];
    if (!step) return;

    // Clear previous highlight
    this.clearHighlight();

    const titleParts = step.title.split(' ');
    const emoji = titleParts[0];
    const titleText = titleParts.slice(1).join(' ');

    let html = `
      <h2 id="tutorial-title">
        <span class="emoji" aria-hidden="true">${emoji}</span>
        ${titleText}
      </h2>
      <p>${step.content}</p>
    `;

    // Add bullets if present
    if (step.bullets && step.bullets.length > 0) {
      html += '<ul>';
      step.bullets.forEach(bullet => {
        html += `<li>${bullet}</li>`;
      });
      html += '</ul>';
    }

    // Progress dots
    html += `<div class="tutorial-progress" role="progressbar" aria-valuenow="${this.currentStep + 1}" aria-valuemin="1" aria-valuemax="${TUTORIAL_STEPS.length}">`;
    TUTORIAL_STEPS.forEach((_, index) => {
      let dotClass = 'progress-dot';
      if (index === this.currentStep) dotClass += ' active';
      else if (this.completedSteps.has(index)) dotClass += ' completed';
      html += `<div class="${dotClass}" aria-label="Step ${index + 1}"></div>`;
    });
    html += '</div>';

    // Action buttons
    html += '<div class="tutorial-actions">';
    if (step.secondaryButton) {
      html += `<button class="btn-secondary-tutorial" id="tutorial-secondary">${step.secondaryButton}</button>`;
    }
    html += `<button class="btn-primary-tutorial" id="tutorial-primary">${step.primaryButton}</button>`;
    html += '</div>';

    // Skip button
    if (this.currentStep < TUTORIAL_STEPS.length - 1) {
      html += '<button class="btn-skip" id="tutorial-skip">Skip Tutorial</button>';
    }

    this.tutorialCard.innerHTML = html;

    // Highlight element if specified
    if (step.highlightElement) {
      this.highlightElement(step.highlightElement);
    }

    // Attach event listeners
    this.attachStepListeners(step);
  }

  // Attach event listeners for current step
  attachStepListeners(step) {
    const primaryBtn = document.getElementById('tutorial-primary');
    const secondaryBtn = document.getElementById('tutorial-secondary');
    const skipBtn = document.getElementById('tutorial-skip');

    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => this.handlePrimaryAction(step));
    }

    if (secondaryBtn) {
      secondaryBtn.addEventListener('click', () => this.nextStep());
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skipTutorial());
    }
  }

  // Handle primary button action
  async handlePrimaryAction(step) {
    if (step.action === 'sample-search') {
      await this.runSampleSearch();
      this.nextStep();
    } else if (step.id === 'complete') {
      await this.completeTutorial();
    } else {
      this.nextStep();
    }
  }

  // Run sample location search
  async runSampleSearch() {
    // Close tutorial temporarily
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }

    // Trigger search for sample location
    const searchInput = document.getElementById('locationSearch');
    if (searchInput) {
      searchInput.value = 'Blaine';
      searchInput.classList.add('sample-search-active');

      // Trigger input event to show search results
      const event = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(event);

      // Wait for results to populate
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Show overlay again
    if (this.overlay) {
      this.overlay.style.display = 'flex';
    }
  }

  // Highlight element during tutorial
  highlightElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tooltip-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Clear element highlight
  clearHighlight() {
    document.querySelectorAll('.tooltip-highlight').forEach(el => {
      el.classList.remove('tooltip-highlight');
    });
  }

  // Move to next step
  nextStep() {
    this.completedSteps.add(this.currentStep);
    this.currentStep++;

    if (this.currentStep >= TUTORIAL_STEPS.length) {
      this.completeTutorial();
    } else {
      this.renderStep();
    }
  }

  // Complete tutorial
  async completeTutorial() {
    await chrome.storage.local.set({
      popupOnboardingCompleted: true,
      popupOnboardingCompletedAt: Date.now()
    });

    this.isActive = false;
    this.clearHighlight();

    // Remove event listener
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
    }

    // Fade out and remove overlay
    if (this.overlay) {
      this.overlay.style.opacity = '0';
      this.overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        this.overlay.remove();
        this.overlay = null;
      }, 300);
    }
  }

  // Skip tutorial
  async skipTutorial() {
    await chrome.storage.local.set({
      popupOnboardingSkipped: true,
      popupOnboardingSkippedAt: Date.now()
    });

    this.isActive = false;
    this.clearHighlight();

    // Remove event listener
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
    }

    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }

    // Show quick start banner instead
    this.showQuickStartBanner();
  }

  // Show quick start banner (for users who skipped tutorial)
  showQuickStartBanner() {
    // Don't show if already exists or if dismissed
    if (document.querySelector('.quick-start-banner')) return;

    chrome.storage.local.get(['quickStartDismissed'], ({ quickStartDismissed }) => {
      if (quickStartDismissed) return;

      const banner = document.createElement('div');
      banner.className = 'quick-start-banner';
      banner.style.position = 'relative';
      banner.innerHTML = `
        <h3>⚡ Quick Start Guide</h3>
        <p>New to NEXUS Alert? Try searching for a location like "Blaine" to get started!</p>
        <div class="quick-start-actions">
          <button class="btn-sample-search" id="quick-start-sample">
            Try Sample Search
          </button>
          <button class="btn-dismiss-banner" id="quick-start-dismiss">
            Dismiss
          </button>
        </div>
      `;

      // Insert after header
      const header = document.querySelector('.header');
      if (header) {
        header.insertAdjacentElement('afterend', banner);
      }

      // Event listeners
      const sampleBtn = document.getElementById('quick-start-sample');
      const dismissBtn = document.getElementById('quick-start-dismiss');

      if (sampleBtn) {
        sampleBtn.addEventListener('click', async () => {
          await this.runSampleSearch();
          banner.remove();
          await chrome.storage.local.set({ quickStartDismissed: true });
        });
      }

      if (dismissBtn) {
        dismissBtn.addEventListener('click', async () => {
          await chrome.storage.local.set({ quickStartDismissed: true });
          banner.remove();
        });
      }

      this.quickStartBanner = banner;
    });
  }

  // Handle keyboard shortcuts
  handleKeyPress(event) {
    if (!this.isActive) return;

    if (event.key === 'Escape') {
      this.skipTutorial();
    } else if (event.key === 'Enter') {
      const step = TUTORIAL_STEPS[this.currentStep];
      this.handlePrimaryAction(step);
    }
  }

  // Reset onboarding (for testing or user request)
  async reset() {
    await chrome.storage.local.remove([
      'popupOnboardingCompleted',
      'popupOnboardingSkipped',
      'popupOnboardingCompletedAt',
      'popupOnboardingSkippedAt',
      'quickStartDismissed'
    ]);

    this.currentStep = 0;
    this.completedSteps.clear();

    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }

    if (this.quickStartBanner) {
      this.quickStartBanner.remove();
      this.quickStartBanner = null;
    }
  }
}

// ─── Feature Tooltips (Context-Sensitive Help) ─────────────────────────

export class FeatureTooltips {
  constructor() {
    this.tooltips = {
      locationSearch: {
        selector: '#locationSearch',
        message: '<strong>Find Your Location</strong><br>Search for enrollment centers by city name or state.',
        trigger: 'focus',
        position: 'bottom',
        delay: 500
      },
      addLocation: {
        selector: '#addLocationBtn',
        message: '<strong>Add Locations</strong><br>Track multiple enrollment centers to increase your chances.',
        trigger: 'hover',
        position: 'bottom',
        delay: 800
      },
      refreshBtn: {
        selector: '#refreshLocationsBtn',
        message: '<strong>Manual Refresh</strong><br>Check for appointments right now instead of waiting.',
        trigger: 'hover',
        position: 'bottom',
        delay: 800
      },
      settingsBtn: {
        selector: '#settingsBtn',
        message: '<strong>Settings</strong><br>Customize notification preferences and check frequency.',
        trigger: 'hover',
        position: 'bottom',
        delay: 800
      }
    };

    this.activeTooltips = new Map();
    this.timeouts = new Map();
  }

  // Initialize tooltips
  init() {
    // Check if user wants tooltips
    chrome.storage.local.get(['tooltipsDisabled'], ({ tooltipsDisabled }) => {
      if (tooltipsDisabled) return;

      // Attach tooltips to elements (with delay for async elements)
      setTimeout(() => {
        Object.entries(this.tooltips).forEach(([key, config]) => {
          this.attachTooltip(key, config);
        });
      }, 1000);
    });
  }

  // Attach tooltip to element
  attachTooltip(key, config) {
    const element = document.querySelector(config.selector);
    if (!element) return;

    if (config.trigger === 'hover') {
      element.addEventListener('mouseenter', () => {
        const timeout = setTimeout(() => {
          this.show(key, config);
        }, config.delay || 0);
        this.timeouts.set(key, timeout);
      });

      element.addEventListener('mouseleave', () => {
        const timeout = this.timeouts.get(key);
        if (timeout) {
          clearTimeout(timeout);
          this.timeouts.delete(key);
        }
        this.hide(key);
      });
    } else if (config.trigger === 'focus') {
      element.addEventListener('focus', () => {
        const timeout = setTimeout(() => {
          this.show(key, config);
        }, config.delay || 0);
        this.timeouts.set(key, timeout);
      });

      element.addEventListener('blur', () => {
        const timeout = this.timeouts.get(key);
        if (timeout) {
          clearTimeout(timeout);
          this.timeouts.delete(key);
        }
        this.hide(key);
      });
    }
  }

  // Show tooltip
  show(key, config) {
    // Don't show if already active
    if (this.activeTooltips.has(key)) return;

    const element = document.querySelector(config.selector);
    if (!element) return;

    const tooltip = document.createElement('div');
    tooltip.className = `tooltip-popup ${config.position}`;
    tooltip.innerHTML = `<div class="tooltip-content">${config.message}</div>`;

    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';

    if (config.position === 'bottom') {
      tooltip.style.top = `${rect.bottom + 8}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.transform = 'translateX(-50%)';
    } else {
      tooltip.style.bottom = `${window.innerHeight - rect.top + 8}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.transform = 'translateX(-50%)';
    }

    document.body.appendChild(tooltip);
    this.activeTooltips.set(key, tooltip);
  }

  // Hide tooltip
  hide(key) {
    const tooltip = this.activeTooltips.get(key);
    if (tooltip) {
      tooltip.remove();
      this.activeTooltips.delete(key);
    }
  }

  // Disable all tooltips
  async disable() {
    await chrome.storage.local.set({ tooltipsDisabled: true });
    this.activeTooltips.forEach(tooltip => tooltip.remove());
    this.activeTooltips.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }

  // Enable tooltips
  async enable() {
    await chrome.storage.local.set({ tooltipsDisabled: false });
    this.init();
  }
}

// ─── Export ─────────────────────────────────────────────────────────────

export { OnboardingManager as default, FeatureTooltips };
