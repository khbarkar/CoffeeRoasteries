let allRoasteries = [];

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

function createCard(r) {
  const card = document.createElement('div');
  card.className = 'roastery-card' + (r.purchased ? ' visited' : '') + (r.starred ? ' starred' : '');

  let headerHtml = `
    <div class="roastery-card-header">
      <div class="roastery-card-title">
        ${r.purchased ? '<span class="roastery-card-check"><i class="bi bi-check-circle-fill"></i></span>' : ''}
        <span class="roastery-card-name">${escapeHtml(r.name)}</span>
        ${r.starred ? '<span class="roastery-card-star"><i class="bi bi-star-fill"></i></span>' : ''}
      </div>
      ${r.website ? `<a href="${escapeHtml(r.website)}" target="_blank" rel="noopener noreferrer" class="roastery-card-link" title="Visit website"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
    </div>
  `;

  let bodyParts = [];

  // Badges
  let badges = '';
  if (r.purchased) {
    badges += '<span class="roastery-card-badge badge-purchased"><i class="bi bi-bag-check-fill"></i> Purchased</span>';
  } else {
    badges += '<span class="roastery-card-badge badge-not-purchased">Not yet</span>';
  }
  if (r.starred) {
    badges += '<span class="roastery-card-badge badge-starred"><i class="bi bi-star-fill"></i> Favourite</span>';
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

  if (r.has_espresso) {
    bodyParts.push('<div class="roastery-card-skip"><i class="bi bi-x-circle"></i> No espresso</div>');
  }

  card.innerHTML = headerHtml + `<div class="roastery-card-body">${bodyParts.join('')}</div>`;
  return card;
}

function renderAll() {
  const container = document.getElementById('roasteries');
  if (!container) return;

  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const sort = document.getElementById('sort')?.value || 'alpha';
  const filterPurchased = document.getElementById('filterPurchased')?.checked || false;
  const filterStarred = document.getElementById('filterStarred')?.checked || false;

  let items = [...allRoasteries];

  if (filterPurchased) items = items.filter(i => i.purchased);
  if (filterStarred) items = items.filter(i => i.starred);

  if (q) {
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.region && i.region.toLowerCase().includes(q)) ||
      (i.comment && i.comment.toLowerCase().includes(q))
    );
  }

  if (sort === 'starred') {
    items.sort((a, b) => (b.starred - a.starred) || a.name.localeCompare(b.name));
  } else {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  container.innerHTML = '';
  items.forEach(r => container.appendChild(createCard(r)));

  // Update counter
  const counter = document.getElementById('roastery-counter');
  const purchased = allRoasteries.filter(r => r.purchased).length;
  if (counter) {
    counter.textContent = `Showing ${items.length} of ${allRoasteries.length} \u00B7 ${purchased} purchased`;
  }
}

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

document.addEventListener('DOMContentLoaded', async () => {
  allRoasteries = await loadData();

  renderAll();

  initNav();
  initMobileMenu();
  initSmoothScroll();

  // Update counts
  const el = document.getElementById('stat-total-2');
  if (el) el.textContent = allRoasteries.length;

  // All filter/sort controls
  ['search', 'sort', 'filterPurchased', 'filterStarred'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', renderAll);
    el.addEventListener('change', renderAll);
  });
});
