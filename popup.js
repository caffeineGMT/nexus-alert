// NEXUS Alert — Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const status = await sendMessage({ action: 'getStatus' });
  const config = status.config || {};
  const locations = status.locations || {};
  const lastFoundSlots = status.lastFoundSlots || [];
  const slotHistory = status.slotHistory || [];

  // ─── Error Banner ───────────────────────────────────────────────

  if (status.lastError && status.lastErrorTime) {
    const errorAge = Date.now() - status.lastErrorTime;
    const FIVE_MINUTES = 5 * 60 * 1000;
    if (errorAge < FIVE_MINUTES) {
      const banner = document.getElementById('errorBanner');
      const message = document.getElementById('errorMessage');
      message.textContent = 'Could not reach CBP API. Retrying with backoff...';
      banner.style.display = 'flex';
    }
  }

  // ─── Tab Navigation ─────────────────────────────────────────────

  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab);
    });

    // Keyboard navigation: Arrow keys between tabs
    tab.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabItems);
      const index = tabs.indexOf(tab);
      let newIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabs.length - 1;
      }

      if (newIndex !== undefined) {
        tabs[newIndex].focus();
        switchTab(tabs[newIndex]);
      }
    });
  });

  function switchTab(tab) {
    tabItems.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('hidden', '');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    const panel = document.getElementById(`tab-${tab.dataset.tab}`);
    panel.classList.add('active');
    panel.removeAttribute('hidden');

    // Track settings tab open (Plausible)
    if (tab.dataset.tab === 'settings') {
      sendMessage({
        action: 'trackEvent',
        event: 'settings_opened',
        data: { source: 'tab_click' }
      });
    }

    // Track referral tab open
    if (tab.dataset.tab === 'refer') {
      sendMessage({
        action: 'trackEvent',
        event: 'referral_tab_opened',
        data: { source: 'tab_click' }
      });
    }
  }

  // Set initial tabindex state
  tabItems.forEach(tab => {
    if (tab.classList.contains('active')) {
      tab.setAttribute('tabindex', '0');
    } else {
      tab.setAttribute('tabindex', '-1');
    }
  });

  // ─── Enable Toggle ──────────────────────────────────────────────

  const enableToggle = document.getElementById('enableToggle');
  enableToggle.checked = config.enabled !== false;
  enableToggle.addEventListener('change', () => {
    updateConfig({ enabled: enableToggle.checked });
    updateStatusUI(enableToggle.checked);
  });

  updateLastCheck(status.lastCheck);
  updateStatusUI(config.enabled !== false);

  // ─── Live Slots Display ─────────────────────────────────────────

  renderLiveSlots(lastFoundSlots, locations);

  // ─── Program Tabs ───────────────────────────────────────────────

  const programTabs = document.querySelectorAll('.program-tab');
  programTabs.forEach(tab => {
    if (tab.dataset.program === (config.program || 'NEXUS')) {
      tab.classList.add('active');
      tab.setAttribute('aria-checked', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-checked', 'false');
    }
    tab.addEventListener('click', () => {
      selectProgramTab(tab);
    });

    // Keyboard navigation for program radio group
    tab.addEventListener('keydown', (e) => {
      const tabs = Array.from(programTabs);
      const index = tabs.indexOf(tab);
      let newIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
      }

      if (newIndex !== undefined) {
        tabs[newIndex].focus();
        selectProgramTab(tabs[newIndex]);
      }
    });
  });

  function selectProgramTab(tab) {
    programTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-checked', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-checked', 'true');
    tab.setAttribute('tabindex', '0');
    updateConfig({ program: tab.dataset.program });
    document.getElementById('locationSpinner').style.display = 'block';
    setTimeout(() => {
      renderLocations(locations, tab.dataset.program, config.locations || []);
      document.getElementById('locationSpinner').style.display = 'none';
    }, 100);
  }

  // Set initial tabindex for program tabs
  programTabs.forEach(tab => {
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
  });

  document.getElementById('locationSpinner').style.display = 'block';
  setTimeout(() => {
    renderLocations(locations, config.program || 'NEXUS', config.locations || []);
    document.getElementById('locationSpinner').style.display = 'none';
  }, 100);

  // ─── Date Filters ───────────────────────────────────────────────

  const dateFrom = document.getElementById('dateFrom');
  const dateTo = document.getElementById('dateTo');
  if (config.dateRange?.start) dateFrom.value = config.dateRange.start.split('T')[0];
  if (config.dateRange?.end) dateTo.value = config.dateRange.end.split('T')[0];
  dateFrom.addEventListener('change', () => {
    updateConfig({ dateRange: { start: dateFrom.value || null, end: dateTo.value || null } });
  });
  dateTo.addEventListener('change', () => {
    updateConfig({ dateRange: { start: dateFrom.value || null, end: dateTo.value || null } });
  });

  // ─── Time Filters ──────────────────────────────────────────────

  const timeFrom = document.getElementById('timeFrom');
  const timeTo = document.getElementById('timeTo');
  if (config.timeRange?.start) timeFrom.value = config.timeRange.start;
  if (config.timeRange?.end) timeTo.value = config.timeRange.end;
  timeFrom.addEventListener('change', () => {
    updateConfig({ timeRange: { start: timeFrom.value || null, end: timeTo.value || null } });
  });
  timeTo.addEventListener('change', () => {
    updateConfig({ timeRange: { start: timeFrom.value || null, end: timeTo.value || null } });
  });

  // ─── Settings: Interval ─────────────────────────────────────────

  const intervalBtns = document.querySelectorAll('.interval-btn');
  intervalBtns.forEach(btn => {
    const isActive = parseInt(btn.dataset.interval) === (config.pollIntervalMinutes || 3);
    if (isActive) {
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      btn.setAttribute('tabindex', '0');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('tabindex', '-1');
    }
    btn.addEventListener('click', () => {
      selectInterval(btn);
    });

    // Keyboard navigation for interval radio group
    btn.addEventListener('keydown', (e) => {
      const btns = Array.from(intervalBtns);
      const index = btns.indexOf(btn);
      let newIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % btns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + btns.length) % btns.length;
      }

      if (newIndex !== undefined) {
        btns[newIndex].focus();
        selectInterval(btns[newIndex]);
      }
    });
  });

  function selectInterval(btn) {
    intervalBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
      b.setAttribute('tabindex', '-1');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
    btn.setAttribute('tabindex', '0');
    updateConfig({ pollIntervalMinutes: parseInt(btn.dataset.interval) });
  }

  // ─── Settings: Premium Tier ─────────────────────────────────────

  // Show the appropriate plan card
  if (config.tier === 'premium') {
    document.getElementById('freePlanCard').style.display = 'none';
    document.getElementById('premiumPlanCard').style.display = 'block';
    document.getElementById('freeIntervalNotice').style.display = 'none';
  } else {
    document.getElementById('freePlanCard').style.display = 'block';
    document.getElementById('premiumPlanCard').style.display = 'none';
    document.getElementById('freeIntervalNotice').style.display = 'block';
  }

  // Pre-fill email if available
  if (config.email) {
    document.getElementById('upgradeEmail').value = config.email;
  }

  // Billing cycle toggle
  let selectedPlan = 'monthly';
  const billingToggleBtns = document.querySelectorAll('.billing-toggle-btn');
  const upgradeBtn = document.getElementById('upgradeBtn');

  billingToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      billingToggleBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--accent)';
      btn.style.color = 'white';

      selectedPlan = btn.dataset.plan;

      // Update button text based on selected plan
      if (selectedPlan === 'annual') {
        upgradeBtn.textContent = 'Upgrade — $49.99/year';
      } else {
        upgradeBtn.textContent = 'Upgrade — $4.99/mo';
      }
    });
  });

  // ─── Referral Program ───────────────────────────────────────────

  initReferralTab(config);

  // ─── Settings: Discord Community ───────────────────────────────

  // Show Discord community section only for premium users
  if (config.tier === 'premium') {
    document.getElementById('communitySection').style.display = 'block';

    // Check if user is Founding 100 member
    if (config.licenseKey?.metadata?.discord_member_number && parseInt(config.licenseKey.metadata.discord_member_number) <= 100) {
      document.getElementById('founding100Badge').style.display = 'block';
    }

    // Join Discord button
    document.getElementById('joinDiscordBtn').addEventListener('click', () => {
      const discordInviteUrl = 'https://discord.gg/nexus-alert-insiders';
      chrome.tabs.create({ url: discordInviteUrl });
      sendMessage({ action: 'trackEvent', event: 'discord_join_clicked', data: { email: config.email } });
    });
  }

  // Upgrade button
  document.getElementById('upgradeBtn').addEventListener('click', async () => {
    const email = document.getElementById('upgradeEmail').value.trim();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    await updateConfig({ email });
    const btn = document.getElementById('upgradeBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Redirecting...';
    btn.disabled = true;
    try {
      // Get referral code from config if user came from a referral link
      const body = { email, plan: selectedPlan };
      if (config.referralCode) {
        body.ref = config.referralCode;
      }

      // Track upgrade button click (Plausible - funnel step 1)
      sendMessage({
        action: 'trackEvent',
        event: 'upgrade_clicked',
        data: {
          source: 'extension_popup',
          plan: selectedPlan
        }
      });

      // Track conversion event (Plausible)
      sendMessage({
        action: 'trackEvent',
        event: selectedPlan === 'annual' ? 'Checkout - Annual' : 'Checkout - Monthly',
        data: {
          source: 'extension_popup',
          plan: selectedPlan,
          email_domain: email.split('@')[1]
        }
      });

      const resp = await fetch('https://api.nexus-alert.com/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await resp.json();
      if (data.url) {
        chrome.tabs.create({ url: data.url });
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e) {
      console.error('[NEXUS Alert] Upgrade error:', e);
      btn.textContent = 'Error — try again';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
      }, 3000);
    }
  });

  // Restore button
  document.getElementById('restoreBtn').addEventListener('click', async () => {
    const email = document.getElementById('upgradeEmail').value.trim();
    if (!email) {
      alert('Please enter your email address to restore your license');
      return;
    }
    const btn = document.getElementById('restoreBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Checking...';
    btn.disabled = true;
    try {
      const resp = await fetch(`https://api.nexus-alert.com/api/license?email=${encodeURIComponent(email)}`);
      if (resp.ok) {
        const data = await resp.json();
        await updateConfig({ tier: data.tier, licenseKey: data.licenseKey, email });
        // Re-render UI
        document.getElementById('freePlanCard').style.display = 'none';
        document.getElementById('premiumPlanCard').style.display = 'block';
        document.getElementById('communitySection').style.display = 'block';
        document.getElementById('freeIntervalNotice').style.display = 'none';
        btn.textContent = 'Restored!';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      } else {
        throw new Error('License not found');
      }
    } catch (e) {
      console.error('[NEXUS Alert] Restore error:', e);
      btn.textContent = 'License not found';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
      }, 3000);
    }
  });

  // ─── Settings: Sound & Auto-open ────────────────────────────────

  const soundToggle = document.getElementById('soundToggle');
  soundToggle.checked = config.soundEnabled !== false;
  soundToggle.addEventListener('change', () => {
    updateConfig({ soundEnabled: soundToggle.checked });
    toggleSoundPrefsPanel(soundToggle.checked);
  });

  function toggleSoundPrefsPanel(enabled) {
    const panel = document.getElementById('soundPrefsPanel');
    if (panel) {
      panel.style.opacity = enabled ? '1' : '0.4';
      panel.style.pointerEvents = enabled ? 'auto' : 'none';
    }
  }
  toggleSoundPrefsPanel(config.soundEnabled !== false);

  const autoOpenToggle = document.getElementById('autoOpenToggle');
  autoOpenToggle.checked = config.autoOpenBooking === true;
  autoOpenToggle.addEventListener('change', () => {
    updateConfig({ autoOpenBooking: autoOpenToggle.checked });
  });

  // ─── Settings: Desktop Notifications ─────────────────────────────

  const desktopNotifToggle = document.getElementById('desktopNotifToggle');
  desktopNotifToggle.checked = config.desktopNotificationsEnabled !== false;
  desktopNotifToggle.addEventListener('change', () => {
    updateConfig({ desktopNotificationsEnabled: desktopNotifToggle.checked });
  });

  // ─── Settings: Badge Count ───────────────────────────────────────

  const badgeToggle = document.getElementById('badgeToggle');
  badgeToggle.checked = config.badgeEnabled !== false;
  badgeToggle.addEventListener('change', () => {
    updateConfig({ badgeEnabled: badgeToggle.checked });
  });

  // ─── Settings: Notification Frequency ────────────────────────────

  const notifFreqBtns = document.querySelectorAll('.notif-freq-btn');
  notifFreqBtns.forEach(btn => {
    const isActive = btn.dataset.freq === (config.notifFrequency || '30');
    if (isActive) {
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      btn.setAttribute('tabindex', '0');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('tabindex', '-1');
    }
    btn.addEventListener('click', () => {
      notifFreqBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
        b.setAttribute('tabindex', '-1');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      btn.setAttribute('tabindex', '0');
      updateConfig({ notifFrequency: btn.dataset.freq });
    });
  });

  // ─── Settings: Quiet Hours ───────────────────────────────────────

  const quietHoursToggle = document.getElementById('quietHoursToggle');
  const quietHoursRange = document.getElementById('quietHoursRange');
  const quietFrom = document.getElementById('quietFrom');
  const quietTo = document.getElementById('quietTo');

  quietHoursToggle.checked = config.quietHoursEnabled === true;
  quietHoursRange.style.display = config.quietHoursEnabled ? 'flex' : 'none';

  if (config.quietHoursStart) quietFrom.value = config.quietHoursStart;
  if (config.quietHoursEnd) quietTo.value = config.quietHoursEnd;

  quietHoursToggle.addEventListener('change', () => {
    const enabled = quietHoursToggle.checked;
    quietHoursRange.style.display = enabled ? 'flex' : 'none';
    updateConfig({ quietHoursEnabled: enabled });
  });
  quietFrom.addEventListener('change', () => {
    updateConfig({ quietHoursStart: quietFrom.value });
  });
  quietTo.addEventListener('change', () => {
    updateConfig({ quietHoursEnd: quietTo.value });
  });

  // ─── Settings: Sound Type ────────────────────────────────────────

  const soundTypeBtns = document.querySelectorAll('.sound-type-btn');
  soundTypeBtns.forEach(btn => {
    const isActive = btn.dataset.sound === (config.soundType || 'chime');
    if (isActive) {
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-checked', 'false');
    }
    btn.addEventListener('click', () => {
      soundTypeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      updateConfig({ soundType: btn.dataset.sound });
    });
  });

  // ─── Settings: Volume Slider ─────────────────────────────────────

  const volumeSlider = document.getElementById('volumeSlider');
  const volumeLabel = document.getElementById('volumeLabel');
  volumeSlider.value = config.soundVolume ?? 70;
  volumeLabel.textContent = `${volumeSlider.value}%`;

  volumeSlider.addEventListener('input', () => {
    volumeLabel.textContent = `${volumeSlider.value}%`;
  });
  volumeSlider.addEventListener('change', () => {
    updateConfig({ soundVolume: parseInt(volumeSlider.value) });
  });

  // ─── Settings: Test Sound ────────────────────────────────────────

  document.getElementById('testSoundBtn').addEventListener('click', async () => {
    const btn = document.getElementById('testSoundBtn');
    btn.textContent = '🔊 Playing...';
    btn.disabled = true;
    await sendMessage({
      action: 'testSound',
      soundType: config.soundType || 'chime',
      volume: parseInt(volumeSlider.value)
    });
    setTimeout(() => {
      btn.textContent = '▶ Test Sound';
      btn.disabled = false;
    }, 1500);
  });

  // ─── Settings: Preferred Locations ───────────────────────────────

  const favLocations = config.favoriteLocations || [];
  renderFavLocations(favLocations, locations);

  // Event delegation for favorite location remove buttons
  document.getElementById('favLocationsList').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.fav-remove-btn');
    if (removeBtn) {
      e.stopPropagation();
      const id = parseInt(removeBtn.dataset.id);
      removeFavoriteLocation(id, locations);
    }
  });

  // Location search
  const favSearchInput = document.getElementById('favLocationSearch');
  const favDropdown = document.getElementById('favLocationDropdown');

  favSearchInput.addEventListener('input', () => {
    const query = favSearchInput.value.toLowerCase().trim();
    if (query.length < 2) {
      favDropdown.classList.remove('visible');
      return;
    }
    const currentFavs = config.favoriteLocations || [];
    const matches = Object.values(locations)
      .filter(loc =>
        (loc.name || '').toLowerCase().includes(query) ||
        (loc.city || '').toLowerCase().includes(query) ||
        (loc.state || '').toLowerCase().includes(query)
      )
      .filter(loc => !currentFavs.includes(loc.id))
      .slice(0, 8);

    if (matches.length === 0) {
      favDropdown.innerHTML = '<div style="padding:8px;font-size:11px;color:var(--text-muted)">No matching locations</div>';
    } else {
      favDropdown.innerHTML = matches.map(loc => `
        <div class="location-dropdown-item" data-id="${loc.id}">
          <span class="loc-name">${loc.name}</span>
          <span class="loc-region">${loc.state || loc.country || ''}</span>
          <span class="add-icon">+</span>
        </div>
      `).join('');
    }
    favDropdown.classList.add('visible');

    favDropdown.querySelectorAll('.location-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id);
        addFavoriteLocation(id, locations);
        favSearchInput.value = '';
        favDropdown.classList.remove('visible');
      });
    });
  });

  favSearchInput.addEventListener('blur', () => {
    setTimeout(() => favDropdown.classList.remove('visible'), 200);
  });

  // Region quick-select chips
  const REGION_MAP = {
    'US-West': ['WA', 'OR', 'CA', 'NV', 'AZ', 'ID', 'MT', 'WY', 'CO', 'UT', 'NM', 'AK', 'HI'],
    'US-East': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'VA', 'WV', 'NC', 'SC', 'GA', 'FL', 'DC'],
    'US-South': ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY'],
    'Canada': ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
  };

  document.querySelectorAll('.region-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const region = chip.dataset.region;
      const states = REGION_MAP[region] || [];
      chip.classList.toggle('active');

      const regionLocs = Object.values(locations)
        .filter(loc => states.includes(loc.state) || (region === 'Canada' && (loc.country === 'CA' || loc.country === 'Canada')))
        .map(loc => loc.id);

      const currentFavs = config.favoriteLocations || [];
      const isActive = chip.classList.contains('active');

      let newFavs;
      if (isActive) {
        const combined = new Set([...currentFavs, ...regionLocs]);
        newFavs = Array.from(combined);
      } else {
        newFavs = currentFavs.filter(id => !regionLocs.includes(id));
      }

      config.favoriteLocations = newFavs;
      updateConfig({ favoriteLocations: newFavs });
      renderFavLocations(newFavs, locations);

      sendMessage({
        action: 'trackEvent',
        event: 'region_quick_select',
        data: { region, action: isActive ? 'add' : 'remove', count: regionLocs.length }
      });
    });
  });

  function addFavoriteLocation(locationId, allLocations) {
    const currentFavs = config.favoriteLocations || [];
    if (currentFavs.includes(locationId)) return;
    const newFavs = [...currentFavs, locationId];
    config.favoriteLocations = newFavs;
    updateConfig({ favoriteLocations: newFavs });
    renderFavLocations(newFavs, allLocations);
  }

  function removeFavoriteLocation(locationId, allLocations) {
    const currentFavs = config.favoriteLocations || [];
    const newFavs = currentFavs.filter(id => id !== locationId);
    config.favoriteLocations = newFavs;
    updateConfig({ favoriteLocations: newFavs });
    renderFavLocations(newFavs, allLocations);
  }

  // ─── Upgrade Banner Logic ──────────────────────────────────────

  // Check if banner should be shown (3+ days after install, not dismissed, free tier)
  chrome.storage.local.get(['installDate', 'bannerDismissed'], (result) => {
    const installDate = result.installDate;
    const bannerDismissed = result.bannerDismissed;
    const isPremium = config.tier === 'premium';

    if (!isPremium && installDate && !bannerDismissed) {
      const daysSinceInstall = (Date.now() - installDate) / (1000 * 60 * 60 * 24);
      if (daysSinceInstall >= 3) {
        document.getElementById('upgradeBanner').classList.remove('hidden');
        sendMessage({ action: 'trackEvent', event: 'upgrade_banner_shown', data: { daysSinceInstall: Math.floor(daysSinceInstall) } });
      }
    }
  });

  // Banner upgrade button
  document.getElementById('bannerUpgradeBtn').addEventListener('click', () => {
    sendMessage({ action: 'trackEvent', event: 'upgrade_banner_clicked', data: { source: '3day_persistent' } });
    chrome.tabs.create({ url: 'https://nexusalert.app/pricing?utm_source=extension&utm_medium=banner&utm_campaign=3day_persistent' });
  });

  // Banner dismiss button
  document.getElementById('bannerDismissBtn').addEventListener('click', () => {
    document.getElementById('upgradeBanner').classList.add('hidden');
    chrome.storage.local.set({ bannerDismissed: true });
  });

  // ─── Upgrade Modal Logic ────────────────────────────────────────

  // Modal upgrade button
  document.getElementById('upgradeNowBtn').addEventListener('click', () => {
    sendMessage({ action: 'trackEvent', event: 'upgrade_modal_clicked', data: { source: 'manual_check' } });
    chrome.tabs.create({ url: 'https://nexusalert.app/pricing?utm_source=extension&utm_medium=modal&utm_campaign=manual_check' });
    closeUpgradeModal();
  });

  // Modal dismiss button
  document.getElementById('dismissModalBtn').addEventListener('click', () => {
    closeUpgradeModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('upgradeModal');
      if (!modal.classList.contains('hidden')) {
        closeUpgradeModal();
      }
    }
  });

  function closeUpgradeModal() {
    document.getElementById('upgradeModal').classList.add('hidden');
    // Return focus to the element that triggered the modal
    document.getElementById('checkNowBtn').focus();
  }

  // ─── Check Now Button ──────────────────────────────────────────

  document.getElementById('checkNowBtn').addEventListener('click', async () => {
    const btn = document.getElementById('checkNowBtn');
    btn.textContent = 'Checking...';
    btn.disabled = true;
    await sendMessage({ action: 'checkNow' });
    btn.textContent = 'Check Now';
    btn.disabled = false;
    updateLastCheck(new Date().toISOString());

    const freshStatus = await sendMessage({ action: 'getStatus' });
    renderLiveSlots(freshStatus.lastFoundSlots || [], freshStatus.locations || {});
    renderSlotHistory(freshStatus.slotHistory || [], freshStatus.locations || {});

    // Show upgrade modal for free users after manual check
    const isPremium = freshStatus.config?.tier === 'premium';
    if (!isPremium) {
      document.getElementById('upgradeModal').classList.remove('hidden');
      sendMessage({ action: 'trackEvent', event: 'upgrade_modal_shown', data: { trigger: 'manual_check' } });
    }
  });

  // ─── Open GOES Button ──────────────────────────────────────────

  document.getElementById('openSiteBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://ttp.cbp.dhs.gov/' });
  });

  // ─── Slot History ──────────────────────────────────────────────

  renderSlotHistory(slotHistory, locations);

  document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
    await sendMessage({ action: 'clearHistory' });
    renderSlotHistory([], locations);
    updateStats([], locations);
  });

  // ─── Settings: Refresh Locations ────────────────────────────────

  document.getElementById('refreshLocationsBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshLocationsBtn');
    btn.textContent = 'Refreshing...';
    btn.disabled = true;
    await sendMessage({ action: 'refreshLocations' });
    const fresh = await sendMessage({ action: 'getStatus' });
    renderLocations(fresh.locations || {}, config.program || 'NEXUS', config.locations || []);
    btn.textContent = 'Refresh Locations';
    btn.disabled = false;
  });

  // ─── Settings: Export Data ──────────────────────────────────────

  document.getElementById('exportDataBtn').addEventListener('click', async () => {
    const data = await sendMessage({ action: 'getStatus' });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-alert-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// ─── Referral Tab Initialization ──────────────────────────────────

function initReferralTab(config) {
  const email = config.email;
  const referralLinkInput = document.getElementById('referralLink');
  const copyBtn = document.getElementById('copyReferralBtn');
  const copyFeedback = document.getElementById('copyFeedback');

  if (!email) {
    referralLinkInput.value = 'Set email in Settings first';
    referralLinkInput.style.opacity = '0.5';
    return;
  }

  // Generate referral code: deterministic hash from email
  const referralCode = generateReferralCode(email);
  const shareUrl = `https://nexus-alert.com/?ref=${referralCode}`;

  referralLinkInput.value = shareUrl;

  // Initialize referral on backend (ensures code is registered)
  fetch('https://api.nexus-alert.com/api/referral/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).catch(() => {});

  // Fetch referral stats
  fetchAndDisplayReferralStats(referralCode);

  // Copy button
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copyFeedback.style.display = 'block';
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = 'var(--green)';
      sendMessage({ action: 'trackEvent', event: 'referral_link_copied', data: { code: referralCode } });
      setTimeout(() => {
        copyFeedback.style.display = 'none';
        copyBtn.textContent = 'Copy';
        copyBtn.style.background = '';
      }, 2000);
    } catch (err) {
      referralLinkInput.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    }
  });

  // Twitter share
  document.getElementById('shareTwitterBtn').addEventListener('click', () => {
    const tweetText = encodeURIComponent(`I found my NEXUS appointment in 3 days with @NexusAlert instead of waiting months! ${shareUrl}`);
    chrome.tabs.create({ url: `https://twitter.com/intent/tweet?text=${tweetText}` });
    sendMessage({ action: 'trackEvent', event: 'referral_share_twitter', data: { code: referralCode } });
  });

  // Facebook share
  document.getElementById('shareFacebookBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` });
    sendMessage({ action: 'trackEvent', event: 'referral_share_facebook', data: { code: referralCode } });
  });

  // WhatsApp share
  document.getElementById('shareWhatsAppBtn').addEventListener('click', () => {
    const msg = encodeURIComponent(`Hey! I've been using this Chrome extension to find NEXUS/Global Entry appointment slots instantly. Way faster than refreshing manually. Check it out: ${shareUrl}`);
    chrome.tabs.create({ url: `https://wa.me/?text=${msg}` });
    sendMessage({ action: 'trackEvent', event: 'referral_share_whatsapp', data: { code: referralCode } });
  });

  // Email share
  document.getElementById('shareEmailBtn').addEventListener('click', () => {
    const subject = encodeURIComponent('Check out NEXUS Alert - Find appointments fast!');
    const body = encodeURIComponent(`Hey!\n\nAre you still waiting for a NEXUS or Global Entry appointment?\n\nI've been using this Chrome extension that alerts me instantly when appointment slots open up. I found mine in just a few days instead of waiting months.\n\nYou'll get 50% off your first month if you use my link:\n${shareUrl}\n\nHighly recommend it!`);
    chrome.tabs.create({ url: `mailto:?subject=${subject}&body=${body}` });
    sendMessage({ action: 'trackEvent', event: 'referral_share_email', data: { code: referralCode } });
  });

  // Quick share message cards
  document.querySelectorAll('.share-message-card').forEach(card => {
    card.addEventListener('click', async () => {
      const message = card.dataset.message + ' ' + shareUrl;
      try {
        await navigator.clipboard.writeText(message);
        const hint = card.querySelector('[style*="accent"]');
        if (hint) {
          hint.textContent = 'Copied!';
          hint.style.color = 'var(--green)';
          setTimeout(() => {
            hint.textContent = 'Click to copy with your link';
            hint.style.color = '';
          }, 2000);
        }
        sendMessage({ action: 'trackEvent', event: 'referral_message_copied', data: { code: referralCode } });
      } catch (err) {
        // Fallback: open Twitter with message
        const tweetText = encodeURIComponent(message);
        chrome.tabs.create({ url: `https://twitter.com/intent/tweet?text=${tweetText}` });
      }
    });
  });
}

