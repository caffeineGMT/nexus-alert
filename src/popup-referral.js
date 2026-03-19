// NEXUS Alert — Referral Tab Module (Lazy Loaded)
// Only loaded when Refer tab is clicked

export function init(config) {
  console.log('[Referral Module] Initialized');

  const email = config.email || '';

  // Generate referral link
  const referralLink = generateReferralLink(email);
  const referralLinkInput = document.getElementById('referralLink');

  if (referralLinkInput) {
    if (email) {
      referralLinkInput.value = referralLink;
    } else {
      referralLinkInput.value = 'Set email in Settings first';
    }
  }

  // Copy referral link
  const copyBtn = document.getElementById('copyReferralBtn');
  const copyFeedback = document.getElementById('copyFeedback');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (!email) {
        window.showToast('Set your email in Settings first', 'error');
        return;
      }

      try {
        await navigator.clipboard.writeText(referralLink);
        if (copyFeedback) {
          copyFeedback.style.display = 'block';
          setTimeout(() => {
            copyFeedback.style.display = 'none';
          }, 2000);
        }
        window.showToast('Referral link copied!', 'success');
      } catch (err) {
        window.showToast('Failed to copy', 'error');
      }
    });
  }

  // Social share buttons
  const shareButtons = {
    twitter: document.getElementById('shareTwitterBtn'),
    facebook: document.getElementById('shareFacebookBtn'),
    whatsapp: document.getElementById('shareWhatsAppBtn'),
    email: document.getElementById('shareEmailBtn')
  };

  const shareText = 'I found my NEXUS appointment 3x faster using NEXUS Alert!';

  if (shareButtons.twitter) {
    shareButtons.twitter.addEventListener('click', () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;
      chrome.tabs.create({ url });
    });
  }

  if (shareButtons.facebook) {
    shareButtons.facebook.addEventListener('click', () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
      chrome.tabs.create({ url });
    });
  }

  if (shareButtons.whatsapp) {
    shareButtons.whatsapp.addEventListener('click', () => {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
      chrome.tabs.create({ url });
    });
  }

  if (shareButtons.email) {
    shareButtons.email.addEventListener('click', () => {
      const subject = 'Check out NEXUS Alert';
      const body = `${shareText}\n\n${referralLink}`;
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    });
  }

  // Pre-written share messages
  const shareCards = document.querySelectorAll('.share-message-card');
  shareCards.forEach(card => {
    card.addEventListener('click', async () => {
      const message = card.dataset.message;
      const fullText = `${message} ${referralLink}`;

      try {
        await navigator.clipboard.writeText(fullText);
        window.showToast('Message copied with your link!', 'success');
      } catch (err) {
        window.showToast('Failed to copy', 'error');
      }
    });
  });

  // Load referral stats
  loadReferralStats(email);
}

function generateReferralLink(email) {
  if (!email) return 'https://nexus-alert.com';

  const code = generateReferralCode(email);
  return `https://nexus-alert.com?ref=${code}`;
}

function generateReferralCode(email) {
  // Simple hash of email for referral code
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
}

async function loadReferralStats(email) {
  if (!email) {
    // Show zero stats
    updateStatsUI(0, 0, 0);
    return;
  }

  try {
    // TODO: Fetch real stats from backend
    // For now, get from local storage
    const stats = await window.storage.get('referralStats', {
      freeMonths: 0,
      conversions: 0,
      clicks: 0
    });

    updateStatsUI(stats.freeMonths, stats.conversions, stats.clicks);

    // Show credit banner if user has earned free months
    const creditBanner = document.getElementById('referralCreditBanner');
    const creditText = document.getElementById('creditBannerText');

    if (stats.freeMonths > 0 && creditBanner && creditText) {
      creditText.textContent = `You've earned ${stats.freeMonths} free month${stats.freeMonths > 1 ? 's' : ''}!`;
      creditBanner.style.display = 'block';
    }
  } catch (err) {
    console.error('[Referral] Failed to load stats:', err);
  }
}

function updateStatsUI(freeMonths, conversions, clicks) {
  const elements = {
    freeMonths: document.getElementById('referralFreeMonths'),
    conversions: document.getElementById('referralConversions'),
    clicks: document.getElementById('referralClicks')
  };

  if (elements.freeMonths) elements.freeMonths.textContent = freeMonths;
  if (elements.conversions) elements.conversions.textContent = conversions;
  if (elements.clicks) elements.clicks.textContent = clicks;
}

export default { init };
