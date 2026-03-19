// NEXUS Alert — Settings Tab Module (Lazy Loaded)
// Only loaded when Settings tab is clicked

export function init(config) {
  console.log('[Settings Module] Initialized');

  // Initialize settings UI
  initIntervalSettings(config);
  initNotificationSettings(config);
  initSoundSettings(config);
  initPremiumSection(config);
  initHelpSection();
}

function initIntervalSettings(config) {
  const intervalBtns = document.querySelectorAll('.interval-btn');

  intervalBtns.forEach(btn => {
    const interval = parseInt(btn.dataset.interval);
    const isActive = interval === config.interval;

    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');

    btn.addEventListener('click', async () => {
      // Update UI
      intervalBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      // Update config
      await window.updateConfig({ interval });

      // Notify background
      chrome.runtime.sendMessage({ type: 'UPDATE_INTERVAL', interval });

      window.showToast(`Check interval updated to ${interval} min`, 'success');
    });
  });
}

function initNotificationSettings(config) {
  // Desktop notifications toggle
  const desktopToggle = document.getElementById('desktopNotifToggle');
  if (desktopToggle) {
    desktopToggle.checked = config.notifications?.desktop ?? true;
    desktopToggle.addEventListener('change', async (e) => {
      await window.updateConfig({
        notifications: { ...config.notifications, desktop: e.target.checked }
      });
    });
  }

  // Badge toggle
  const badgeToggle = document.getElementById('badgeToggle');
  if (badgeToggle) {
    badgeToggle.checked = config.notifications?.badge ?? true;
    badgeToggle.addEventListener('change', async (e) => {
      await window.updateConfig({
        notifications: { ...config.notifications, badge: e.target.checked }
      });
    });
  }

  // Auto-open toggle
  const autoOpenToggle = document.getElementById('autoOpenToggle');
  if (autoOpenToggle) {
    autoOpenToggle.checked = config.notifications?.autoOpen ?? false;
    autoOpenToggle.addEventListener('change', async (e) => {
      await window.updateConfig({
        notifications: { ...config.notifications, autoOpen: e.target.checked }
      });
    });
  }

  // Quiet hours
  const quietToggle = document.getElementById('quietHoursToggle');
  const quietRange = document.getElementById('quietHoursRange');

  if (quietToggle && quietRange) {
    quietToggle.checked = config.notifications?.quietHours ?? false;
    quietRange.style.display = quietToggle.checked ? 'flex' : 'none';

    quietToggle.addEventListener('change', async (e) => {
      quietRange.style.display = e.target.checked ? 'flex' : 'none';
      await window.updateConfig({
        notifications: { ...config.notifications, quietHours: e.target.checked }
      });
    });
  }
}

function initSoundSettings(config) {
  const soundToggle = document.getElementById('soundToggle');
  const soundPanel = document.getElementById('soundPrefsPanel');

  if (soundToggle && soundPanel) {
    soundToggle.checked = config.sound?.enabled ?? true;
    soundPanel.style.display = soundToggle.checked ? 'block' : 'none';

    soundToggle.addEventListener('change', async (e) => {
      soundPanel.style.display = e.target.checked ? 'block' : 'none';
      await window.updateConfig({
        sound: { ...config.sound, enabled: e.target.checked }
      });
    });
  }

  // Volume slider
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeLabel = document.getElementById('volumeLabel');

  if (volumeSlider && volumeLabel) {
    volumeSlider.value = config.sound?.volume ?? 70;
    volumeLabel.textContent = `${volumeSlider.value}%`;

    volumeSlider.addEventListener('input', (e) => {
      volumeLabel.textContent = `${e.target.value}%`;
    });

    volumeSlider.addEventListener('change', async (e) => {
      await window.updateConfig({
        sound: { ...config.sound, volume: parseInt(e.target.value) }
      });
    });
  }
}

function initPremiumSection(config) {
  const freePlanCard = document.getElementById('freePlanCard');
  const premiumPlanCard = document.getElementById('premiumPlanCard');
  const isPremium = config.plan === 'premium';

  if (freePlanCard && premiumPlanCard) {
    freePlanCard.style.display = isPremium ? 'none' : 'block';
    premiumPlanCard.style.display = isPremium ? 'block' : 'none';
  }

  // Show community section for premium users
  const communitySection = document.getElementById('communitySection');
  if (communitySection) {
    communitySection.style.display = isPremium ? 'block' : 'none';
  }

  // Show premium stats
  const premiumStatsSection = document.getElementById('premiumStatsSection');
  if (premiumStatsSection) {
    premiumStatsSection.style.display = isPremium ? 'block' : 'none';
  }
}

function initHelpSection() {
  const restartTutorialBtn = document.getElementById('restartTutorialBtn');

  if (restartTutorialBtn) {
    restartTutorialBtn.addEventListener('click', async () => {
      // Reset onboarding state
      if (window.onboardingManager) {
        await window.onboardingManager.reset();
        window.showToast('Tutorial reset! Reopen the popup to start.', 'success');

        // Close and reopen popup to trigger tutorial
        setTimeout(() => {
          window.close();
        }, 1500);
      } else {
        window.showToast('Onboarding system not loaded yet. Please try again.', 'info');
      }
    });
  }
}

export default { init };
