// Translations for English and Danish

const translations = {
    en: {
        // Page title
        pageTitle: "Discover Danish Coffee Roasteries",

        // Hero section
        heroTitle: "Denmark’s Roasteries",
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
        visitWebsite: "Visit Website →",
        loadingAddress: "Loading address...",

        // No results
        noRoasteriesFound: "No roasteries found",
        tryAdjusting: "Try adjusting your search or filter",

        // Footer
        footerText: "© 2024 Danish Coffee Roastery Discovery. Crafted with love for coffee.",

        // Regions (full names)
        denmark: "Denmark"
    },
    da: {
        // Page title
        pageTitle: "Opdag Danske Kafferisterier",

        // Hero section
        heroTitle: "Danmarks Risterier",
        heroSubtitle: "Udforsk lokale risterier i hele Danmark",
        searchPlaceholder: "Søg efter risterier, byer eller regioner...",

        // Section titles
        sectionTitle: "Udforsk efter Region",

        // Filter chips
        allRegions: "Alle Regioner",
        nordjylland: "Nordjylland",
        midtjylland: "Midtjylland",
        syddanmark: "Syddanmark",
        sjaelland: "Sjælland",
        hovedstaden: "Hovedstaden",

        // Map legend
        legendMajorCities: "Større byer (København, Odense, Aarhus)",
        legendOtherCities: "Andre byer med risterier",

        // Roastery card
        visitWebsite: "Besøg Hjemmeside →",
        loadingAddress: "Henter adresse...",

        // No results
        noRoasteriesFound: "Ingen risterier fundet",
        tryAdjusting: "Prøv at justere din søgning eller filter",

        // Footer
        footerText: "© 2024 Dansk Kafferisteri Opdagelse. Lavet med kærlighed til kaffe.",

        // Regions (full names)
        denmark: "Danmark"
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
    if (heroTitle) heroTitle.innerHTML = t('heroTitle');

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t('heroSubtitle');

    const searchBox = document.getElementById('searchBox');
    if (searchBox) searchBox.placeholder = t('searchPlaceholder');

    // Section title
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) sectionTitle.textContent = t('sectionTitle');

    // Filter chips
    const chips = document.querySelectorAll('.chip');
    chips[0].textContent = t('allRegions'); // All Regions
    chips[1].textContent = t('nordjylland');
    chips[2].textContent = t('midtjylland');
    chips[3].textContent = t('syddanmark');
    chips[4].textContent = t('sjaelland');
    chips[5].textContent = t('hovedstaden');

    // Map legend
    const legendItems = document.querySelectorAll('.legend-item span:last-child');
    if (legendItems[0]) legendItems[0].textContent = t('legendMajorCities');
    if (legendItems[1]) legendItems[1].textContent = t('legendOtherCities');

    // Footer
    const footerText = document.querySelector('.footer p');
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
