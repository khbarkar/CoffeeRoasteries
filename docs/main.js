import { roasteries } from './list.js';

// City positions as percentage of the map image (x%, y%)
const cityPositions = {
  "Copenhagen": { x: 76, y: 60 },
  "Aarhus": { x: 52, y: 42 },
  "Odense": { x: 50, y: 62 },
  "Vejle": { x: 43, y: 52 },
  "Sønderborg": { x: 47, y: 74 },
  "Herning": { x: 36, y: 46 },
  "Viborg": { x: 40, y: 37 },
  "Ebeltoft": { x: 56, y: 40 },
  "Svendborg": { x: 53, y: 68 },
  "Odsherred": { x: 64, y: 51 },
  "Køge": { x: 72, y: 58 },
  "Vendsyssel": { x: 44, y: 17 },
  "Nørre Snede": { x: 38, y: 49 }
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
  const container = document.getElementById('map-markers');
  if (!container) return;

  // Count roasteries per city
  const cityCounts = {};
  roasteries.forEach(r => {
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
  });

  // Check which cities have starred roasteries
  const cityStarred = {};
  roasteries.forEach(r => {
    if (data.stars.includes(r.name)) {
      cityStarred[r.city] = true;
    }
  });

  container.innerHTML = '';
  for (const [city, pos] of Object.entries(cityPositions)) {
    const count = cityCounts[city] || 0;
    if (count === 0) continue;

    const size = Math.min(10 + count * 2, 28);
    const hasStarred = cityStarred[city];
    const bg = hasStarred ? '#ffc107' : '#1D809F';

    // Dot
    const dot = document.createElement('span');
    dot.className = 'position-absolute rounded-circle d-flex align-items-center justify-content-center';
    dot.title = `${city}: ${count} roaster${count > 1 ? 'ies' : 'y'}`;
    dot.style.cssText = `left:${pos.x}%;top:${pos.y}%;width:${size}px;height:${size}px;background:${bg};transform:translate(-50%,-50%);cursor:default;border:2px solid #fff;font-size:9px;color:#fff;font-weight:700;`;
    if (count > 1) dot.textContent = count;
    container.appendChild(dot);

    // Label
    const label = document.createElement('span');
    label.className = 'position-absolute small fw-semibold text-dark';
    label.style.cssText = `left:${pos.x}%;top:calc(${pos.y}% + ${size / 2 + 4}px);transform:translateX(-50%);font-size:10px;white-space:nowrap;`;
    label.textContent = city;
    container.appendChild(label);
  }
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
