// Danish Coffee Roastery Discovery - Main App

let currentRegion = 'all';
let searchQuery = '';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    initializeMap();
    renderRoasteries();
    setupEventListeners();
    setupLanguageSelector();
    initializeGooglePlaces();
    setupScrollDarkening();
    initializeAccessibility();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchBox');
    const searchBtn = document.querySelector('.search-btn');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderRoasteries();
    });

    searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value.toLowerCase();
        renderRoasteries();
    });

    // Enter key for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value.toLowerCase();
            renderRoasteries();
        }
    });

    // Filter chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');

            // Update current region
            currentRegion = e.target.dataset.region;
            renderRoasteries();

            // Update map selection
            updateMapSelection(currentRegion);
        });
    });
}

// Setup Language Selector
function setupLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const lang = btn.dataset.lang;

            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch language
            setLanguage(lang);
        });
    });
}

// Initialize Interactive Map
function initializeMap() {
    const regions = document.querySelectorAll('.region');

    regions.forEach(region => {
        region.addEventListener('click', (e) => {
            const regionName = e.target.dataset.region;

            // Update active region
            regions.forEach(r => r.classList.remove('active'));
            e.target.classList.add('active');

            // Update filter chip
            const chip = document.querySelector(`.chip[data-region="${regionName}"]`);
            if (chip) {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            }

            // Update current region and render
            currentRegion = regionName;
            renderRoasteries();
        });

        // Hover effect
        region.addEventListener('mouseenter', (e) => {
            const regionName = e.target.dataset.region;
            showRegionTooltip(regionName, e);
        });

        region.addEventListener('mouseleave', () => {
            hideRegionTooltip();
        });
    });
}

// Update map selection based on filter
function updateMapSelection(regionName) {
    const regions = document.querySelectorAll('.region');
    regions.forEach(r => r.classList.remove('active'));

    if (regionName !== 'all') {
        const selectedRegion = document.querySelector(`.region[data-region="${regionName}"]`);
        if (selectedRegion) {
            selectedRegion.classList.add('active');
        }
    }
}

// Render Roasteries
function renderRoasteries() {
    const container = document.getElementById('roastery-list');
    container.innerHTML = '';

    // Filter roasteries
    let filtered = roasteriesData;

    // Filter by region
    if (currentRegion !== 'all') {
        filtered = filtered.filter(r => r.region === currentRegion);
    }

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(searchQuery) ||
            (r.city && r.city.toLowerCase().includes(searchQuery)) ||
            (r.region && r.region.toLowerCase().includes(searchQuery))
        );
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    // Render cards
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-dark);">
                <h3>${t('noRoasteriesFound')}</h3>
                <p>${t('tryAdjusting')}</p>
            </div>
        `;
        return;
    }

    filtered.forEach(roastery => {
        const card = createRoasteryCard(roastery);
        container.appendChild(card);
    });

    // Load Google Places details for each roastery
    loadPlacesData(filtered);
}

// Create Roastery Card
function createRoasteryCard(roastery) {
    const card = document.createElement('div');
    card.className = 'roastery-card';
    card.dataset.name = roastery.name;

    const searchQuery = encodeURIComponent(`${roastery.name} ${roastery.city || roastery.region || 'Denmark'} coffee roastery`);
    const defaultWebsite = roastery.website || `https://www.google.com/search?q=${searchQuery}`;

    card.innerHTML = `
        <div class="roastery-header">
            <h3 class="roastery-name">${roastery.name}</h3>
            <p class="roastery-region">${roastery.city || roastery.region}</p>
        </div>
        <div class="roastery-body">
            <div class="roastery-info">
                <div class="info-row">
                    <span class="info-icon">📍</span>
                    <span class="place-address">${t('loadingAddress')}</span>
                </div>
                <div class="info-row" style="display: none;">
                    <span class="info-icon">⭐</span>
                    <span class="place-rating">-</span>
                </div>
                <div class="info-row" style="display: none;">
                    <span class="info-icon">🕒</span>
                    <span class="place-hours">-</span>
                </div>
                <div class="info-row" style="display: none;">
                    <span class="info-icon">💰</span>
                    <span class="place-price">-</span>
                </div>
                <div class="info-row" style="display: none;">
                    <span class="info-icon">📞</span>
                    <span class="place-phone">-</span>
                </div>
            </div>
            <a href="${defaultWebsite}" target="_blank" rel="noopener" class="roastery-link place-website-link">
                ${t('visitWebsite')}
            </a>
        </div>
    `;

    return card;
}

