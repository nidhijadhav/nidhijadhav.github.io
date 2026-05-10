/* ─── SUPABASE CONFIG ─────────────────────────── */
let activeStamps = [];
const SUPABASE_URL = 'https://wxhiaxogrjphhhuzawjz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aGlheG9ncmpwaGhodXphd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU2MDAwMH0.placeholder';
let sb = null;
try {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  console.warn('Supabase init failed', e);
}

/* ─── DATE STAMP ──────────────────────────────── */
const NOW = new Date();
const dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };
const landDateEl = document.getElementById('land-date');
const loadDtEl = document.getElementById('load-dt');
if (landDateEl) landDateEl.textContent = NOW.toLocaleDateString('en-US', dateOpts);
if (loadDtEl) {
  const h = String(NOW.getHours()).padStart(2, '0');
  const m = String(NOW.getMinutes()).padStart(2, '0');
  loadDtEl.textContent = NOW.toLocaleDateString('en-US', dateOpts) + ' ' + h + ':' + m;
}

/* ─── NAME ELEMENT (used by color snap) ──────── */
const nameEl = document.getElementById('land-name');

/* ─── COLOR SNAP (hard zone, no lerp) ────────── */
/* Colors: red #e8272a, blue #1a5cff, green #1db34a */
const RED   = '#e8272a';
const BLUE  = '#1a5cff';
const GREEN = '#1db34a';

let currentColor = '#000';
let mouseMoved = false;
let rafId = null;
let mouseNX = 0.5;
let mouseNY = 0.5;

function snapColor(nx, ny) {
  if (ny > 0.67) return GREEN;
  if (nx < 0.5)  return BLUE;
  return RED;
}

function colorLoop() {
  const c = mouseMoved ? snapColor(mouseNX, mouseNY) : '#000';
  if (c !== currentColor) {
    currentColor = c;
    if (nameEl) nameEl.style.color = c;
    const availEl = document.getElementById('land-avail');
    if (availEl) availEl.style.color = c;
  }
  rafId = requestAnimationFrame(colorLoop);
}

const landing = document.getElementById('landing');
if (landing) {
  landing.addEventListener('mousemove', (e) => {
    mouseMoved = true;
    const rect = landing.getBoundingClientRect();
    mouseNX = (e.clientX - rect.left) / rect.width;
    mouseNY = (e.clientY - rect.top) / rect.height;
  });
  landing.addEventListener('mouseleave', () => {
    mouseMoved = false;
    mouseNX = 0.5;
    mouseNY = 0.0;
  });
}

rafId = requestAnimationFrame(colorLoop);

/* ─── STATE TRANSITION: LANDING → PORTFOLIO ─── */
const landEnter = document.getElementById('land-enter');
const appHeader = document.getElementById('app-header');
const appPage   = document.getElementById('app-page');
const appLandscape = document.getElementById('app-landscape');
let portfolioActive = false;

function enterPortfolio() {
  if (portfolioActive) return;
  portfolioActive = true;
  landing.classList.add('hidden');
  appHeader.classList.add('visible');
  appPage.classList.add('visible');
  appLandscape.classList.add('visible');
  if (cursor) cursor.classList.add('visible');
  cancelAnimationFrame(rafId);
  initParallax();
  updateCursor();
  loadPostcards();
}

if (landEnter) {
  landEnter.addEventListener('click', enterPortfolio);
}

/* ─── PARALLAX ────────────────────────────────── */
const LAYER_WIDTHS  = [6866, 5200, 3900, 2600];
const LAYER_X_SEC   = [1.0,  0.75, 0.55, 0.35];  /* section-scroll X rates */
const LAYER_X_MOUSE = [0.015, 0.028, 0.042, 0.06]; /* mouse X rates */
const LAYER_Y_MOUSE = [0.008, 0.018, 0.030, 0.044]; /* mouse Y rates */

const layers = [
  document.getElementById('layer-1'),
  document.getElementById('layer-2'),
  document.getElementById('layer-3'),
  document.getElementById('layer-4'),
];

