// NEXUS Alert — Enhanced Multi-Location Search UX
// Provides: autocomplete, bulk actions, distance calculation, improved discoverability

import { storage, getConfig, updateConfig } from './popup-storage.js';

// ─── Geolocation & Distance Calculation ──────────────────────────
let userCoords = null;
let geolocationAttempted = false;

// Request user location (with permission)
async function getUserLocation() {
  if (geolocationAttempted) return userCoords;
  geolocationAttempted = true;

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('[Location Search] User location obtained:', userCoords);
        resolve(userCoords);
      },
      (error) => {
        console.log('[Location Search] Geolocation denied or unavailable:', error.message);
        resolve(null);
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  });
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Radius of Earth in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// ─── Enhanced Location Autocomplete ──────────────────────────────
class LocationAutocomplete {
  constructor(inputId, dropdownId, onSelect) {
    this.input = document.getElementById(inputId);
    this.dropdown = document.getElementById(dropdownId);
    this.onSelect = onSelect;
    this.selectedIndex = -1;
    this.matches = [];

    this.init();
  }

  init() {
    if (!this.input || !this.dropdown) return;

    // Input event
    this.input.addEventListener('input', () => this.handleInput());

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.close();
      }
    });
  }

  async handleInput() {
    const query = this.input.value.toLowerCase().trim();

    if (query.length < 2) {
      this.close();
      return;
    }

    const config = await getConfig();
    const locations = await storage.get('locations', {});
    const currentFavs = config.favoriteLocations || [];
    const userLoc = await getUserLocation();

    // Fuzzy search across name, city, state, country
    this.matches = Object.values(locations)
      .filter(loc => {
        if (currentFavs.includes(loc.id)) return false;

        const searchText = [
          loc.name || '',
          loc.city || '',
          loc.state || '',
          loc.country || ''
        ].join(' ').toLowerCase();

        return searchText.includes(query);
      })
      .map(loc => {
        // Calculate distance if user location available
        let distance = null;
        if (userLoc && loc.latitude && loc.longitude) {
          distance = calculateDistance(
            userLoc.lat,
            userLoc.lng,
            loc.latitude,
            loc.longitude
          );
        }

        return { ...loc, distance };
      })
      .sort((a, b) => {
        // Sort by distance if available, then alphabetically
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance;
        }
        if (a.distance !== null) return -1;
        if (b.distance !== null) return 1;
        return (a.name || '').localeCompare(b.name || '');
      })
      .slice(0, 8);

    this.render();
    this.selectedIndex = -1;
  }

  render() {
    if (this.matches.length === 0) {
      this.dropdown.innerHTML = `
        <div style="padding:8px;font-size:11px;color:var(--text-muted)">
          No matching locations
        </div>
      `;
      this.dropdown.classList.add('visible');
      return;
    }

    this.dropdown.innerHTML = this.matches.map((loc, index) => {
      const distanceText = loc.distance !== null
        ? `<span class="loc-distance">${loc.distance} mi</span>`
        : '';

      return `
        <div class="location-dropdown-item ${index === this.selectedIndex ? 'selected' : ''}"
             data-index="${index}"
             data-id="${loc.id}">
          <div class="loc-main">
            <span class="loc-name">${this.highlightMatch(loc.name || '')}</span>
            <span class="loc-region">${loc.state || loc.country || ''}</span>
          </div>
          <div class="loc-extras">
            ${distanceText}
            <span class="add-icon">+</span>
          </div>
        </div>
      `;
    }).join('');

    this.dropdown.classList.add('visible');

    // Add click handlers
    this.dropdown.querySelectorAll('.location-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id);
        this.selectLocation(id);
      });
    });
  }

  highlightMatch(text) {
    const query = this.input.value.trim();
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  handleKeydown(e) {
    if (!this.dropdown.classList.contains('visible')) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.matches.length - 1);
        this.render();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.render();
        break;
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0 && this.matches[this.selectedIndex]) {
          this.selectLocation(this.matches[this.selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
    }
  }

  selectLocation(id) {
    if (this.onSelect) {
      this.onSelect(id);
    }
    this.input.value = '';
    this.close();
  }

  close() {
    this.dropdown.classList.remove('visible');
    this.selectedIndex = -1;
  }
}

// ─── Bulk Location Actions ───────────────────────────────────────
class BulkLocationActions {
  constructor() {
    this.init();
  }

  init() {
    this.addBulkActionsUI();
    this.attachEventListeners();
  }