// Generate a deterministic referral code from email
function generateReferralCode(email) {
  let hash = 0;
  const str = email.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
}

// Fetch and display referral stats from backend
async function fetchAndDisplayReferralStats(referralCode) {
  try {
    const resp = await fetch(`https://api.nexus-alert.com/api/referrals/${encodeURIComponent(referralCode)}`);
    if (!resp.ok) return;

    const data = await resp.json();
    const clicks = data.clicks || 0;
    const conversions = data.conversions || 0;
    const freeMonths = data.freeMonthsEarned || conversions;

    document.getElementById('referralClicks').textContent = clicks;
    document.getElementById('referralConversions').textContent = conversions;
    document.getElementById('referralFreeMonths').textContent = freeMonths;

    // Show credit banner if user has earned free months
    if (freeMonths > 0) {
      const banner = document.getElementById('referralCreditBanner');
      banner.style.display = 'block';
      document.getElementById('creditBannerText').textContent =
        `You've referred ${conversions} friend${conversions !== 1 ? 's' : ''} — ${freeMonths} month${freeMonths !== 1 ? 's' : ''} free earned!`;
    }
  } catch (err) {
    console.error('[NEXUS Alert] Failed to fetch referral stats:', err);
  }
}

// ─── Render Live Slots ────────────────────────────────────────────

