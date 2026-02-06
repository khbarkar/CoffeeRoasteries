# Danish Coffee Roastery Tracker

A simple web application to track your coffee purchases from 60 Danish coffee roasteries.

## Features

- **60 Danish Roasteries**: Complete list extracted from drypdryp.dk
- **Purchase Tracking**: Check off roasteries you've bought from
- **Espresso Filter**: Mark roasteries that don't sell espresso-suitable coffee
- **Comments**: Add notes about what you bought from each roastery
- **Rating System**: Rate each roastery on quality, price, and service (1-5 stars)
- **SQLite Database**: Real SQLite database running in your browser
- **Export/Import**: Download and upload portable .sqlite database files
- **Search & Filter**: Find roasteries by name or filter by visited status

## How to Deploy to GitHub Pages

### Option 1: Quick Deploy (Recommended)

1. Create a new repository on GitHub (name it something like `coffee-tracker`)
2. Navigate to your local directory:
   ```bash
   cd /Users/kristinb/coffee-roastery-tracker
   ```
3. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Coffee roastery tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/coffee-tracker.git
   git push -u origin main
   ```
4. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/coffee-tracker/`

### Option 2: Using GitHub CLI

```bash
cd /Users/kristinb/coffee-roastery-tracker
gh repo create coffee-tracker --public --source=. --remote=origin --push
gh repo set-default
gh api repos/{owner}/{repo}/pages -X POST -F source[branch]=main
```

## Usage

1. **Mark as Purchased**: Click the green checkbox next to any roastery you've bought from
2. **No Espresso**: Check the yellow box if a roastery doesn't sell espresso coffee
3. **Rate**: Click the stars to rate quality, price, and service (1-5)
4. **Add Comments**: Type notes about what you bought in the text area
5. **Search**: Use the search box to find specific roasteries
6. **Filter**: Check "Show only visited" to see only roasteries you've purchased from
7. **Export Database**: Download your entire database as a `.sqlite` file
8. **Import Database**: Upload a previously exported `.sqlite` file to restore or move your data

## Data Storage

Your data is stored in a **real SQLite database** using SQL.js (SQLite compiled to WebAssembly):

### Browser Storage (Automatic)
- Database is automatically saved to browser's IndexedDB
- Data persists between sessions
- Works offline after first load

### Portable Database Files
- **Export**: Downloads a `.sqlite` file you can keep anywhere
- **Import**: Upload a `.sqlite` file to restore/move your data
- **Transfer**: Move the `.sqlite` file between devices, browsers, or computers
- **Backup**: Keep multiple dated backups of your database

### Migration
- Automatically migrates data from old localStorage format on first run
- Old data is preserved as backup

## Technologies Used

- Pure HTML, CSS, and JavaScript (no frameworks)
- **SQL.js**: SQLite compiled to WebAssembly for real SQL database in browser
- **IndexedDB**: Browser storage for automatic persistence
- Responsive design for mobile and desktop

## Database Schema

```sql
CREATE TABLE roasteries (
    name TEXT PRIMARY KEY,
    purchased INTEGER DEFAULT 0,
    has_espresso INTEGER DEFAULT 0,
    comment TEXT DEFAULT '',
    quality_rating INTEGER DEFAULT 0,
    price_rating INTEGER DEFAULT 0,
    service_rating INTEGER DEFAULT 0
)
```

## List of Roasteries

Als Risteri, Altura, Amokka, Andersen & Maillard, April Coffee Roasters, Buchwalds, Clever Coffee, Coffee Collective, Copenhagen Coffee Lab, Davids Coffee, Delux Kaffe Kompagniet, Den Bæredygtige Bønne, Depanneur, Dynamo Kaffe, Emo Fabrik, Europa Kaffe og Te, Farm Mountain, GarageRisteriet, Hedekaffe, Hipster Brew, Holy Bean, Ideal Kaffe, Impact Roasters, Just Coffee, Kaffeagenterne, Kaffe Clausen, Kaffedepartementet, Kaffe Lars, Kaffelund, Kaffemekka, Kafferist, Kafferisteriet, Kaffevaerk, Kaffe Værkstedet, Kama Kaffe, Kama Lager, Køge Kafferisteri, Kontra Coffee, LA CABRA, La Casa Latina, Lagom Coffee, Mokkahouse, Mols Kafferisteri, Mørk Kaffe, Nordhavn Coffee, Nordic Coffee House, Nord Roastery, Nørre Snede Kafferisteri, Nygaards Kaffe, Odsherreds Kafferisteri, Original Coffee, Prolog Coffee, Risteriet, Roast Coffee, Soze Kaffe og Risteri, Stiller's Coffee, Strandvejsristeriet, Vendia Kaffe, Wingreen Coffee, ZoZ

## License

Free to use and modify for personal use.
