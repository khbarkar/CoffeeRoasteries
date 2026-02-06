// List of all Danish coffee roasteries
const roasteries = [
    "Aekvator kaffe",
    "Als Risteri",
    "Amokka",
    "Andersen & Maillard",
    "April Coffee Roasters",
    "Berry & Bean",
    "Buchwalds",
    "Brændeholm Risteri",
    "Clever Coffee",
    "Coffee Collective",
    "Colombani",
    "Copenhagen Coffee Lab",
    "Den Bæredygtige Bønne",
    "Depanneur",
    "Dynamo Kaffe",
    "Emo Fabrik",
    "Europa Kaffe og Te",
    "Farm Mountain",
    "GarageRisteriet",
    "Hedekaffe",
    "Hipster Brew",
    "Holy Bean",
    "Ideal Kaffe",
    "Impact Roasters",
    "Just Coffee",
    "Kaffeagenterne",
    "Kaffedepartementet",
    "Kaffe Lars",
    "Kafferist",
    "Kaffevaerket",
    "Kaffe Værkstedet",
    "Kama Kaffe",
    "Kama Lager",
    "Kontra Coffee",
    "LA CABRA",
    "Lagom Coffee",
    "Mokkahouse",
    "Mols Kafferisteri",
    "Nordhavn Coffee",
    "Nord Roastery",
    "Nordic Coffee House",
    "Nygaards Kaffe",
    "Odsherreds Kafferisteri",
    "Original Coffee",
    "Prolog Coffee",
    "Risteriet",
    "Roast Coffee",
    "Soze Kaffe og Risteri",
    "Stiller's Coffee",
    "Strandvejsristeriet",
    "Svendborg Kafferisteri",
    "Te & Kaffe specialisten",
    "Te & Kaffe salonen",
    "Vendia Kaffe",
    "Wingreen Coffee",
    "Winthers Kaffe",
    "Køge Kafferisteri",
    "Mørk Kaffe",
    "Nørre Snede Kafferisteri"
];

// Global database instance
let db = null;
let SQL = null;

// Initialize SQL.js and database
async function initDatabase() {
    try {
        // Load SQL.js
        SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        // Try to load existing database from IndexedDB
        const savedDb = await loadDatabaseFromIndexedDB();

        if (savedDb) {
            db = new SQL.Database(savedDb);
            console.log('Loaded existing database from IndexedDB');
        } else {
            // Create new database
            db = new SQL.Database();
            console.log('Created new database');

            // Create schema
            createSchema();

            // Migrate from localStorage if exists
            await migrateFromLocalStorage();
        }

        // Verify schema exists (in case of old database)
        ensureSchema();

        // Save to IndexedDB
        await saveDatabaseToIndexedDB();

        return true;
    } catch (error) {
        console.error('Database initialization error:', error);
        alert('Error initializing database. Please refresh the page.');
        return false;
    }
}

function createSchema() {
    db.run(`
        CREATE TABLE IF NOT EXISTS roasteries (
            name TEXT PRIMARY KEY,
            purchased INTEGER DEFAULT 0,
            has_espresso INTEGER DEFAULT 0,
            comment TEXT DEFAULT '',
            quality_rating INTEGER DEFAULT 0,
            price_rating INTEGER DEFAULT 0,
            service_rating INTEGER DEFAULT 0,
            website TEXT DEFAULT '',
            region TEXT DEFAULT '',
            starred INTEGER DEFAULT 0
        )
    `);

    // Insert all roasteries
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO roasteries (name) VALUES (?)
    `);

    roasteries.forEach(name => {
        stmt.bind([name]);
        stmt.step();
        stmt.reset();
    });

    stmt.free();
}

function ensureSchema() {
    // Check if table exists
    const result = db.exec(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='roasteries'
    `);

    if (result.length === 0) {
        createSchema();
    } else {
        // Migrate old roastery name spellings
        migrateRoasteryNames();

        // Insert any new roasteries from the array
        insertNewRoasteries();
    }
}

