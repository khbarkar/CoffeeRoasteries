// Translations for English and Danish

const translations = {
    en: {
        // Page title
        pageTitle: "Discover Danish Coffee Roasteries",

        // Hero section
        heroTitle: "Denmark's Roasteries",
        heroSubtitle: "Explore local roasteries across Denmark",
        searchPlaceholder: "Search for roasteries, cities, or regions...",

        // Section titles
        sectionTitle: "Explore by Region",

        // Filter chips
        allRegions: "All Regions",
        nordjylland: "North Jutland",
        midtjylland: "Central Jutland",
        syddanmark: "Southern Denmark",
        sjaelland: "Zealand",
        hovedstaden: "Capital Region",

        // Map legend
        legendMajorCities: "Major cities (Copenhagen, Odense, Aarhus)",
        legendOtherCities: "Other cities with roasteries",

        // Roastery card
        visitWebsite: "Visit Website",
        loadingAddress: "Loading address...",

        // No results
        noRoasteriesFound: "No roasteries found",
        tryAdjusting: "Try adjusting your search or filter",

        // Footer
        footerText: "\u00a9 2024 Danish Coffee Roastery Discovery. Crafted with love for coffee.",

        // Regions (full names)
        denmark: "Denmark",

        // Blog
        blogTitle: "From the Blog",
        readMore: "Read more",
        backToBlog: "Back to all posts",

        // Stats
        insightsLabel: "Insights",
        insightsTitle: "Data-driven stories from Danish coffee",
        insightsLede: "Quick snapshots that pair with the directory below\u2014kept concise so you stay in flow.",

        // Nav
        navExplore: "Explore",
        navInsights: "Insights",
        navBlog: "Blog"
    },
    da: {
        // Page title
        pageTitle: "Opdag Danske Kafferisterier",

        // Hero section
        heroTitle: "Danmarks Risterier",
        heroSubtitle: "Udforsk lokale risterier i hele Danmark",
        searchPlaceholder: "S\u00f8g efter risterier, byer eller regioner...",

        // Section titles
        sectionTitle: "Udforsk efter Region",

        // Filter chips
        allRegions: "Alle Regioner",
        nordjylland: "Nordjylland",
        midtjylland: "Midtjylland",
        syddanmark: "Syddanmark",
        sjaelland: "Sj\u00e6lland",
        hovedstaden: "Hovedstaden",

        // Map legend
        legendMajorCities: "St\u00f8rre byer (K\u00f8benhavn, Odense, Aarhus)",
        legendOtherCities: "Andre byer med risterier",

        // Roastery card
        visitWebsite: "Bes\u00f8g Hjemmeside",
        loadingAddress: "Henter adresse...",

        // No results
        noRoasteriesFound: "Ingen risterier fundet",
        tryAdjusting: "Pr\u00f8v at justere din s\u00f8gning eller filter",

        // Footer
        footerText: "\u00a9 2024 Dansk Kafferisteri Opdagelse. Lavet med k\u00e6rlighed til kaffe.",

        // Regions (full names)
        denmark: "Danmark",

        // Blog
        blogTitle: "Fra Bloggen",
        readMore: "L\u00e6s mere",
        backToBlog: "Tilbage til alle indl\u00e6g",

        // Stats
        insightsLabel: "Indsigter",
        insightsTitle: "Datadrevne historier fra dansk kaffe",
        insightsLede: "Hurtige \u00f8jebliksbilleder der passer til kataloget nedenfor\u2014holdt kort s\u00e5 du forbliver i flow.",

        // Nav
        navExplore: "Udforsk",
        navInsights: "Indsigter",
        navBlog: "Blog"
    }
};

// Current language (default: English)
let currentLanguage = 'en';

// Get translation
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Switch language
function setLanguage(lang) {
    currentLanguage = lang;
    updatePageLanguage();

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update page title
    document.title = t('pageTitle');

    // Store preference
    localStorage.setItem('preferredLanguage', lang);
}

// Update all text on the page
function updatePageLanguage() {
    // Hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = t('heroTitle');

    const searchBox = document.getElementById('searchBox');
    if (searchBox) searchBox.placeholder = t('searchPlaceholder');

    // Section title
    const sectionTitle = document.querySelector('#explore .section-title');
    if (sectionTitle) sectionTitle.textContent = t('sectionTitle');

    // Filter chips
    const chips = document.querySelectorAll('.region-chip');
    if (chips.length >= 6) {
        chips[0].textContent = t('allRegions');
        chips[1].textContent = t('nordjylland');
        chips[2].textContent = t('midtjylland');
        chips[3].textContent = t('syddanmark');
        chips[4].textContent = t('sjaelland');
        chips[5].textContent = t('hovedstaden');
    }

    // Nav links
    const navExplore = document.querySelector('a[href="#explore"]');
    if (navExplore) navExplore.textContent = t('navExplore');
    const navInsights = document.querySelector('a[href="#coffee-stats"]');
    if (navInsights) navInsights.textContent = t('navInsights');
    const navBlog = document.querySelector('a[href="#blog"]');
    if (navBlog) navBlog.textContent = t('navBlog');

    // Stats section
    const insightsLabel = document.querySelector('.eyebrow-label');
    if (insightsLabel) insightsLabel.textContent = t('insightsLabel');
    const insightsTitle = document.querySelector('.stats-section-title');
    if (insightsTitle) insightsTitle.textContent = t('insightsTitle');
    const insightsLede = document.querySelector('.stats-lede');
    if (insightsLede) insightsLede.textContent = t('insightsLede');

    // Blog section title
    const blogTitle = document.querySelector('#blog .section-title');
    if (blogTitle) blogTitle.textContent = t('blogTitle');

    // Footer
    const footerText = document.querySelector('footer p');
    if (footerText) footerText.textContent = t('footerText');

    // Re-render roasteries to update card text
    if (typeof renderRoasteries === 'function') {
        renderRoasteries();
    }
}

// Initialize language on page load
function initializeLanguage() {
    // Check for stored preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && (storedLang === 'en' || storedLang === 'da')) {
        currentLanguage = storedLang;
    }

    // Update page
    updatePageLanguage();

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
}