// Google Places API Integration
let placesService;
let geocoder;
let placesScriptPromise = null;
const GOOGLE_API_KEY = window.GOOGLE_PLACES_API_KEY || '';

function initializeGooglePlaces() {
    if (!GOOGLE_API_KEY) {
        console.info('Google Places API key not set. Using simulated data.');
        return;
    }
    if (placesScriptPromise) return;

    placesScriptPromise = new Promise((resolve, reject) => {
        // If already loaded
        if (window.google && google.maps && google.maps.places) {
            const dummyDiv = document.createElement('div');
            placesService = new google.maps.places.PlacesService(dummyDiv);
            geocoder = new google.maps.Geocoder();
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            const dummyDiv = document.createElement('div');
            placesService = new google.maps.places.PlacesService(dummyDiv);
            geocoder = new google.maps.Geocoder();
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Places API'));
        document.head.appendChild(script);
    });
}

// Load Places Data for roasteries
async function loadPlacesData(roasteries) {
    if (GOOGLE_API_KEY) {
        initializeGooglePlaces();
    }

    // If no API key or script load failed, fall back to simulated data
    if (!placesScriptPromise) {
        roasteries.forEach((roastery, index) => {
            setTimeout(() => simulatePlacesData(roastery), index * 120);
        });
        return;
    }

    try {
        await placesScriptPromise;
    } catch (e) {
        console.warn('Google Places failed to load, using simulated data instead.', e);
        roasteries.forEach((roastery, index) => {
            setTimeout(() => simulatePlacesData(roastery), index * 120);
        });
        return;
    }

    roasteries.forEach((roastery, index) => {
        setTimeout(() => fetchPlaceData(roastery), index * 140);
    });
}

function fetchPlaceData(roastery) {
    if (!placesService) {
        simulatePlacesData(roastery);
        return;
    }

    const card = document.querySelector(`.roastery-card[data-name="${roastery.name}"]`);
    if (!card) return;

    const query = `${roastery.name} ${roastery.city || roastery.region || 'Denmark'} coffee roastery`;
    const request = {
        query,
        fields: ['place_id', 'name', 'formatted_address']
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || !results.length) {
            simulatePlacesData(roastery);
            return;
        }

        const place = results[0];
        const detailsRequest = {
            placeId: place.place_id,
            fields: [
                'formatted_address',
                'rating',
                'user_ratings_total',
                'formatted_phone_number',
                'website',
                'opening_hours',
                'price_level',
                'business_status'
            ]
        };

        placesService.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
            if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                updateCardWithPlaceData(card, placeDetails);
            } else {
                simulatePlacesData(roastery);
            }
        });
    });
}

// Simulate Places API data (fallback)
function simulatePlacesData(roastery) {
    const card = document.querySelector(`.roastery-card[data-name="${roastery.name}"]`);
    if (!card) return;

    const addressEl = card.querySelector('.place-address');
    if (addressEl) {
        addressEl.textContent = roastery.city ? `${roastery.city}, Denmark` : 'Denmark';
    }
}

// Update card with Google Places data
function updateCardWithPlaceData(card, placeData) {
    // Update address
    const addressEl = card.querySelector('.place-address');
    if (addressEl && placeData.formatted_address) {
        addressEl.textContent = placeData.formatted_address;
    }

    // Update rating
    const ratingRow = card.querySelector('.info-row:has(.place-rating)');
    const ratingEl = card.querySelector('.place-rating');
    if (ratingEl && placeData.rating) {
        const ratingsText = placeData.user_ratings_total
            ? `${placeData.rating} ⭐ (${placeData.user_ratings_total} reviews)`
            : `${placeData.rating} ⭐`;
        ratingEl.textContent = ratingsText;
        if (ratingRow) ratingRow.style.display = 'flex';
    }

    // Update opening hours
    const hoursRow = card.querySelector('.info-row:has(.place-hours)');
    const hoursEl = card.querySelector('.place-hours');
    if (hoursEl && placeData.opening_hours) {
        const isOpen = placeData.opening_hours.isOpen?.() || placeData.opening_hours.open_now;
        hoursEl.textContent = isOpen ? 'Open now' : 'Closed';
        hoursEl.style.color = isOpen ? 'var(--primary-green, green)' : 'var(--dark-red)';
        if (hoursRow) hoursRow.style.display = 'flex';
    }

    // Update price level
    const priceRow = card.querySelector('.info-row:has(.place-price)');
    const priceEl = card.querySelector('.place-price');
    if (priceEl && placeData.price_level) {
        const priceSymbols = '$'.repeat(placeData.price_level);
        priceEl.textContent = priceSymbols;
        if (priceRow) priceRow.style.display = 'flex';
    }

    // Update phone
    const phoneRow = card.querySelector('.info-row:has(.place-phone)');
    const phoneEl = card.querySelector('.place-phone');
    if (phoneEl && placeData.formatted_phone_number) {
        phoneEl.textContent = placeData.formatted_phone_number;
        if (phoneRow) phoneRow.style.display = 'flex';
    }

    // Update website
    const websiteLink = card.querySelector('.place-website-link');
    if (websiteLink) {
        if (placeData.website) {
            websiteLink.href = placeData.website;
        }
        websiteLink.style.display = 'inline-block';
    }
}

