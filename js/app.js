/* ─────────────────────────────────────
   BUKUIN — Application Logic
   ───────────────────────────────────── */

'use strict';

/* ══════════════════════════════════════
   BOOK DATA STORE
══════════════════════════════════════ */
const BOOKS = [
  {
    title:      'Molecular Biology of the Cell',
    category:   'Biological Sciences',
    author:     'Alberts, Bruce et al.',
    price:      127500,
    priceLabel: 'Rp 127.500',
    origLabel:  'Rp 180.000',
    condition:  'badge-new',
    emoji:      '🌿',
    color:      'linear-gradient(135deg,#1A6B3A,#2EA860)',
    tags:       ['biology', 'biological sciences'],
  },
  {
    title:      'Principles of Gene Expression',
    category:   'Genetics',
    author:     'Primrose & Twyman',
    price:      63000,
    priceLabel: 'Rp 63.000',
    origLabel:  'Rp 95.000',
    condition:  'badge-slight',
    emoji:      '🧬',
    color:      'linear-gradient(135deg,#1A2A6B,#2E50AA)',
    tags:       ['biology', 'genetics'],
  },
  {
    title:      'Kalkulus Purcell Edisi 9',
    category:   'Mathematics • SKPB',
    author:     'Purcell & Varberg',
    price:      55000,
    priceLabel: 'Rp 55.000',
    origLabel:  'Rp 80.000',
    condition:  'badge-new',
    emoji:      '📐',
    color:      'linear-gradient(135deg,#6B3A1A,#AA6030)',
    tags:       ['skpb', 'mathematics', 'kalkulus'],
  },
  {
    title:      'Fisika Dasar Halliday',
    category:   'Physics • SKPB',
    author:     'Halliday, Resnick & Walker',
    price:      72000,
    priceLabel: 'Rp 72.000',
    origLabel:  'Rp 110.000',
    condition:  'badge-slight',
    emoji:      '⚡',
    color:      'linear-gradient(135deg,#1A3A6B,#2060CC)',
    tags:       ['skpb', 'physics', 'fisika'],
  },
  {
    title:      'Kimia Dasar Chang',
    category:   'Chemistry • SKPB',
    author:     'Raymond Chang',
    price:      45000,
    priceLabel: 'Rp 45.000',
    origLabel:  'Rp 75.000',
    condition:  'badge-used',
    emoji:      '🧪',
    color:      'linear-gradient(135deg,#6B1A3A,#AA2E60)',
    tags:       ['skpb', 'chemistry', 'kimia'],
  },
  {
    title:      'Teknik Mesin Shigley',
    category:   'Mechanical Engineering',
    author:     'Shigley, Mischke & Budynas',
    price:      98000,
    priceLabel: 'Rp 98.000',
    origLabel:  'Rp 150.000',
    condition:  'badge-new',
    emoji:      '⚙️',
    color:      'linear-gradient(135deg,#3A3A1A,#6A6A30)',
    tags:       ['engineering', 'mechanical', 'teknik mesin'],
  },
];

/* ── Filter chip → predicate ── */
const CHIP_FILTERS = {
  'all results':   () => true,
  'skpb':          b => b.tags.includes('skpb'),
  'biology':       b => b.tags.includes('biology') || b.tags.includes('genetics'),
  'engineering':   b => b.tags.includes('engineering'),
  'like new':      b => b.condition === 'badge-new',
  'under rp 75rb': b => b.price < 75000,
};

/* ══ Navigation State ══ */
let currentScreen   = 'home';
const _history      = [];  // screen history stack for back navigation
let activeChipKey   = 'all results';
let activeSearchVal = '';

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */

function _switchScreen(screen) {
  currentScreen = screen;

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Sync all nav items (sidebar + mobile)
  document.querySelectorAll('[data-screen]').forEach(el => {
    el.classList.toggle('active', el.dataset.screen === screen);
  });

  if (screen === 'search') _renderSearchResults();
}

function goToScreen(screen) {
  if (screen === currentScreen) return;
  _history.push(currentScreen);
  _switchScreen(screen);
}

/* Fixed back: pop history stack instead of hard-coding prevScreen */
function goBack() {
  if (_history.length === 0) { _switchScreen('home'); return; }
  const prev = _history.pop();
  _switchScreen(prev);
}

/* ══════════════════════════════════════
   PRODUCT DETAIL
══════════════════════════════════════ */

function goToProduct(title, category, price, origPrice, badgeClass, emoji) {
  document.getElementById('productTitle').textContent   = title      || 'Book Title';
  document.getElementById('productCat').textContent     = category   || 'Academic';
  document.getElementById('productPriceEl').textContent = price      || 'Rp 99.000';
  document.getElementById('productOrigEl').textContent  = origPrice  || 'Rp 150.000';
  document.getElementById('productEmoji').textContent   = emoji      || '📖';

  _updateDiscountTag(price, origPrice);
  _updateConditionBadge(badgeClass);
  goToScreen('product');
}

function _updateDiscountTag(price, origPrice) {
  const pNum    = parseInt((price     || '').replace(/\D/g, ''));
  const oNum    = parseInt((origPrice || '').replace(/\D/g, ''));
  const discTag = document.getElementById('discountTag');

  if (pNum && oNum && pNum < oNum) {
    discTag.textContent   = `-${Math.round((1 - pNum / oNum) * 100)}% OFF`;
    discTag.style.display = 'block';
  } else {
    discTag.style.display = 'none';
  }
}