function insertNewRoasteries() {
    // Insert all roasteries (will skip existing ones)
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO roasteries (name) VALUES (?)
    `);

    roasteries.forEach(name => {
        stmt.bind([name]);
        stmt.step();
        stmt.reset();
    });

    stmt.free();
}

function migrateRoasteryNames() {
    // Update "akevator kaffe" to "Aekvator kaffe" in existing databases
    try {
        db.run(`
            UPDATE roasteries
            SET name = 'Aekvator kaffe'
            WHERE name = 'akevator kaffe'
        `);
        console.log('Migrated roastery names');
    } catch (error) {
        console.error('Error migrating roastery names:', error);
    }

    // Add website column if it doesn't exist
    try {
        db.run(`
            ALTER TABLE roasteries ADD COLUMN website TEXT DEFAULT ''
        `);
        console.log('Added website column');
    } catch (error) {
        // Column might already exist, ignore error
        if (!error.message.includes('duplicate column')) {
            console.error('Error adding website column:', error);
        }
    }

    // Add region column if it doesn't exist
    try {
        db.run(`
            ALTER TABLE roasteries ADD COLUMN region TEXT DEFAULT ''
        `);
        console.log('Added region column');
    } catch (error) {
        // Column might already exist, ignore error
        if (!error.message.includes('duplicate column')) {
            console.error('Error adding region column:', error);
        }
    }

    // Add starred column if it doesn't exist
    try {
        db.run(`
            ALTER TABLE roasteries ADD COLUMN starred INTEGER DEFAULT 0
        `);
        console.log('Added starred column');
    } catch (error) {
        // Column might already exist, ignore error
        if (!error.message.includes('duplicate column')) {
            console.error('Error adding starred column:', error);
        }
    }
}

// Migrate data from old localStorage format
async function migrateFromLocalStorage() {
    const savedData = localStorage.getItem('roasteriesData');
    if (!savedData) return;

    try {
        const data = JSON.parse(savedData);
        console.log('Migrating data from localStorage...');

        const stmt = db.prepare(`
            INSERT OR REPLACE INTO roasteries
            (name, purchased, has_espresso, comment, quality_rating, price_rating, service_rating)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        Object.keys(data).forEach(name => {
            const roastery = data[name];
            stmt.bind([
                name,
                roastery.purchased ? 1 : 0,
                roastery.hasEspresso ? 1 : 0,
                roastery.comment || '',
                roastery.ratings?.quality || 0,
                roastery.ratings?.price || 0,
                roastery.ratings?.service || 0
            ]);
            stmt.step();
            stmt.reset();
        });

        stmt.free();

        console.log('Migration complete!');
        // Keep localStorage as backup for now
    } catch (error) {
        console.error('Migration error:', error);
    }
}

// IndexedDB functions for persistence
function loadDatabaseFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CoffeeTrackerDB', 1);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['database'], 'readonly');
            const store = transaction.objectStore('database');
            const getRequest = store.get('main');

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };

            getRequest.onerror = () => resolve(null);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('database')) {
                db.createObjectStore('database');
            }
        };
    });
}

function saveDatabaseToIndexedDB() {
    return new Promise((resolve, reject) => {
        const data = db.export();
        const request = indexedDB.open('CoffeeTrackerDB', 1);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            const dbInstance = request.result;
            const transaction = dbInstance.transaction(['database'], 'readwrite');
            const store = transaction.objectStore('database');
            store.put(data, 'main');

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = event.target.result;
            if (!dbInstance.objectStoreNames.contains('database')) {
                dbInstance.createObjectStore('database');
            }
        };
    });
}

// Get roastery data
function getRoastery(name) {
    const result = db.exec(`
        SELECT * FROM roasteries WHERE name = ?
    `, [name]);

    if (result.length === 0 || result[0].values.length === 0) {
        return {
            purchased: false,
            hasEspresso: false,
            comment: '',
            website: '',
            region: '',
            starred: false
        };
    }

    const row = result[0].values[0];
    return {
        purchased: row[1] === 1,
        hasEspresso: row[2] === 1,
        comment: row[3],
        website: row[7] || '',
        region: row[8] || '',
        starred: row[9] === 1
    };
}

// Update roastery data
function updateRoastery(name, field, value) {
    let sql;
    let params;

    switch(field) {
        case 'purchased':
            sql = 'UPDATE roasteries SET purchased = ? WHERE name = ?';
            params = [value ? 1 : 0, name];
            break;
        case 'hasEspresso':
            sql = 'UPDATE roasteries SET has_espresso = ? WHERE name = ?';
            params = [value ? 1 : 0, name];
            break;
        case 'comment':
            sql = 'UPDATE roasteries SET comment = ? WHERE name = ?';
            params = [value, name];
            break;
        case 'website':
            sql = 'UPDATE roasteries SET website = ? WHERE name = ?';
            params = [value, name];
            break;
        case 'region':
            sql = 'UPDATE roasteries SET region = ? WHERE name = ?';
            params = [value, name];
            break;
        case 'starred':
            sql = 'UPDATE roasteries SET starred = ? WHERE name = ?';
            params = [value ? 1 : 0, name];
            break;
    }

    db.run(sql, params);
    saveDatabaseToIndexedDB();
    updateStats();
}

function updateStats() {
    const result = db.exec('SELECT COUNT(*) FROM roasteries WHERE purchased = 1');
    const count = result[0].values[0][0];
    const total = roasteries.length;
    document.getElementById('visitedCount').textContent = `Visited: ${count}/${total}`;
}

