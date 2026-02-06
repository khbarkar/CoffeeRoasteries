# Danish Coffee Roastery Discovery - Public Site

A beautiful, interactive website to discover coffee roasteries across Denmark with a rustic aesthetic featuring orange and blue color tones.

## Features

### Design
- ☕ **Coffee-themed Hero**: Rustic wooden table aesthetic with animated coffee steam
- 🎨 **Color Scheme**: Orange (#e67e22) and Blue (#3498db) complementary colors
- 🏺 **Handmade Feel**: Ceramic-inspired cards and rustic wood textures
- 📱 **Responsive**: Works beautifully on mobile, tablet, and desktop

### Functionality
- 🔍 **Search**: Find roasteries by name, city, or region
- 🗺️ **Interactive Map**: Click regions on the Denmark map to filter roasteries
- 🏷️ **Region Filters**: Quick filter chips for each Danish region
- 📍 **Google Places Integration**: Fetch real addresses, ratings, and contact info

## Setup Instructions

### 1. Basic Setup
The site is ready to use! Simply open `index.html` in a web browser:

```bash
cd public-site
open index.html  # Mac
# or
start index.html # Windows
# or double-click the file
```

### 2. Google Places API Setup (Optional but Recommended)

To enable real-time data from Google Places:

1. **Get an API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Places API" and "Geocoding API"
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add Your API Key**:
   Open `app.js` and find the `initializeGooglePlaces()` function (around line 175).

   Uncomment and replace `YOUR_API_KEY` with your actual key:

   ```javascript
   const script = document.createElement('script');
   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
   script.async = true;
   script.defer = true;
   script.onload = () => {
       const dummyDiv = document.createElement('div');
       placesService = new google.maps.places.PlacesService(dummyDiv);
       geocoder = new google.maps.Geocoder();
   };
   document.head.appendChild(script);
   ```

3. **Uncomment the API Call**:
   In the `simulatePlacesData()` function, uncomment the real Google Places code block.

### 3. Deployment

To deploy this site publicly:

#### GitHub Pages
```bash
git add public-site/
git commit -m "Add public coffee discovery site"
git push origin main
```

Then enable GitHub Pages in repository settings pointing to the `public-site` folder.

#### Netlify (Recommended)
1. Drag and drop the `public-site` folder to [Netlify](https://app.netlify.com/)
2. Your site will be live in seconds!

#### Custom Domain
Upload the contents of `public-site/` to your web server.

## File Structure

```
public-site/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with orange/blue theme
├── app.js              # Main JavaScript functionality
├── roasteries-data.js  # Coffee roastery database
└── README.md           # This file
```

## Customization

### Add More Roasteries
Edit `roasteries-data.js` and add entries to the `roasteriesData` array:

```javascript
{
    name: "New Roastery",
    region: "Hovedstaden",
    city: "Copenhagen",
    website: "https://example.com"
}
```

### Change Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-orange: #e67e22;  /* Main orange */
    --dark-orange: #d35400;      /* Darker shade */
    --primary-blue: #3498db;     /* Main blue */
    --dark-blue: #2c3e50;        /* Darker shade */
}
```

### Modify Map Regions
Edit the SVG paths in `index.html` under `#denmark-map` to adjust region boundaries.

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Tips

1. **Lazy Load Images**: Add roastery images with lazy loading
2. **CDN Hosting**: Host CSS/JS on CDN for faster loading
3. **Compress Assets**: Minify CSS and JS for production
4. **Optimize API Calls**: Cache Google Places responses

## Next Steps

- [ ] Add actual coffee cup image to hero section
- [ ] Implement route directions using Google Maps
- [ ] Add filtering by coffee type (espresso, filter, etc.)
- [ ] Create roastery detail pages
- [ ] Add user reviews and ratings
- [ ] Implement social sharing
- [ ] Add newsletter subscription

## License

MIT License - Feel free to use and modify!

## Support

For issues or questions, check the parent directory's tracker app or create an issue in the repository.

---

**Crafted with ☕ and love for Danish coffee culture**
