import { roasteries } from './list.js';

// City coordinates for Denmark map (approximate SVG positions)
const cityCoords = {
  "Copenhagen": { x: 310, y: 340 },
  "Aarhus": { x: 215, y: 220 },
  "Odense": { x: 215, y: 330 },
  "Vejle": { x: 185, y: 280 },
  "Sønderborg": { x: 190, y: 380 },
  "Herning": { x: 155, y: 230 },
  "Viborg": { x: 170, y: 190 },
  "Ebeltoft": { x: 240, y: 210 },
  "Svendborg": { x: 230, y: 360 },
  "Odsherred": { x: 280, y: 290 },
  "Køge": { x: 300, y: 320 },
  "Vendsyssel": { x: 195, y: 100 },
  "Nørre Snede": { x: 170, y: 255 }
};

async function loadData() {
  try {
    const res = await fetch('comments.json');
    if (!res.ok) return { notes: {}, stars: [] };
    const data = await res.json();
    return { notes: data.notes || {}, stars: data.stars || [] };
  } catch (e) {
    return { notes: {}, stars: [] };
  }
}

function createCard(roastery, comment, starred) {
  const { name, city, website } = roastery;
  const col = document.createElement('div');
  col.className = 'col';

  const card = document.createElement('div');
  card.className = 'card h-100 overflow-hidden';

  // Header - dark bg
  const header = document.createElement('div');
  header.className = 'card-header bg-dark text-white d-flex align-items-center justify-content-between border-0';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'd-flex align-items-center gap-2';

  const title = document.createElement('span');
  title.className = 'fw-semibold small';
  title.textContent = name;
  titleWrap.appendChild(title);

  if (starred) {
    const star = document.createElement('span');
    star.className = 'small';
    star.textContent = '⭐';
    star.title = 'Starred';
    titleWrap.appendChild(star);
  }

  header.appendChild(titleWrap);

  if (website) {
    const link = document.createElement('a');
    link.href = website;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'link-light text-decoration-none';
    link.title = 'Visit website';
    link.innerHTML = '<i class="bi bi-box-arrow-up-right"></i>';
    header.appendChild(link);
  }

  // Body - light bg
  const body = document.createElement('div');
  body.className = 'card-body bg-white';

  const cityEl = document.createElement('div');
  cityEl.className = 'small text-secondary';
  cityEl.innerHTML = '<i class="bi bi-geo-alt text-danger"></i> ' + city;
  body.appendChild(cityEl);

  if (comment) {
    const p = document.createElement('p');
    p.className = 'card-text small text-muted mb-0 mt-2';
    p.textContent = comment;
    body.appendChild(p);
  }

  if (website) {
    const urlEl = document.createElement('a');
    urlEl.href = website;
    urlEl.target = '_blank';
    urlEl.rel = 'noopener noreferrer';
    urlEl.className = 'd-block small link-primary text-decoration-none mt-2';
    urlEl.textContent = website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    body.appendChild(urlEl);
  }

  card.appendChild(header);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function renderAll(data) {
  const container = document.getElementById('roasteries');
  const q = document.getElementById('search')?.value?.toLowerCase?.() || '';
  const sort = document.getElementById('sort')?.value || 'alpha';

  let items = roasteries.map(r => ({
    ...r,
    comment: data.notes[r.name] || '',
    starred: data.stars.includes(r.name)
  }));

  if (q) {
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q) ||
      (i.comment && i.comment.toLowerCase().includes(q))
    );
  }

  if (sort === 'starred') {
    items.sort((a, b) => (b.starred - a.starred) || a.name.localeCompare(b.name));
  } else {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = '';
  items.forEach(i => container.appendChild(createCard(i, i.comment, i.starred)));
}

