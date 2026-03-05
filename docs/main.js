let allRoasteries = [];

/* ================================================
   DATA
   ================================================ */
async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ================================================
   SCROLL-REACTIVE BACKGROUND
   
   Architecture: like a BGP route table — each section
   "advertises" its preferred background color via
   data-bg-color. The IntersectionObserver acts as the
   control plane, and body.style.backgroundColor is 
   the forwarding table. CSS transition handles the
   smooth convergence.
   
   rootMargin '-50% 0% -50% 0%' means the observer
   fires when a section crosses the exact middle of
   the viewport — like a 50% threshold trigger.
   ================================================ */
function initScrollBackground() {
  const sections = document.querySelectorAll('[data-bg-color]');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const color = entry.target.getAttribute('data-bg-color');
        if (color) {
          document.body.style.backgroundColor = color;
        }
      }
    });
  }, {
    // Fire when the section crosses the viewport midpoint
    rootMargin: '-50% 0% -50% 0%'
  });

  sections.forEach(section => observer.observe(section));
}

/* ================================================
   CARD RENDERING
   ================================================ */
function createCupRating(rating, maxCups) {
  maxCups = maxCups || 3;
  let html = '<div class="roastery-card-rating">';
  for (let i = 1; i <= maxCups; i++) {
    if (i <= rating) {
      html += '<span class="cup"><i class="bi bi-cup-hot-fill"></i></span>';
    } else {
      html += '<span class="cup empty"><i class="bi bi-cup-hot"></i></span>';
    }
  }
  html += '</div>';
  return html;
}

function createCard(r) {
  const card = document.createElement('div');
  const isRated = r.rating && r.rating > 0;
  card.className = 'roastery-card' + (r.purchased ? ' visited' : '') + (isRated ? ' rated' : '');

  let headerHtml = `
    <div class="roastery-card-header">
      <div class="roastery-card-title">
        ${r.purchased ? '<span class="roastery-card-check"><i class="bi bi-check-circle-fill"></i></span>' : ''}
        <span class="roastery-card-name">${escapeHtml(r.name)}</span>
      </div>
      ${r.website ? `<a href="${escapeHtml(r.website)}" target="_blank" rel="noopener noreferrer" class="roastery-card-link" title="Visit website"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
    </div>
  `;

  let bodyParts = [];

  // Espresso cup rating
  if (r.purchased || isRated) {
    bodyParts.push(createCupRating(r.rating || 0));
  }

  // Badges
  let badges = '';
  if (r.purchased) {
    badges += '<span class="roastery-card-badge badge-purchased"><i class="bi bi-bag-check-fill"></i> Purchased</span>';
  } else {
    badges += '<span class="roastery-card-badge badge-not-purchased">Not yet</span>';
  }
  bodyParts.push(`<div>${badges}</div>`);

  if (r.region) {
    bodyParts.push(`<div class="roastery-card-city"><i class="bi bi-geo-alt-fill"></i> ${escapeHtml(r.region)}</div>`);
  }

  if (r.comment) {
    const formatted = escapeHtml(r.comment).replace(/\n/g, '<br>');
    bodyParts.push(`<div class="roastery-card-note">${formatted}</div>`);
  }

  if (r.website) {
    const clean = r.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    bodyParts.push(`<a href="${escapeHtml(r.website)}" target="_blank" rel="noopener noreferrer" class="roastery-card-url"><i class="bi bi-link-45deg"></i> ${escapeHtml(clean)}</a>`);
  }

  if (r.no_espresso) {
    bodyParts.push('<div class="roastery-card-skip"><i class="bi bi-x-circle"></i> No espresso</div>');
  }

  card.innerHTML = headerHtml + `<div class="roastery-card-body">${bodyParts.join('')}</div>`;
  return card;
}

/* ================================================
   FILTER / SORT / RENDER
   ================================================ */
function renderAll() {
  const container = document.getElementById('roasteries');
  if (!container) return;

  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const sort = document.getElementById('sort')?.value || 'alpha';
  const filterPurchased = document.getElementById('filterPurchased')?.checked || false;
  const filterRated = document.getElementById('filterRated')?.checked || false;

  let items = [...allRoasteries];

  if (filterPurchased) items = items.filter(i => i.purchased);
  if (filterRated) items = items.filter(i => i.rating && i.rating > 0);

  if (q) {
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.region && i.region.toLowerCase().includes(q)) ||
      (i.comment && i.comment.toLowerCase().includes(q))
    );
  }

  if (sort === 'rated') {
    items.sort((a, b) => ((b.rating || 0) - (a.rating || 0)) || a.name.localeCompare(b.name));
  } else {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = '';
  items.forEach(r => container.appendChild(createCard(r)));

  const counter = document.getElementById('roastery-counter');
  const purchased = allRoasteries.filter(r => r.purchased).length;
  if (counter) {
    counter.textContent = `Showing ${items.length} of ${allRoasteries.length} · ${purchased} purchased`;
  }
}

/* ================================================
   STATS
   ================================================ */
function updateStats() {
  const total = allRoasteries.length;
  const purchased = allRoasteries.filter(r => r.purchased).length;
  const rated = allRoasteries.filter(r => r.rating && r.rating > 0).length;
  const regions = new Set(allRoasteries.filter(r => r.region).map(r => {
    const parts = r.region.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
  }));

  const elTotal = document.getElementById('stat-total-2');
  if (elTotal) elTotal.textContent = total;
  const elPurchased = document.getElementById('stat-purchased');
  if (elPurchased) elPurchased.textContent = purchased;
  const elFavourites = document.getElementById('stat-favourites');
  if (elFavourites) elFavourites.textContent = rated;
  const elRegions = document.getElementById('stat-regions');
  if (elRegions) elRegions.textContent = regions.size;
}

/* ================================================
   NAV / MOBILE / SCROLL
   ================================================ */
function initNav() {
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initMobileMenu() {
  const btn = document.getElementById('nav-more-btn');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-menu-close');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.add('open'));
  close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menu.classList.remove('open');
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ================================================
   BOOT
   ================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  allRoasteries = await loadData();

  renderAll();
  updateStats();

  // Init all systems
  initScrollBackground();
  initNav();
  initMobileMenu();
  initSmoothScroll();

  // Filter/sort controls
  ['search', 'sort', 'filterPurchased', 'filterRated'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', renderAll);
    el.addEventListener('change', renderAll);
  });
});
