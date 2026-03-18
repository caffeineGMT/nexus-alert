// NEXUS Alert — Onboarding Script

let currentStep = 1;
let selectedProgram = 'NEXUS';
let selectedLocationIds = [];
let allLocations = {};
let referralCode = null;

// Capture referral code from URL parameters
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('ref')) {
  referralCode = urlParams.get('ref');
  console.log('[NEXUS Alert] Referral code detected:', referralCode);
}

// ─── Step Navigation ───────────────────────────────────────────────

function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });

  // Update step indicators
  document.querySelectorAll('.step-dot').forEach((dot, index) => {
    if (index < stepNumber) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Show target step
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  currentStep = stepNumber;

  // Load locations when entering step 2
  if (stepNumber === 2 && Object.keys(allLocations).length === 0) {
    loadLocations();
  }
}

// ─── Program Selection ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const programTabs = document.querySelectorAll('.program-tab');

  programTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      programTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update selected program
      selectedProgram = tab.dataset.program;

      // Reload locations for new program
      renderLocations();
    });
  });
});

// ─── Location Loading ──────────────────────────────────────────────

async function loadLocations() {
  const container = document.getElementById('locationList');
  container.innerHTML = '<div class="loading-state">Loading locations...</div>';

  try {
    const programs = ['NEXUS', 'Global Entry', 'SENTRI'];
    const tempLocations = {};

    for (const program of programs) {
      const url = `https://ttp.cbp.dhs.gov/schedulerapi/locations/?serviceName=${encodeURIComponent(program)}&operational=true&temporary=false&inviteOnly=false`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to fetch locations for ${program}`);
        continue;
      }

      const locations = await response.json();

      for (const loc of locations) {
        if (!tempLocations[loc.id]) {
          tempLocations[loc.id] = {
            id: loc.id,
            name: loc.name,
            shortName: loc.shortName || loc.name,
            city: loc.city,
            state: loc.state,
            country: loc.countryCode || loc.country,
            services: [program],
            operational: loc.operational
          };
        } else {
          // Location already exists, add this program to services
          if (!tempLocations[loc.id].services.includes(program)) {
            tempLocations[loc.id].services.push(program);
          }
        }
      }
    }

    allLocations = tempLocations;
    renderLocations();
  } catch (error) {
    console.error('Failed to load locations:', error);
    container.innerHTML = '<div class="loading-state" style="color: var(--red);">Failed to load locations. Please try again.</div>';
  }
}

function renderLocations() {
  const container = document.getElementById('locationList');

  // Filter locations by selected program
  const filtered = Object.values(allLocations).filter(loc => {
    return loc.services.some(service =>
      service.toLowerCase().includes(selectedProgram.toLowerCase())
    );
  });

  // Sort: selected first, then alphabetically
  filtered.sort((a, b) => {
    const aSelected = selectedLocationIds.includes(a.id);
    const bSelected = selectedLocationIds.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="loading-state">No locations found for this program</div>';
    return;
  }

  container.innerHTML = filtered.map(loc => {
    const selected = selectedLocationIds.includes(loc.id);
    const locationMeta = [loc.city, loc.state, loc.country].filter(Boolean).join(', ');

    return `
      <div class="location-item ${selected ? 'selected' : ''}" data-id="${loc.id}">
        <input type="checkbox" ${selected ? 'checked' : ''}>
        <div class="location-details">
          <div class="location-name">${loc.name}</div>
          <div class="location-meta">${locationMeta}</div>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers
  container.querySelectorAll('.location-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const id = parseInt(item.dataset.id);
      const checkbox = item.querySelector('input[type="checkbox"]');

      // Toggle checkbox if not clicking the checkbox itself
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      // Update selection state
      item.classList.toggle('selected', checkbox.checked);

      // Update selected IDs array
      if (checkbox.checked) {
        if (!selectedLocationIds.includes(id)) {
          selectedLocationIds.push(id);
        }
      } else {
        selectedLocationIds = selectedLocationIds.filter(locId => locId !== id);
      }

      updateStep2ButtonState();
    });
  });

  updateStep2ButtonState();
}

function updateStep2ButtonState() {
  const nextBtn = document.getElementById('step2NextBtn');
  if (selectedLocationIds.length === 0) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
  } else {
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
  }
}

// ─── Step 3: Notifications ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Test notification button
  const testBtn = document.getElementById('testNotificationBtn');
  testBtn.addEventListener('click', async () => {
    const originalText = testBtn.textContent;
    testBtn.textContent = 'Sending...';
    testBtn.disabled = true;

    try {
      // Create a test notification using the notifications permission
      await chrome.notifications.create('test-notification', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'NEXUS Alert Test',
        message: 'This is how you\'ll be notified when slots are found!',
        priority: 2
      });

      testBtn.textContent = 'Notification Sent!';
      setTimeout(() => {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      testBtn.textContent = 'Failed to send';
      setTimeout(() => {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
      }, 2000);
    }
  });

  // Finish button
  const finishBtn = document.getElementById('finishBtn');
  finishBtn.addEventListener('click', async () => {
    finishBtn.textContent = 'Saving...';
    finishBtn.disabled = true;

    try {
      // Get current config from storage
      const { config: existingConfig } = await chrome.storage.local.get('config');

      // Default config
      const DEFAULT_CONFIG = {
        enabled: true,
        pollIntervalMinutes: 3,
        locations: [],
        program: 'NEXUS',
        dateRange: { start: null, end: null },
        timeRange: { start: null, end: null },
        soundEnabled: true,
        autoOpenBooking: false,
        notifiedSlots: {},
      };

      // Merge with user selections
      const newConfig = {
        ...DEFAULT_CONFIG,
        ...existingConfig,
        program: selectedProgram,
        locations: selectedLocationIds,
        soundEnabled: document.getElementById('soundToggle').checked,
        email: document.getElementById('emailInput').value || null,
        referralCode: referralCode || existingConfig?.referralCode || null,
        onboardingComplete: true
      };

      // Save to storage
      await chrome.storage.local.set({ config: newConfig });

      // Show success and close
      finishBtn.textContent = 'Setup Complete!';

      setTimeout(() => {
        window.close();
      }, 1000);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      finishBtn.textContent = 'Error - Try Again';
      finishBtn.disabled = false;
    }
  });
});