function renderLiveSlots(slots, locations) {
  const container = document.getElementById('liveSlotsList');

  if (!slots || slots.length === 0) {
    container.innerHTML = '<div class="empty-state">No slots found yet. Click "Check Now" to scan.</div>';
    return;
  }

  container.innerHTML = slots.slice(0, 10).map(slot => {
    const locName = locations?.[slot.locationId]?.name || `Location ${slot.locationId}`;
    const date = new Date(slot.startTimestamp);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    return `
      <div class="slot-card" role="article" aria-label="Appointment slot: ${dateStr} at ${timeStr} at ${locName}">
        <div class="slot-info">
          <div class="slot-date">${dateStr}</div>
          <div class="slot-time">${timeStr}</div>
          <div class="slot-location">${locName}</div>
        </div>
        <button class="book-btn" data-url="https://ttp.cbp.dhs.gov/" aria-label="Book appointment for ${dateStr} at ${locName}">Book</button>
      </div>
    `;
  }).join('');

  if (slots.length > 10) {
    container.innerHTML += `<div style="text-align:center;padding:6px;color:var(--text-muted);font-size:11px">+${slots.length - 10} more slots</div>`;
  }

  container.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chrome.tabs.create({ url: btn.dataset.url });
    });
  });
}

// ─── Render Locations ─────────────────────────────────────────────