function _updateConditionBadge(badgeClass) {
  const map = {
    'badge-new':    { label: 'Like New',      color: '#1A7040' },
    'badge-slight': { label: 'Slightly Used', color: '#8A6600' },
    'badge-used':   { label: 'Used',          color: '#6020A0' },
  };
  const entry   = map[badgeClass] || map['badge-new'];
  const badgeEl = document.getElementById('productBadgeEl');
  const condEl  = document.getElementById('productCondEl');
  badgeEl.className   = 'badge ' + (badgeClass || 'badge-new');
  badgeEl.textContent = entry.label;
  condEl.textContent  = entry.label;
  condEl.style.color  = entry.color;
}

/* ══════════════════════════════════════
   SEARCH RESULTS RENDERER
══════════════════════════════════════ */

function _bookListCardHTML(b) {
  const condLabel = { 'badge-new': 'Like New', 'badge-slight': 'Slightly Used', 'badge-used': 'Used' }[b.condition];
  const args = _encodeArgs(b);
  return `
    <div class="book-list-card" onclick="goToProduct(${args})">
      <div class="list-card-cover" style="background:${b.color}">${b.emoji}</div>
      <div class="list-card-info">
        <div class="badge ${b.condition}">${condLabel}</div>
        <div class="list-card-category">${b.category}</div>
        <div class="list-card-title">${b.title}</div>
        <div class="list-card-author">${b.author}</div>
        <div class="list-card-footer">
          <div class="list-card-price">${b.priceLabel}</div>
          <button class="btn-details" onclick="event.stopPropagation();goToProduct(${args})">Detail →</button>
        </div>
      </div>
    </div>`;
}

function _encodeArgs(b) {
  return [b.title, b.category, b.priceLabel, b.origLabel, b.condition, b.emoji]
    .map(v => `'${String(v).replace(/'/g, "\\'")}'`).join(',');
}

function _renderSearchResults() {
  const chipFn = CHIP_FILTERS[activeChipKey] || CHIP_FILTERS['all results'];
  const query  = activeSearchVal.toLowerCase().trim();

  const results = BOOKS.filter(b => {
    const matchChip   = chipFn(b);
    const matchSearch = !query || [b.title, b.author, b.category, ...b.tags]
      .some(f => f.toLowerCase().includes(query));
    return matchChip && matchSearch;
  });

  document.getElementById('searchResults').innerHTML = results.length
    ? results.map(_bookListCardHTML).join('')
    : `<div class="empty-state">
         <div class="empty-icon">📭</div>
         <div class="empty-title">Buku tidak ditemukan</div>
         <div class="empty-sub">Coba kata kunci atau filter lain.</div>
       </div>`;

  document.getElementById('searchCount').textContent = results.length === BOOKS.length
    ? `Menampilkan ${results.length} buku`
    : `${results.length} buku ditemukan`;

  document.getElementById('searchQuery').textContent =
    query || (activeChipKey === 'all results' ? 'Semua Buku' : activeChipKey);
}

/* ══════════════════════════════════════
   HOME: RENDER BOOK GRID
══════════════════════════════════════ */

function _renderHomeGrid() {
  const html = BOOKS.map(b => {
    const pNum = parseInt(b.priceLabel.replace(/\D/g, ''));
    const oNum = parseInt(b.origLabel.replace(/\D/g, ''));
    const disc = (pNum && oNum && pNum < oNum) ? Math.round((1 - pNum / oNum) * 100) : 0;
    const args = _encodeArgs(b);
    return `
      <div class="book-grid-card" onclick="goToProduct(${args})">
        <div class="grid-card-cover" style="background:${b.color}">
          ${b.emoji}
          ${disc ? `<span class="grid-discount-pill">-${disc}%</span>` : ''}
        </div>
        <div class="grid-card-body">
          <div class="badge ${b.condition}">${{ 'badge-new': 'Like New', 'badge-slight': 'Slightly Used', 'badge-used': 'Used' }[b.condition]}</div>
          <div class="grid-card-category">${b.category}</div>
          <div class="grid-card-title">${b.title}</div>
          <div class="grid-card-author">${b.author}</div>
          <div class="grid-card-footer">
            <div class="grid-card-price">${b.priceLabel}</div>
            <button class="btn-details" onclick="event.stopPropagation();goToProduct(${args})">Detail</button>
          </div>
        </div>
      </div>`;
  }).join('');
  document.getElementById('homeBookGrid').innerHTML = html;
}

/* ══════════════════════════════════════
   SEARCH INTERACTIONS
══════════════════════════════════════ */

function filterChip(el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeChipKey = el.textContent.trim().toLowerCase();
  _renderSearchResults();
}

function filterSearch(val) {
  activeSearchVal = val;
  _renderSearchResults();
}

function clearSearch() {
  activeSearchVal = '';
  document.getElementById('searchInput').value = '';
  _renderSearchResults();
}

/* Header search: navigate to search screen and pre-fill */
function headerSearch(val) {
  if (val.trim()) {
    activeSearchVal = val.trim();
    const inp = document.getElementById('searchInput');
    if (inp) inp.value = activeSearchVal;
    goToScreen('search');
  }
}

function handleHeaderSearchKey(e) {
  if (e.key === 'Enter') headerSearch(e.target.value);
}

/* ══════════════════════════════════════
   SELL FORM INTERACTIONS
══════════════════════════════════════ */

function selectCondition(el) {
  el.closest('.condition-row')
    .querySelectorAll('.condition-opt')
    .forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function selectToggle(el, e) {
  e.stopPropagation();
  el.parentElement
    .querySelectorAll('.condition-opt')
    .forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */

let _toastTimer;

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ══════════════════════════════════════
   CLOCK
══════════════════════════════════════ */

function _tick() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const el = document.getElementById('clockDisplay');
  if (el) el.textContent = timeStr;
}

_tick();
setInterval(_tick, 10_000);

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  _renderHomeGrid();
  _renderSearchResults();
});