// Tooltip for regions (optional enhancement)
function showRegionTooltip(regionName, event) {
    const roasteriesCount = roasteriesData.filter(r => r.region === regionName).length;
    console.log(`${regionName}: ${roasteriesCount} roasteries`);
}

function hideRegionTooltip() {
    // Hide tooltip if implemented
}

// Scroll-based darkening effect
function setupScrollDarkening() {
    let overlay = document.querySelector('body::before');

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const darkenAmount = Math.min(scrollPercent * 0.4, 0.4); // Max 40% darkening

        // Update CSS custom property for overlay opacity
        document.documentElement.style.setProperty('--scroll-darken', darkenAmount);
    });
}

// Accessibility features
let accessibilityMode = localStorage.getItem('accessibilityMode') || 'normal';

function initializeAccessibility() {
    // Create accessibility menu
    createAccessibilityMenu();

    // Apply saved accessibility mode
    applyAccessibilityMode(accessibilityMode);

    // Keyboard navigation support
    setupKeyboardNavigation();
}

function createAccessibilityMenu() {
    const menu = document.createElement('div');
    menu.className = 'accessibility-menu';
    menu.innerHTML = `
        <button class="accessibility-toggle" aria-label="Accessibility Options" title="Accessibility Options">
            ♿
        </button>
        <div class="accessibility-options" style="display: none;">
            <h3>Accessibility Options</h3>
            <button class="accessibility-option" data-mode="normal">
                Normal Mode
            </button>
            <button class="accessibility-option" data-mode="high-contrast">
                High Contrast Mode
            </button>
            <button class="accessibility-option" data-mode="colorblind">
                Color Blind Friendly
            </button>
            <button class="accessibility-option" data-mode="large-text">
                Large Text Mode
            </button>
        </div>
    `;

    document.body.appendChild(menu);

    // Toggle menu
    const toggle = menu.querySelector('.accessibility-toggle');
    const options = menu.querySelector('.accessibility-options');

    toggle.addEventListener('click', () => {
        const isVisible = options.style.display !== 'none';
        options.style.display = isVisible ? 'none' : 'block';
    });

    // Option buttons
    menu.querySelectorAll('.accessibility-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            applyAccessibilityMode(mode);
            localStorage.setItem('accessibilityMode', mode);
            accessibilityMode = mode;
            options.style.display = 'none';
        });
    });
}

function applyAccessibilityMode(mode) {
    // Remove all accessibility classes
    document.body.classList.remove('accessibility-high-contrast', 'accessibility-colorblind', 'accessibility-large-text');

    // Apply selected mode
    switch(mode) {
        case 'high-contrast':
            document.body.classList.add('accessibility-high-contrast');
            break;
        case 'colorblind':
            document.body.classList.add('accessibility-colorblind');
            break;
        case 'large-text':
            document.body.classList.add('accessibility-large-text');
            break;
    }
}

function setupKeyboardNavigation() {
    // Tab navigation for roastery cards
    document.querySelectorAll('.roastery-card').forEach(card => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = card.querySelector('.roastery-link');
                if (link) link.click();
            }
        });
    });

    // Tab navigation for filter chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.setAttribute('tabindex', '0');
    });
}

// Export for potential future use
window.coffeeDiscovery = {
    renderRoasteries,
    roasteriesData,
    regionCities
};
