// Danish Coffee Roastery Discovery - Main App

let currentRegion = 'all';
let searchQuery = '';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    renderRoasteries();
    setupEventListeners();
    setupLanguageSelector();
    initializeGooglePlaces();
    initializeAccessibility();
    loadBlogIndex();
});

// Setup Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchBox');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderRoasteries();
    });

    searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value.toLowerCase();
        renderRoasteries();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value.toLowerCase();
            renderRoasteries();
        }
    });

    // Region filter chips
    document.querySelectorAll('.region-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.region-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentRegion = e.target.dataset.region;
            renderRoasteries();
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
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLanguage(lang);
        });
    });
}

// Render Roasteries
function renderRoasteries() {
    const container = document.getElementById('roastery-list');
    container.innerHTML = '';

    let filtered = roasteriesData;

    if (currentRegion !== 'all') {
        filtered = filtered.filter(r => r.region === currentRegion);
    }

    if (searchQuery) {
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(searchQuery) ||
            (r.city && r.city.toLowerCase().includes(searchQuery)) ||
            (r.region && r.region.toLowerCase().includes(searchQuery))
        );
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 no-results">
                <h3>${t('noRoasteriesFound')}</h3>
                <p>${t('tryAdjusting')}</p>
            </div>
        `;
        return;
    }

    filtered.forEach(roastery => {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-4';
        col.appendChild(createRoasteryCard(roastery));
        container.appendChild(col);
    });

    loadPlacesData(filtered);
}

// Create Roastery Card
function createRoasteryCard(roastery) {
    const card = document.createElement('div');
    card.className = 'card coffee-card roastery-card h-100';
    card.dataset.name = roastery.name;

    const searchQ = encodeURIComponent(`${roastery.name} ${roastery.city || roastery.region || 'Denmark'} coffee roastery`);
    const websiteUrl = roastery.website || `https://www.google.com/search?q=${searchQ}`;

    const starHtml = roastery.starred
        ? '<span class="star-icon" title="Starred">&#9733;</span>'
        : '';

    const commentHtml = roastery.comment
        ? `<p class="roastery-comment">&ldquo;${roastery.comment}&rdquo;</p>`
        : '';

    card.innerHTML = `
        <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">${starHtml} ${roastery.name}</h5>
            </div>
            <p class="roastery-city mb-1">${roastery.city || roastery.region}, <span class="badge badge-region">${roastery.region}</span></p>
            ${commentHtml}
            <div class="mt-auto pt-3">
                <a href="${websiteUrl}" target="_blank" rel="noopener" class="roastery-link place-website-link">
                    ${t('visitWebsite')} &rarr;
                </a>
            </div>
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

async function loadPlacesData(roasteries) {
    if (GOOGLE_API_KEY) {
        initializeGooglePlaces();
    }

    if (!placesScriptPromise) {
        return;
    }

    try {
        await placesScriptPromise;
    } catch (e) {
        console.warn('Google Places failed to load.', e);
        return;
    }

    roasteries.forEach((roastery, index) => {
        setTimeout(() => fetchPlaceData(roastery), index * 140);
    });
}

function fetchPlaceData(roastery) {
    if (!placesService) return;

    const card = document.querySelector(`.roastery-card[data-name="${roastery.name}"]`);
    if (!card) return;

    const query = `${roastery.name} ${roastery.city || roastery.region || 'Denmark'} coffee roastery`;
    const request = {
        query,
        fields: ['place_id', 'name', 'formatted_address']
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || !results.length) return;

        const place = results[0];
        const detailsRequest = {
            placeId: place.place_id,
            fields: ['website']
        };

        placesService.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
            if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                const websiteLink = card.querySelector('.place-website-link');
                if (websiteLink && placeDetails.website) {
                    websiteLink.href = placeDetails.website;
                }
            }
        });
    });
}

// Blog
let blogPosts = [];

async function loadBlogIndex() {
    try {
        const response = await fetch('blog/index.json');
        blogPosts = await response.json();
        renderBlogList();
    } catch (e) {
        console.info('Blog index not loaded:', e.message);
    }
}

function renderBlogList() {
    const container = document.getElementById('blog-list');
    const postContainer = document.getElementById('blog-post');
    container.innerHTML = '';
    container.classList.remove('d-none');
    postContainer.classList.add('d-none');
    postContainer.innerHTML = '';

    blogPosts.forEach(post => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card coffee-card blog-card h-100" data-slug="${post.slug}">
                <div class="card-body d-flex flex-column">
                    <p class="blog-date mb-1">${post.date}</p>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.summary}</p>
                    <span class="roastery-link mt-auto">${t('readMore')} &rarr;</span>
                </div>
            </div>
        `;
        col.querySelector('.blog-card').addEventListener('click', () => loadBlogPost(post.slug));
        container.appendChild(col);
    });
}

async function loadBlogPost(slug) {
    const container = document.getElementById('blog-list');
    const postContainer = document.getElementById('blog-post');

    try {
        const response = await fetch(`blog/${slug}.md`);
        const md = await response.text();
        const html = marked.parse(md);

        container.classList.add('d-none');
        postContainer.classList.remove('d-none');
        postContainer.innerHTML = `
            <a href="#blog" class="back-to-blog d-inline-block mb-4">&larr; ${t('backToBlog')}</a>
            <article>${html}</article>
        `;

        postContainer.querySelector('.back-to-blog').addEventListener('click', (e) => {
            e.preventDefault();
            renderBlogList();
        });

        postContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
        console.warn('Failed to load blog post:', e.message);
    }
}

// Accessibility features
let accessibilityMode = localStorage.getItem('accessibilityMode') || 'normal';

function initializeAccessibility() {
    createAccessibilityMenu();
    applyAccessibilityMode(accessibilityMode);
    setupKeyboardNavigation();
}

function createAccessibilityMenu() {
    const menu = document.createElement('div');
    menu.className = 'accessibility-menu';
    menu.innerHTML = `
        <button class="accessibility-toggle" aria-label="Accessibility Options" title="Accessibility Options">
            &#9855;
        </button>
        <div class="accessibility-options" style="display: none;">
            <h3>Accessibility Options</h3>
            <button class="accessibility-option" data-mode="normal">Normal Mode</button>
            <button class="accessibility-option" data-mode="high-contrast">High Contrast Mode</button>
            <button class="accessibility-option" data-mode="large-text">Large Text Mode</button>
        </div>
    `;

    document.body.appendChild(menu);

    const toggle = menu.querySelector('.accessibility-toggle');
    const options = menu.querySelector('.accessibility-options');

    toggle.addEventListener('click', () => {
        const isVisible = options.style.display !== 'none';
        options.style.display = isVisible ? 'none' : 'block';
    });

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
    document.body.classList.remove('accessibility-high-contrast', 'accessibility-large-text');

    switch (mode) {
        case 'high-contrast':
            document.body.classList.add('accessibility-high-contrast');
            break;
        case 'large-text':
            document.body.classList.add('accessibility-large-text');
            break;
    }
}

function setupKeyboardNavigation() {
    document.querySelectorAll('.region-chip').forEach(chip => {
        chip.setAttribute('tabindex', '0');
    });
}

// Export for potential future use
window.coffeeDiscovery = {
    renderRoasteries,
    roasteriesData,
    regionCities
};