  addBulkActionsUI() {
    // Add bulk action controls to the main location list
    const locationSection = document.querySelector('#tab-monitor .section:has(#locationList)');
    if (!locationSection) return;

    const sectionTitle = locationSection.querySelector('.section-title');
    if (!sectionTitle) return;

    // Create bulk actions container
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions-bar';
    bulkActions.id = 'bulkActionsBar';
    bulkActions.innerHTML = `
      <div class="bulk-actions-left">
        <span class="bulk-selected-count" id="bulkSelectedCount">0 selected</span>
      </div>
      <div class="bulk-actions-buttons">
        <button class="bulk-btn" id="selectAllBtn" aria-label="Select all locations">
          Select All
        </button>
        <button class="bulk-btn" id="deselectAllBtn" aria-label="Deselect all locations">
          Deselect All
        </button>
        <button class="bulk-btn bulk-btn-primary" id="bulkAddToFavBtn" aria-label="Add selected to favorites">
          Add to Favorites
        </button>
      </div>
    `;

    // Insert after section title
    sectionTitle.insertAdjacentElement('afterend', bulkActions);

    // Add similar controls to favorites section
    const favSection = document.querySelector('#tab-settings .section:has(#favLocationsList)');
    if (favSection) {
      const favTitle = favSection.querySelector('.section-title');
      if (favTitle) {
        const favBulkActions = document.createElement('div');
        favBulkActions.className = 'bulk-actions-bar';
        favBulkActions.id = 'favBulkActionsBar';
        favBulkActions.innerHTML = `
          <div class="bulk-actions-left">
            <span class="bulk-fav-count" id="bulkFavCount">0 favorites</span>
          </div>
          <div class="bulk-actions-buttons">
            <button class="bulk-btn bulk-btn-danger" id="clearAllFavBtn" aria-label="Clear all favorites">
              Clear All
            </button>
          </div>
        `;

        favTitle.insertAdjacentElement('afterend', favBulkActions);
      }
    }
  }

  attachEventListeners() {
    // Main location list bulk actions
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const bulkAddToFavBtn = document.getElementById('bulkAddToFavBtn');

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => this.selectAll());
    }

    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', () => this.deselectAll());
    }

    if (bulkAddToFavBtn) {
      bulkAddToFavBtn.addEventListener('click', () => this.addSelectedToFavorites());
    }

    // Favorites bulk actions
    const clearAllFavBtn = document.getElementById('clearAllFavBtn');
    if (clearAllFavBtn) {
      clearAllFavBtn.addEventListener('click', () => this.clearAllFavorites());
    }

    // Listen for location selection changes to update count
    this.observeLocationChanges();
  }

  async selectAll() {
    const locationList = document.getElementById('locationList');
    if (!locationList) return;

    const checkboxes = locationList.querySelectorAll('input[type="checkbox"]');
    const allIds = [];

    checkboxes.forEach(cb => {
      cb.checked = true;
      const item = cb.closest('.location-item');
      if (item) {
        item.classList.add('selected');
        allIds.push(parseInt(item.dataset.id));
      }
    });

    await updateConfig({ locations: allIds });
    this.updateSelectedCount(allIds.length);
    window.showToast?.(`Selected ${allIds.length} locations`, 'success');
  }

  async deselectAll() {
    const locationList = document.getElementById('locationList');
    if (!locationList) return;

    const checkboxes = locationList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
      const item = cb.closest('.location-item');
      if (item) {
        item.classList.remove('selected');
      }
    });

    await updateConfig({ locations: [] });
    this.updateSelectedCount(0);
    window.showToast?.('Deselected all locations', 'info');
  }

  async addSelectedToFavorites() {
    const config = await getConfig();
    const selectedIds = config.locations || [];
    const currentFavs = config.favoriteLocations || [];

    if (selectedIds.length === 0) {
      window.showToast?.('No locations selected', 'error');
      return;
    }

    const newFavs = [...new Set([...currentFavs, ...selectedIds])];
    const addedCount = newFavs.length - currentFavs.length;

    await updateConfig({ favoriteLocations: newFavs });

    if (addedCount > 0) {
      window.showToast?.(`Added ${addedCount} location(s) to favorites`, 'success');

      // Refresh favorites list if on settings tab
      if (window.renderFavLocations) {
        const locations = await storage.get('locations', {});
        window.renderFavLocations(newFavs, locations);
      }
    } else {
      window.showToast?.('All selected locations already favorited', 'info');
    }
  }

  async clearAllFavorites() {
    const confirmed = confirm('Remove all favorite locations? This cannot be undone.');
    if (!confirmed) return;

    await updateConfig({ favoriteLocations: [] });
    window.showToast?.('Cleared all favorites', 'success');

    // Refresh favorites list
    if (window.renderFavLocations) {
      window.renderFavLocations([], {});
    }

    this.updateFavCount(0);
  }

  updateSelectedCount(count) {
    const countEl = document.getElementById('bulkSelectedCount');
    if (countEl) {
      countEl.textContent = `${count} selected`;
    }
  }

  updateFavCount(count) {
    const countEl = document.getElementById('bulkFavCount');
    if (countEl) {
      countEl.textContent = `${count} favorite${count !== 1 ? 's' : ''}`;
    }
  }

  observeLocationChanges() {
    // Watch for checkbox changes in location list
    const locationList = document.getElementById('locationList');
    if (!locationList) return;

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      this.syncSelectedCount();
    });

    observer.observe(locationList, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Also manually sync on initial load
    this.syncSelectedCount();
  }

  syncSelectedCount() {
    const locationList = document.getElementById('locationList');
    if (!locationList) return;

    const checkedBoxes = locationList.querySelectorAll('input[type="checkbox"]:checked');
    this.updateSelectedCount(checkedBoxes.length);
  }
}

