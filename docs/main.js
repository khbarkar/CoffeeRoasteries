import { roasteries } from './list.js';

const STORAGE_KEY = 'roastery_stars_v1';

function loadStars() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveStars(stars) { localStorage.setItem(STORAGE_KEY, JSON.stringify(stars)); }

async function loadComments() {
  try {
    const res = await fetch('comments.json');
    if (!res.ok) return {};
    const data = await res.json();
    return data.notes || {};
  } catch (e) {
    return {};
  }
}

// Render helpers
function createCard(name, comment, starred, stars, saveCb) {
  const col = document.createElement('div');
  col.className = 'col';

  const card = document.createElement('div');
  card.className = 'card h-100';

  const header = document.createElement('div');
  header.className = 'card-header';

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = name;

  const btn = document.createElement('button');
  btn.className = 'star-btn';
  btn.title = starred ? 'Unstar' : 'Star';
  btn.setAttribute('aria-pressed', starred ? 'true' : 'false');
  btn.innerHTML = starred ? '⭐' : '☆';
  btn.addEventListener('click', () => {
    stars[name] = !stars[name];
    saveCb(stars);
    btn.innerHTML = stars[name] ? '⭐' : '☆';
    btn.title = stars[name] ? 'Unstar' : 'Star';
    btn.setAttribute('aria-pressed', stars[name] ? 'true' : 'false');
  });

  header.appendChild(title);
  header.appendChild(btn);

  const body = document.createElement('div');
  body.className = 'card-body';
  const p = document.createElement('p');
  p.className = 'card-text small text-muted mb-0';
  p.textContent = comment || 'No comment (edit comments.json to add notes)';
  body.appendChild(p);

  card.appendChild(header);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function renderAll(comments, stars) {
  const container = document.getElementById('roasteries');
  const q = document.getElementById('search')?.value?.toLowerCase?.() || '';
  const sort = document.getElementById('sort')?.value || 'alpha';

  let items = roasteries.map(name => ({ name, comment: comments[name] || '' , starred: !!stars[name] }));

  if (q) {
    items = items.filter(i => i.name.toLowerCase().includes(q) || (i.comment && i.comment.toLowerCase().includes(q)));
  }

  if (sort === 'starred') {
    items.sort((a,b) => (b.starred - a.starred) || a.name.localeCompare(b.name));
  } else {
    items.sort((a,b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = '';
  items.forEach(i => container.appendChild(createCard(i.name, i.comment, i.starred, stars, saveStars)));
}

document.addEventListener('DOMContentLoaded', async () => {
  const stars = loadStars();
  const comments = await loadComments();
  renderAll(comments, stars);

  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  [search, sort].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => renderAll(comments, stars));
    el.addEventListener('change', () => renderAll(comments, stars));
  });
});