let parallaxX = 0;
let mouseRawX = window.innerWidth  / 2;
let mouseRawY = window.innerHeight / 2;

document.addEventListener('mousemove', function(e) {
  mouseRawX = e.clientX;
  mouseRawY = e.clientY;
});

function initParallax() {
  layers.forEach(function(el, i) {
    if (el) el.style.width = LAYER_WIDTHS[i] + 'px';
  });
}

/* Driven by section navigation — updates parallaxX only, RAF loop applies it */
function setParallaxFromSection(sectionIdx, totalSections) {
  const maxScroll = (totalSections - 1) * window.innerWidth;
  const scrollFrac = (sectionIdx * window.innerWidth) / maxScroll || 0;
  const maxTravel  = LAYER_WIDTHS[0] - window.innerWidth;
  parallaxX = scrollFrac * maxTravel;
}

/* Single RAF loop — background layers only, content never touched */
(function bgParallaxLoop() {
  if (portfolioActive) {
    const dx = mouseRawX - window.innerWidth  / 2;
    const dy = mouseRawY - window.innerHeight / 2;
    layers.forEach(function(el, i) {
      if (!el) return;
      const tx = (-parallaxX * LAYER_X_SEC[i]) + (-dx * LAYER_X_MOUSE[i]);
      const ty = -dy * LAYER_Y_MOUSE[i];
      el.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px)';
    });
  }
  requestAnimationFrame(bgParallaxLoop);
}());


/* ─── NAV & SECTION SCROLL ────────────────────── */
const pageContent = document.getElementById('page-content');
const navItems = document.querySelectorAll('.nav-item');
const pageSectionLabel = document.getElementById('page-section-label');
const cursor = document.getElementById('cursor');

const NAV_QUOTES = [
  '"You are the master of your fate, the captain of your soul — but life is coming from you, not at you." - Invictus',
  '"We are the sum of all the moments of our lives." — Thomas Wolfe',
  '"The object of art is to give life a shape." — William Shakespeare',
  '"A writer only begins a book. A reader finishes it." — Samuel Johnson',
  '"To photograph is to appropriate the thing photographed." — Susan Sontag',
  '"Without music, life would be a mistake." — Nietzsche',
  '"Travel changes you. As you move through this life and this world you change things slightly, you leave marks behind." — Anthony Bourdain',
  '"I am still here."',
  ''
];

let currentSectionIdx = 0;

function getNavItemLeft(item) {
  const rect = item.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

function updateCursor() {
  const activeItem = document.querySelector('.nav-item.active');
  if (!activeItem || !cursor) return;
  const cx = getNavItemLeft(activeItem);
  cursor.style.left = cx + 'px';
}

const sectionsTrack = document.getElementById('sections-track');

function slideTo(idx) {
  if (!sectionsTrack) return;
  sectionsTrack.style.transform = 'translateX(' + (-idx * window.innerWidth) + 'px)';
}

function goToSection(idx) {
  const sections = document.querySelectorAll('.contain');
  if (idx === 999) {
    portfolioActive = false;
    landing.classList.remove('hidden');
    appHeader.classList.remove('visible');
    appPage.classList.remove('visible');
    appLandscape.classList.remove('visible');
    if (cursor) cursor.classList.remove('visible');
    rafId = requestAnimationFrame(colorLoop);
    return;
  }
  if (idx < 0 || idx >= sections.length) return;
  currentSectionIdx = idx;

  slideTo(idx);

  navItems.forEach(ni => ni.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-idx="' + idx + '"]');
  if (activeNav) {
    activeNav.classList.add('active');
    updateCursor();
  }

  if (pageSectionLabel) pageSectionLabel.textContent = NAV_QUOTES[idx] || '00';
  setParallaxFromSection(idx, sections.length);
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const idx = parseInt(item.dataset.idx, 10);
    goToSection(idx);
  });
});