// ─── Location Group Display (by region) ──────────────────────────
function groupLocationsByRegion(locations) {
  const regions = {
    'US-West': [],
    'US-East': [],
    'US-South': [],
    'US-Central': [],
    'Canada': [],
    'Other': []
  };

  const westStates = ['WA', 'OR', 'CA', 'NV', 'AZ', 'UT', 'ID', 'MT', 'WY', 'CO', 'NM', 'AK', 'HI'];
  const eastStates = ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'PA', 'NJ', 'DE', 'MD', 'VA', 'WV', 'NC', 'SC', 'GA', 'FL'];
  const southStates = ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY'];
  const centralStates = ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'IN', 'MI', 'OH'];

  locations.forEach(loc => {
    const state = loc.state || '';
    const country = loc.country || '';

    if (country.toUpperCase() === 'CA' || country.toLowerCase().includes('canada')) {
      regions['Canada'].push(loc);
    } else if (westStates.includes(state.toUpperCase())) {
      regions['US-West'].push(loc);
    } else if (eastStates.includes(state.toUpperCase())) {
      regions['US-East'].push(loc);
    } else if (southStates.includes(state.toUpperCase())) {
      regions['US-South'].push(loc);
    } else if (centralStates.includes(state.toUpperCase())) {
      regions['US-Central'].push(loc);
    } else {
      regions['Other'].push(loc);
    }
  });

  return regions;
}

// ─── Enhanced Region Chips ────────────────────────────────────────
async function enhanceRegionChips() {
  const regionChips = document.querySelectorAll('.region-chip');
  const locations = await storage.get('locations', {});
  const config = await getConfig();
  const currentFavs = config.favoriteLocations || [];

  const grouped = groupLocationsByRegion(Object.values(locations));

  regionChips.forEach(chip => {
    const region = chip.dataset.region;
    const count = grouped[region]?.length || 0;
    const favCount = grouped[region]?.filter(loc => currentFavs.includes(loc.id)).length || 0;

    // Update chip text with count
    if (count > 0) {
      chip.innerHTML = `
        <span class="region-name">${region.replace('US-', '')}</span>
        <span class="region-count">${favCount}/${count}</span>
      `;
      chip.classList.toggle('active', favCount > 0);
      chip.disabled = false;
    } else {
      chip.innerHTML = `<span class="region-name">${region.replace('US-', '')}</span>`;
      chip.disabled = true;
      chip.style.opacity = '0.4';
    }
  });
}

// ─── Initialize Module ────────────────────────────────────────────
export function initLocationSearchUX() {
  console.log('[Location Search UX] Initializing...');

  // Request user location (with permission)
  getUserLocation();

  // Initialize enhanced autocomplete
  const autocomplete = new LocationAutocomplete(
    'favLocationSearch',
    'favLocationDropdown',
    async (locationId) => {
      // Add to favorites when selected
      const config = await getConfig();
      const currentFavs = config.favoriteLocations || [];

      if (!currentFavs.includes(locationId)) {
        const newFavs = [...currentFavs, locationId];
        await updateConfig({ favoriteLocations: newFavs });

        window.showToast?.('Added to favorites', 'success');

        // Refresh favorites list
        if (window.renderFavLocations) {
          const locations = await storage.get('locations', {});
          window.renderFavLocations(newFavs, locations);
        }

        // Refresh region chips
        enhanceRegionChips();
      }
    }
  );

  // Initialize bulk actions
  const bulkActions = new BulkLocationActions();

  // Enhance region chips with counts
  enhanceRegionChips();

  // Re-enhance when locations or favorites change
  window.addEventListener('storage', () => {
    enhanceRegionChips();
    bulkActions.syncSelectedCount();
  });

  console.log('[Location Search UX] Initialized successfully');
}

// Export for global use
export { getUserLocation, calculateDistance, groupLocationsByRegion, enhanceRegionChips };