function renderMap(data) {
  const mapContainer = document.getElementById('denmark-map');
  if (!mapContainer) return;

  const cityCounts = {};
  roasteries.forEach(r => {
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
  });

  const cityStarred = {};
  roasteries.forEach(r => {
    if (data.stars.includes(r.name)) {
      cityStarred[r.city] = true;
    }
  });

  let dots = '';
  for (const [city, coords] of Object.entries(cityCoords)) {
    const count = cityCounts[city] || 0;
    if (count === 0) continue;
    const r = Math.min(4 + count * 1.2, 14);
    const hasStarred = cityStarred[city];
    const fill = hasStarred ? '#ffc107' : '#dc3545';
    dots += `<circle cx="${coords.x}" cy="${coords.y}" r="${r}" fill="${fill}" opacity="0.85">
      <title>${city}: ${count} roaster${count > 1 ? 'ies' : 'y'}</title>
    </circle>`;
    dots += `<text x="${coords.x}" y="${coords.y + r + 14}" text-anchor="middle" fill="#adb5bd" font-size="10" font-family="system-ui,sans-serif">${city}</text>`;
  }

  const denmarkPath = `M 175 60 L 195 55 L 210 70 L 205 90 L 215 100 L 210 120
    L 200 130 L 195 150 L 185 165 L 175 175 L 165 190 L 155 210
    L 145 230 L 140 250 L 135 265 L 140 280 L 150 290 L 160 300
    L 170 315 L 175 330 L 180 345 L 185 360 L 190 375 L 185 390
    L 175 395 L 165 385 L 155 370 L 150 355 L 145 340 L 140 325
    L 130 310 L 125 295 L 120 280 L 115 265 L 120 250 L 125 235
    L 130 220 L 135 205 L 140 190 L 145 175 L 150 160 L 155 145
    L 160 130 L 165 115 L 170 100 L 175 85 Z`;

  const zealandPath = `M 265 275 L 280 265 L 300 270 L 320 280 L 330 300
    L 325 320 L 315 340 L 300 350 L 280 355 L 265 345
    L 255 330 L 250 310 L 255 290 Z`;

  const funenPath = `M 200 310 L 215 305 L 230 315 L 235 335
    L 230 355 L 215 365 L 200 360 L 195 340 L 195 325 Z`;

  const lollandPath = `M 275 370 L 310 365 L 325 375 L 315 385 L 280 385 Z`;
  const bornholmPath = `M 370 280 L 385 275 L 390 290 L 380 300 L 370 295 Z`;

  // Using Bootstrap colors: #495057 for land, #6c757d for stroke
  mapContainer.innerHTML = `
    <svg viewBox="60 30 370 400" xmlns="http://www.w3.org/2000/svg" class="mx-auto d-block w-100" style="max-width:500px">
      <path d="${denmarkPath}" fill="#495057" stroke="#6c757d" stroke-width="1.5" />
      <path d="${zealandPath}" fill="#495057" stroke="#6c757d" stroke-width="1.5" />
      <path d="${funenPath}" fill="#495057" stroke="#6c757d" stroke-width="1.5" />
      <path d="${lollandPath}" fill="#495057" stroke="#6c757d" stroke-width="1.5" />
      <path d="${bornholmPath}" fill="#495057" stroke="#6c757d" stroke-width="1.5" />
      ${dots}
    </svg>
    <div class="d-flex justify-content-center gap-4 mt-3 flex-wrap">
      <span class="d-flex align-items-center gap-1 small text-white-50"><span class="badge bg-danger rounded-circle p-1">&nbsp;</span> Roastery city</span>
      <span class="d-flex align-items-center gap-1 small text-white-50"><span class="badge bg-warning rounded-circle p-1">&nbsp;</span> Has starred roastery</span>
      <span class="small text-white-50 fst-italic">Dot size = number of roasteries</span>
    </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  renderAll(data);
  renderMap(data);

  // Update stats in both locations
  ['stat-total', 'stat-total-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = roasteries.length;
  });
  const starredEl = document.getElementById('stat-starred');
  const notesEl = document.getElementById('stat-notes');
  if (starredEl) starredEl.textContent = data.stars.length;
  if (notesEl) notesEl.textContent = Object.keys(data.notes).length;

  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  [search, sort].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => renderAll(data));
    el.addEventListener('change', () => renderAll(data));
  });

  // Starred stat link — click to filter to starred only
  const starredLink = document.getElementById('stat-starred-link');
  if (starredLink) {
    starredLink.addEventListener('click', (e) => {
      e.preventDefault();
      const sortEl = document.getElementById('sort');
      if (sortEl) {
        sortEl.value = 'starred';
      }
      renderAll(data);
      document.getElementById('roasteries-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