/* Keyboard navigation */
document.addEventListener('keydown', (e) => {
  if (!portfolioActive) return;
  if (e.key === 'ArrowRight') goToSection(currentSectionIdx + 1);
  if (e.key === 'ArrowLeft')  goToSection(currentSectionIdx - 1);
});

/* Re-snap on resize so the visible section stays aligned */
window.addEventListener('resize', () => {
  if (portfolioActive) slideTo(currentSectionIdx);
});


/* ─── POSTCARD CANVAS ─────────────────────────── */
const pcCanvas  = document.getElementById('postcard-canvas');
const pcName    = document.getElementById('pc-name');
const pcMessage = document.getElementById('pc-message');
const pcSend    = document.getElementById('pc-send');

function drawPostcard(canvas, name, message) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  /* background */
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, W, H);

  /* border */
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, W - 8, H - 8);

  /* dividing line */
  ctx.beginPath();
  ctx.moveTo(W / 2, 20);
  ctx.lineTo(W / 2, H - 20);
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* stamp box */
  ctx.strokeStyle = '#e8272a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(W - 90, 20, 70, 55);
  ctx.fillStyle = '#e8272a';
  ctx.font = 'bold 9px HelveticaNeue, sans-serif';
  ctx.fillText('POSTCARD', W - 86, 35);

  /* user stamps */
  ctx.font = 'bold 20px HelveticaNeue, sans-serif';
  activeStamps.forEach(function(s) {
    ctx.fillStyle = '#e8272a';
    ctx.fillText(s.symbol, s.x, s.y);
  });

  /* header */
  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px HelveticaNeue, sans-serif';
  ctx.fillText('NIDHI JADHAV', 18, 34);

  /* date */
  const dateStr = NOW.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  ctx.font = '10px HelveticaNeue, sans-serif';
  ctx.fillStyle = '#555';
  ctx.fillText(dateStr, 18, 50);

  /* message text — left half */
  ctx.fillStyle = '#000';
  ctx.font = '11px HelveticaNeue, sans-serif';
  const maxW = W / 2 - 30;
  const words = (message || '').split(' ');
  let line = '';
  let y = 80;
  for (let word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, 18, y);
      line = word;
      y += 18;
      if (y > H - 30) break;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, 18, y);

  /* from: name — right half */
  ctx.font = '10px HelveticaNeue, sans-serif';
  ctx.fillStyle = '#333';
  ctx.fillText('From:', W / 2 + 14, H - 50);
  ctx.font = 'bold 12px HelveticaNeue, sans-serif';
  ctx.fillStyle = '#000';
  ctx.fillText(name || 'Anonymous', W / 2 + 14, H - 34);
}

/* Live preview as user types */
function updatePreview() {
  drawPostcard(
    pcCanvas,
    pcName ? pcName.value : '',
    pcMessage ? pcMessage.value : ''
  );
}

if (pcName)    pcName.addEventListener('input', updatePreview);
if (pcMessage) pcMessage.addEventListener('input', updatePreview);
document.fonts.ready.then(() => updatePreview());


/* ─── POSTCARD SEND & WALL ────────────────────── */
async function sendPostcard() {
  if (!pcSend) return;
  const name = (pcName ? pcName.value.trim() : '') || 'Anonymous';
  const message = (pcMessage ? pcMessage.value.trim() : '');
  if (!message) return;

  pcSend.disabled = true;
  pcSend.textContent = 'Sending…';

  /* Render to data URL */
  const offCanvas = document.createElement('canvas');
  offCanvas.width = 400;
  offCanvas.height = 250;
  drawPostcard(offCanvas, name, message);
  const imageData = offCanvas.toDataURL('image/png');

  if (sb) {
    try {
      const { error } = await sb.from('postcards').insert({
        sender_name: name,
        message: message,
        image_data: imageData,
        created_at: new Date().toISOString(),
      });
      if (error) console.warn('Supabase insert error', error);
    } catch (err) {
      console.warn('Supabase error', err);
    }
  }

  /* Add to local wall immediately */
  appendPostcardToWall({ sender_name: name, message, image_data: imageData });

  pcSend.disabled = false;
  pcSend.textContent = 'SEND POSTCARD →';
  if (pcName)    pcName.value = '';
  if (pcMessage) pcMessage.value = '';
  activeStamps = [];
  updatePreview();
}

