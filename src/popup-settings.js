// NEXUS Alert — Settings Tab Module (Lazy Loaded)
// Only loaded when Settings tab is clicked

export function init(config) {
  console.log('[Settings Module] Initialized');

  // Initialize settings UI
  initIntervalSettings(config);
  initNotificationSettings(config);
  initSoundSettings(config);
  initSnoozeControls(config);
  initThrottlingSettings(config);
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

  // Sound type buttons
  const soundTypeBtns = document.querySelectorAll('.sound-type-btn');
  soundTypeBtns.forEach(btn => {
    const soundType = btn.dataset.sound;
    const isActive = soundType === (config.soundType || 'chime');

    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');

    btn.addEventListener('click', async () => {
      soundTypeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      await chrome.runtime.sendMessage({ action: 'updateConfig', config: { soundType } });
    });
  });

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

  // Test sound button
  const testSoundBtn = document.getElementById('testSoundBtn');
  if (testSoundBtn) {
    testSoundBtn.addEventListener('click', async () => {
      const soundType = document.querySelector('.sound-type-btn.active')?.dataset.sound || 'chime';
      const volume = parseInt(volumeSlider?.value || 70);
      await chrome.runtime.sendMessage({ action: 'testSound', soundType, volume });
    });
  }
}

// ─── Snooze Controls ────────────────────────────────────────────────

function initSnoozeControls(config) {
  // Snooze banner
  updateSnoozeBanner();

  // Quick snooze buttons
  const snoozeBtns = document.querySelectorAll('.snooze-btn');
  snoozeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const minutes = parseInt(btn.dataset.minutes);
      await chrome.runtime.sendMessage({ action: 'snooze', minutes });

      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const duration = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`;

      window.showToast?.(`⏸️ Notifications snoozed for ${duration}`, 'info');
      updateSnoozeBanner();
    });
  });

  // Unsnooze button
  const unsnoozeBtn = document.getElementById('unsnoozeBtn');
  if (unsnoozeBtn) {
    unsnoozeBtn.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ action: 'unsnooze' });
      window.showToast?.('▶️ Notifications resumed', 'success');
      updateSnoozeBanner();
    });
  }

  // OS Quiet Hours toggle
  const osQuietToggle = document.getElementById('osQuietToggle');
  if (osQuietToggle) {
    osQuietToggle.checked = config.respectOsQuietHours !== false;
    osQuietToggle.addEventListener('change', async (e) => {
      await chrome.runtime.sendMessage({
        action: 'updateConfig',
        config: { respectOsQuietHours: e.target.checked }
      });
    });
  }
}

async function updateSnoozeBanner() {
  const snoozeBanner = document.getElementById('snoozeBanner');
  const snoozeMessage = document.getElementById('snoozeMessage');

  if (!snoozeBanner) return;

  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSnoozeStatus' });

    if (response.snoozed) {
      const remaining = response.remainingMinutes;
      const hours = Math.floor(remaining / 60);
      const mins = remaining % 60;

      let message = 'Resuming in ';
      if (hours > 0) {
        message += `${hours} hour${hours > 1 ? 's' : ''}`;
        if (mins > 0) message += ` ${mins} min`;
      } else {
        message += `${mins} minute${mins !== 1 ? 's' : ''}`;
      }

      snoozeMessage.textContent = message;
      snoozeBanner.style.display = 'flex';
    } else {
      snoozeBanner.style.display = 'none';
    }
  } catch (err) {
    console.error('[Snooze] Failed to get status:', err);
    snoozeBanner.style.display = 'none';
  }
}

// ─── Advanced Throttling Settings ───────────────────────────────────

function initThrottlingSettings(config) {
  // Daily cap input
  const dailyCapInput = document.getElementById('dailyCapInput');
  if (dailyCapInput) {
    dailyCapInput.value = config.dailyNotificationCap || 50;
    dailyCapInput.addEventListener('change', async (e) => {
      const cap = parseInt(e.target.value);
      await chrome.runtime.sendMessage({
        action: 'updateConfig',
        config: { dailyNotificationCap: cap }
      });
    });
  }

  // Burst protection toggle
  const burstToggle = document.getElementById('burstProtectionToggle');
  if (burstToggle) {
    burstToggle.checked = config.burstProtection !== false;
    burstToggle.addEventListener('change', async (e) => {
      await chrome.runtime.sendMessage({
        action: 'updateConfig',
        config: { burstProtection: e.target.checked }
      });
    });
  }

  // Location cooldown input
  const cooldownInput = document.getElementById('locationCooldownInput');
  if (cooldownInput) {
    cooldownInput.value = config.perLocationCooldown || 5;
    cooldownInput.addEventListener('change', async (e) => {
      const cooldown = parseInt(e.target.value);
      await chrome.runtime.sendMessage({
        action: 'updateConfig',
        config: { perLocationCooldown: cooldown }
      });
    });
  }

  // Reset stats button
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  if (resetStatsBtn) {
    resetStatsBtn.addEventListener('click', async () => {
      if (confirm('Reset notification statistics for today?')) {
        await chrome.runtime.sendMessage({ action: 'resetNotificationStats' });
        updateNotificationStats();
        window.showToast?.('📊 Statistics reset', 'success');
      }
    });
  }

  // Update stats display
  updateNotificationStats();
}

async function updateNotificationStats() {
  try {
    const { config } = await chrome.storage.local.get('config');
    const stats = config?.notificationStats || {};

    const todayEl = document.getElementById('statNotifToday');
    const totalEl = document.getElementById('statNotifTotal');

    if (todayEl) todayEl.textContent = stats.dailyCount || 0;
    if (totalEl) totalEl.textContent = stats.totalSent || 0;
  } catch (err) {
    console.error('[Stats] Failed to update:', err);
  }
}

// Export snooze banner update for use in other modules
export { updateSnoozeBanner, updateNotificationStats };

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