function createRoasteryCard(name) {
    const data = getRoastery(name);
    const card = document.createElement('div');
    card.className = 'roastery-card nes-container is-rounded';
    card.dataset.name = name;

    card.innerHTML = `
        <div class="card-header">
            <label class="nes-checkbox checkbox-container">
                <input type="checkbox" class="purchased-check" ${data.purchased ? 'checked' : ''}>
                <span></span>
            </label>
            <h2 class="roastery-name">${name}</h2>
            <button class="star-toggle nes-btn ${data.starred ? 'is-warning' : 'is-disabled'}" aria-label="Toggle favorite">★</button>
        </div>

        <div class="espresso-section">
            <label class="nes-checkbox espresso-label">
                <input type="checkbox" class="espresso-check" ${data.hasEspresso ? 'checked' : ''}>
                <span>No Espresso (skip this roastery)</span>
            </label>
        </div>

        <div class="comment-section">
            <label>What did you buy?</label>
            <textarea class="comment-input nes-textarea" placeholder="Add notes about your purchase...">${data.comment}</textarea>
        </div>

        <div class="website-section">
            <label>Website:</label>
            <input type="text" class="website-input nes-input" placeholder="https://..." value="${data.website}">
        </div>

        <div class="region-section">
            <label>Region/City:</label>
            <input type="text" class="region-input nes-input" placeholder="e.g., Copenhagen, Aarhus..." value="${data.region}">
        </div>
    `;

    return card;
}

function renderRoasteries(filterVisited = false, filterStarred = false, searchTerm = '') {
    const container = document.getElementById('roasteriesList');
    container.innerHTML = '';

    let filteredRoasteries = roasteries;

    // Apply filters
    if (filterVisited) {
        filteredRoasteries = filteredRoasteries.filter(name => {
            const data = getRoastery(name);
            return data.purchased;
        });
    }

    if (filterStarred) {
        filteredRoasteries = filteredRoasteries.filter(name => {
            const data = getRoastery(name);
            return data.starred;
        });
    }

    if (searchTerm) {
        filteredRoasteries = filteredRoasteries.filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    filteredRoasteries.forEach(name => {
        container.appendChild(createRoasteryCard(name));
    });

    // Add event listeners to all cards
    attachEventListeners();
}

function attachEventListeners() {
    // Purchased checkboxes
    document.querySelectorAll('.purchased-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const card = e.target.closest('.roastery-card');
            const name = card.dataset.name;
            updateRoastery(name, 'purchased', e.target.checked);
        });
    });

    // Espresso checkboxes
    document.querySelectorAll('.espresso-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const card = e.target.closest('.roastery-card');
            const name = card.dataset.name;
            updateRoastery(name, 'hasEspresso', e.target.checked);
        });
    });

    // Star toggle
    document.querySelectorAll('.star-toggle').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.roastery-card');
            const name = card.dataset.name;
            const isStarred = e.target.classList.contains('starred');

            // Toggle starred state
            e.target.classList.toggle('starred');
            updateRoastery(name, 'starred', !isStarred);
        });
    });

    // Comments
    document.querySelectorAll('.comment-input').forEach(textarea => {
        textarea.addEventListener('blur', (e) => {
            const card = e.target.closest('.roastery-card');
            const name = card.dataset.name;
            updateRoastery(name, 'comment', e.target.value);
        });
    });

    // Website
    document.querySelectorAll('.website-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const card = e.target.closest('.roastery-card');
            const name = card.dataset.name;
            updateRoastery(name, 'website', e.target.value);
        });
    });

    // Region
    document.querySelectorAll('.region-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const card = e.target.closest('.roastery-card');
            const name = card.dataset.name;
            updateRoastery(name, 'region', e.target.value);
        });
    });
}

// Export database as .sqlite file
function exportDatabase() {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coffee-tracker-${new Date().toISOString().split('T')[0]}.sqlite`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import database from .sqlite file
function importDatabase(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            db = new SQL.Database(data);

            // Verify schema
            ensureSchema();

            // Save to IndexedDB
            await saveDatabaseToIndexedDB();

            // Re-render
            renderRoasteries();
            updateStats();

            alert('Database imported successfully!');
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing database. Please check the file format.');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading state
    document.getElementById('roasteriesList').innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem;">Loading database...</p>';

    // Initialize database
    const success = await initDatabase();

    if (success) {
        renderRoasteries();
        updateStats();

        // Filter checkboxes
        document.getElementById('filterVisited').addEventListener('change', (e) => {
            const filterStarred = document.getElementById('filterStarred').checked;
            const searchTerm = document.getElementById('searchBox').value;
            renderRoasteries(e.target.checked, filterStarred, searchTerm);
        });

        document.getElementById('filterStarred').addEventListener('change', (e) => {
            const filterVisited = document.getElementById('filterVisited').checked;
            const searchTerm = document.getElementById('searchBox').value;
            renderRoasteries(filterVisited, e.target.checked, searchTerm);
        });

        // Search box
        document.getElementById('searchBox').addEventListener('input', (e) => {
            const filterVisited = document.getElementById('filterVisited').checked;
            const filterStarred = document.getElementById('filterStarred').checked;
            renderRoasteries(filterVisited, filterStarred, e.target.value);
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', exportDatabase);

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importDatabase(e.target.files[0]);
            }
        });
    }
});