function renderLocations(allLocations, program, selectedIds, favoriteIds) {
  const list = document.getElementById('locationList');

  // Check if allLocations is empty (no locations loaded yet)
  if (!allLocations || Object.keys(allLocations).length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No locations loaded yet</p>
        <button class="btn btn-secondary" id="refreshLocationsEmptyBtn" style="margin-top:8px">Refresh Locations</button>
      </div>
    `;
    // Wire up the button
    const btn = document.getElementById('refreshLocationsEmptyBtn');
    if (btn) {
      btn.addEventListener('click', async () => {
        btn.textContent = 'Refreshing...';
        btn.disabled = true;
        await sendMessage({ action: 'refreshLocations' });
        const fresh = await sendMessage({ action: 'getStatus' });
        renderLocations(fresh.locations || {}, program, selectedIds);
        btn.textContent = 'Refresh Locations';
        btn.disabled = false;
      });
    }
    return;
  }

  const filtered = Object.values(allLocations)
    .filter(loc => {
      if (!loc.services) return false;
      return loc.services.some(s =>
        s.toLowerCase().includes(program.toLowerCase())
      );
    })
    .sort((a, b) => {
      const favIds = favoriteIds || [];
      const aFav = favIds.includes(a.id);
      const bFav = favIds.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      const aSelected = selectedIds.includes(a.id);
      const bSelected = selectedIds.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No locations found for this program</div>';
    return;
  }

  list.innerHTML = filtered.map(loc => {
    const selected = selectedIds.includes(loc.id);
    const statusClass = loc.operational ? 'operational' : 'closed';
    const statusText = loc.operational ? 'Open' : 'Closed';
    return `
      <div class="location-item ${selected ? 'selected' : ''}" data-id="${loc.id}" role="option" aria-selected="${selected}">
        <input type="checkbox" ${selected ? 'checked' : ''} aria-label="Monitor ${loc.name}">
        <div style="flex:1">
          <div class="location-name">${loc.name}</div>
          <div class="location-meta">${loc.city || ''}, ${loc.state || ''} ${loc.country || ''}</div>
        </div>
        <span class="location-status ${statusClass}" aria-label="Status: ${statusText}">${statusText}</span>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.location-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const id = parseInt(item.dataset.id);
      const checkbox = item.querySelector('input[type="checkbox"]');

      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      item.classList.toggle('selected', checkbox.checked);

      const allChecked = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => parseInt(cb.closest('.location-item').dataset.id));
      updateConfig({ locations: allChecked });
    });
  });
}

