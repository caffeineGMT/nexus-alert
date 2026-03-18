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
      message.textContent = '⚠ Could not reach CBP API. Retrying with backoff...';
      banner.style.display = 'flex';
    }
  }

  // ─── Tab Navigation ─────────────────────────────────────────────

  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      tabItems.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
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
    } else {
      tab.classList.remove('active');
    }
    tab.addEventListener('click', () => {
      programTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateConfig({ program: tab.dataset.program });
      document.getElementById('locationSpinner').style.display = 'block';
      setTimeout(() => {
        renderLocations(locations, tab.dataset.program, config.locations || []);
        document.getElementById('locationSpinner').style.display = 'none';
      }, 100);
    });
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
    if (parseInt(btn.dataset.interval) === (config.pollIntervalMinutes || 3)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    btn.addEventListener('click', () => {
      intervalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateConfig({ pollIntervalMinutes: parseInt(btn.dataset.interval) });
    });
  });

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

  // ─── Settings: Referral Program ────────────────────────────────

  // Show referral section only if user has email configured
  if (config.email) {
    document.getElementById('referralSection').style.display = 'block';

    // Generate referral code from email (base64 encoded, first 8 chars)
    const referralCode = btoa(config.email).slice(0, 8);
    const referralUrl = `https://nexus-alert.com?ref=${referralCode}`;
    document.getElementById('referralUrl').value = referralUrl;

    // Fetch referral stats
    fetchReferralStats(config.email);

    // Copy referral URL to clipboard
    document.getElementById('copyReferralBtn').addEventListener('click', async () => {
      const btn = document.getElementById('copyReferralBtn');
      const urlInput = document.getElementById('referralUrl');

      try {
        await navigator.clipboard.writeText(urlInput.value);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--green)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2000);
      } catch (err) {
        // Fallback: select the text
        urlInput.select();
        document.execCommand('copy');
        btn.textContent = 'Copied!';
      }
    });
  }

  async function fetchReferralStats(email) {
    try {
      const referralCode = btoa(email).slice(0, 8);
      const resp = await fetch(`https://api.nexus-alert.com/api/referrals/${encodeURIComponent(referralCode)}`);
      if (resp.ok) {
        const data = await resp.json();
        document.getElementById('referralClicks').textContent = data.clicks || 0;
        document.getElementById('referralConversions').textContent = data.conversions || 0;
      }
    } catch (err) {
      console.error('[NEXUS Alert] Failed to fetch referral stats:', err);
    }
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
      // Open Discord invite link (to be created)
      const discordInviteUrl = 'https://discord.gg/nexus-alert-insiders';
      chrome.tabs.create({ url: discordInviteUrl });

      // Track Discord join event
      sendMessage({ action: 'trackEvent', event: 'discord_join_clicked', data: { email: config.email } });
    });
  }

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
  });

  const autoOpenToggle = document.getElementById('autoOpenToggle');
  autoOpenToggle.checked = config.autoOpenBooking === true;
  autoOpenToggle.addEventListener('change', () => {
    updateConfig({ autoOpenBooking: autoOpenToggle.checked });
  });

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
      }
    }
  });

  // Banner upgrade button
  document.getElementById('bannerUpgradeBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://nexusalert.app/pricing' });
  });

  // Banner dismiss button
  document.getElementById('bannerDismissBtn').addEventListener('click', () => {
    document.getElementById('upgradeBanner').classList.add('hidden');
    chrome.storage.local.set({ bannerDismissed: true });
  });

  // ─── Upgrade Modal Logic ────────────────────────────────────────

  // Modal upgrade button
  document.getElementById('upgradeNowBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://nexusalert.app/pricing' });
    document.getElementById('upgradeModal').classList.add('hidden');
  });

  // Modal dismiss button
  document.getElementById('dismissModalBtn').addEventListener('click', () => {
    document.getElementById('upgradeModal').classList.add('hidden');
  });

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
      <div class="slot-card">
        <div class="slot-info">
          <div class="slot-date">${dateStr}</div>
          <div class="slot-time">${timeStr}</div>
          <div class="slot-location">${locName}</div>
        </div>
        <button class="book-btn" data-url="https://ttp.cbp.dhs.gov/">Book</button>
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

function renderLocations(allLocations, program, selectedIds) {
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
      <div class="location-item ${selected ? 'selected' : ''}" data-id="${loc.id}">
        <input type="checkbox" ${selected ? 'checked' : ''}>
        <div style="flex:1">
          <div class="location-name">${loc.name}</div>
          <div class="location-meta">${loc.city || ''}, ${loc.state || ''} ${loc.country || ''}</div>
        </div>
        <span class="location-status ${statusClass}">${statusText}</span>
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
  if (enabled) {
    dot.className = 'status-dot active';
    text.textContent = 'Monitoring';
  } else {
    dot.className = 'status-dot inactive';
    text.textContent = 'Paused';
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

// ─── Referral Program ─────────────────────────────────────────────────

async function loadReferralData() {
  const email = config.email || localStorage.getItem('userEmail');
  if (!email) {
    // Show email prompt if not set
    document.getElementById('referralSection').style.display = 'none';
    return;
  }

  try {
    // Generate referral code from email
    const code = btoa(email).substring(0, 8).toUpperCase();
    const shareUrl = `https://nexus-alert.com?ref=${code}`;

    document.getElementById('referralLink').value = shareUrl;

    // Load referral stats from backend
    const response = await fetch(`https://api.nexus-alert.com/api/referrals/${code}`);
    if (response.ok) {
      const stats = await response.json();
      document.getElementById('referralCount').textContent = stats.conversions || 0;
      document.getElementById('freeMonthsEarned').textContent = stats.conversions || 0;
      document.getElementById('referralClicks').textContent = stats.clicks || 0;

      if (stats.conversions > 0 || stats.clicks > 0) {
        document.getElementById('referralStats').style.display = 'block';
      }
    }

    // Set up event listeners
    document.getElementById('copyReferralBtn').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        const feedback = document.getElementById('copyFeedback');
        feedback.style.display = 'block';
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
        // Fallback: select text
        document.getElementById('referralLink').select();
      }
    });

    document.getElementById('shareTwitterBtn').addEventListener('click', () => {
      const tweetText = encodeURIComponent(`I found my NEXUS appointment in 3 days with @NexusAlert 🎉 ${shareUrl}`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    });

    document.getElementById('shareEmailBtn').addEventListener('click', () => {
      const subject = encodeURIComponent('Check out NEXUS Alert!');
      const body = encodeURIComponent(`Hey! Are you still waiting for a NEXUS appointment?\n\nI've been using this Chrome extension that alerts me instantly when slots open up - it's way better than refreshing manually.\n\nCheck it out: ${shareUrl}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    });
  } catch (err) {
    console.error('Error loading referral data:', err);
  }
}

// Initialize referral section
loadReferralData();