function appendPostcardToWall(card) {
  const wall = document.getElementById('postcard-wall');
  if (!wall) return;
  const flipCard = document.createElement('div');
  flipCard.className = 'flip-card';
  const inner = document.createElement('div');
  inner.className = 'flip-card-inner';
  const front = document.createElement('div');
  front.className = 'flip-card-front';
  const back = document.createElement('div');
  back.className = 'flip-card-back';
  const backMsg = document.createElement('div');
  backMsg.className = 'flip-back-msg';
  backMsg.textContent = card.message;
  const backFrom = document.createElement('div');
  backFrom.className = 'flip-back-from';
  backFrom.textContent = '— ' + card.sender_name;
  back.appendChild(backMsg);
  back.appendChild(backFrom);
  const img = new Image();
  img.style.cssText = 'width:100%;height:100%;display:block;object-fit:cover;';
  img.onload = function() { front.appendChild(img); };
  img.src = card.image_data;
  inner.appendChild(front);
  inner.appendChild(back);
  flipCard.appendChild(inner);
  flipCard.addEventListener('click', function() { flipCard.classList.toggle('flipped'); });
  wall.prepend(flipCard);
}

async function loadPostcards() {
  if (!sb) return;
  try {
    const { data, error } = await sb
      .from('postcards')
      .select('sender_name, message, image_data, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) { console.warn('Supabase fetch error', error); return; }
    if (data) data.forEach(card => appendPostcardToWall(card));
  } catch (err) {
    console.warn('Supabase fetch error', err);
  }
}

if (pcSend) pcSend.addEventListener('click', sendPostcard);

/* ─── STAMP BUTTONS ────────────────────────────── */
document.querySelectorAll('.pc-stamp-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (!pcCanvas) return;
    const sym = btn.dataset.symbol;
    const x = 16 + Math.random() * (pcCanvas.width / 2 - 36);
    const y = 60 + Math.random() * (pcCanvas.height - 80);
    activeStamps.push({ symbol: sym, x: x, y: y });
    updatePreview();
  });
});

/* ─── FILM ROW LINKED SCROLL ──────────────────── */
const filmRow1 = document.getElementById('film-row-1');
const filmRow2 = document.getElementById('film-row-2');
if (filmRow1 && filmRow2) {
  var _syncScroll = false;
  filmRow1.addEventListener('scroll', function() {
    if (_syncScroll) return;
    _syncScroll = true;
    filmRow2.scrollLeft = filmRow1.scrollLeft;
    _syncScroll = false;
  });
  filmRow2.addEventListener('scroll', function() {
    if (_syncScroll) return;
    _syncScroll = true;
    filmRow1.scrollLeft = filmRow2.scrollLeft;
    _syncScroll = false;
  });
}

/* ─── PHOTO COLUMN EXPAND ─────────────────────── */
document.querySelectorAll('.photo-col').forEach(function(col) {
  col.addEventListener('click', function() {
    var wasOpen = col.classList.contains('expanded');
    document.querySelectorAll('.photo-col.expanded').forEach(function(el) { el.classList.remove('expanded'); });
    if (!wasOpen) col.classList.add('expanded');
  });
});

/* ─── EXPAND / COLLAPSE ───────────────────────── */
function initExpandItems() {
  document.querySelectorAll('.expand-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.expand-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.expand-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

initExpandItems();

/* ─── ENTRY ITEM EXPAND (CV) ─────────────────── */
document.querySelectorAll('.entry-header').forEach(function(header) {
  header.addEventListener('click', function() {
    var item = header.closest('.entry-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.entry-item.open').forEach(function(el) { el.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});