// ─── Render Slot History ──────────────────────────────────────────

function renderSlotHistory(history, locations) {
  const container = document.getElementById('historyList');

  updateStats(history, locations);

  if (!history || history.length === 0) {
    container.innerHTML = '<div class="empty-state">No history yet</div>';
    return;
  }

  // Show most recent first, deduplicated
  const seen = new Set();
  const unique = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const key = `${history[i].locationId}-${history[i].startTimestamp}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(history[i]);
    }
  }

  container.innerHTML = unique.slice(0, 50).map(entry => {
    const locName = locations?.[entry.locationId]?.name || `Location ${entry.locationId}`;
    const slotDate = new Date(entry.startTimestamp);
    const dateStr = slotDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const timeStr = slotDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const seenDate = new Date(entry.seenAt);
    const seenStr = seenDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    return `
      <div class="history-item">
        <div><strong>${dateStr}</strong> at ${timeStr} — ${locName}</div>
        <div class="history-seen">Seen: ${seenStr}</div>
      </div>
    `;
  }).join('');
}

// ─── Stats ────────────────────────────────────────────────────────

function updateStats(history, locations) {
  const total = new Set(history.map(h => `${h.locationId}-${h.startTimestamp}`)).size;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const today = history.filter(h => h.seenAt >= todayStart.getTime()).length;
  const locs = new Set(history.map(h => h.locationId)).size;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statToday').textContent = today;
  document.getElementById('statLocations').textContent = locs;
}

// ─── Status UI ────────────────────────────────────────────────────

function updateStatusUI(enabled) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const statusBar = dot.closest('.status-bar');
  if (enabled) {
    dot.className = 'status-dot active';
    text.textContent = 'Monitoring';
    statusBar.setAttribute('aria-label', 'Status: Monitoring active');
  } else {
    dot.className = 'status-dot inactive';
    text.textContent = 'Paused';
    statusBar.setAttribute('aria-label', 'Status: Monitoring paused');
  }
}

function updateLastCheck(isoString) {
  const el = document.getElementById('lastCheck');
  if (!isoString) {
    el.textContent = 'Never checked';
    return;
  }
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) {
    el.textContent = 'Just now';
  } else if (diffMin < 60) {
    el.textContent = `${diffMin}m ago`;
  } else {
    el.textContent = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}

// ─── Communication ────────────────────────────────────────────────

function sendMessage(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response || {});
    });
  });
}

function updateConfig(partial) {
  sendMessage({ action: 'updateConfig', config: partial });
}

// ─── Render Favorite Locations ─────────────────────────────────────

function renderFavLocations(favIds, allLocations) {
  const container = document.getElementById('favLocationsList');

  if (!favIds || favIds.length === 0) {
    container.innerHTML = '<div class="empty-state" style="font-size:11px;padding:10px">No pinned locations yet. Search above to add favorites.</div>';
    return;
  }

  container.innerHTML = favIds.map(id => {
    const loc = allLocations?.[id];
    if (!loc) return '';
    return `
      <div class="fav-location-item" data-id="${id}">
        <span style="font-size:12px">📍</span>
        <div style="flex:1;min-width:0">
          <div class="fav-name">${loc.name}</div>
          <div class="fav-meta">${loc.city || ''}, ${loc.state || ''}</div>
        </div>
        <button class="fav-remove-btn" data-id="${id}" aria-label="Remove ${loc.name} from favorites">&times;</button>
      </div>
    `;
  }).filter(Boolean).join('');

  if (container.innerHTML === '') {
    container.innerHTML = '<div class="empty-state" style="font-size:11px;padding:10px">No pinned locations yet. Search above to add favorites.</div>';
  }
}
