/* ─── MOBILE DETECTION (Rietveld pattern) ──────── */
function isMobile() {
  var ua = false;
  (function(e) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4))) {
      ua = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return window.innerWidth <= 780 || ua;
}

var appEl = document.getElementById('app');

function checkMobile() {
  var mobile = isMobile();
  appEl.classList.toggle('mobile', mobile);
}

function updateMobilePadding() {
  // no-op: header is in normal document flow on mobile
}

checkMobile();
updateMobilePadding();

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

/* ─── LANDING COLOR CONSTANTS ─────────────────── */
const RED   = '#e8272a';
const BLUE  = '#1a5cff';
const GREEN = '#1db34a';

let rafId = null;

const landing = document.getElementById('landing');

/* ─── ENTER BUTTON FLASH ──────────────────────── */
const flashColors = ['#e8272a', '#1a5cff', '#1db34a'];
let flashInterval = null;
let flashIdx = 0;

function startFlash() {
  if (flashInterval) return;
  flashInterval = setInterval(() => {
    flashIdx = (flashIdx + 1) % flashColors.length;
    if (landing) landing.style.backgroundColor = flashColors[flashIdx];
  }, 120);
}

function stopFlash() {
  clearInterval(flashInterval);
  flashInterval = null;
  if (landing) landing.style.backgroundColor = '#ffffff';
}

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
  setQuote(0);
  loadPostcards();
}

if (landEnter) {
  landEnter.addEventListener('click', enterPortfolio);
  landEnter.addEventListener('mouseenter', startFlash);
  landEnter.addEventListener('mouseleave', stopFlash);
  landEnter.addEventListener('touchstart', startFlash, { passive: true });
  landEnter.addEventListener('touchend', stopFlash);
  landEnter.addEventListener('touchcancel', stopFlash);
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

/* Single RAF loop — background layers only, content never touched, skipped on mobile */
(function bgParallaxLoop() {
  if (portfolioActive && !isMobile()) {
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
const cursor = document.getElementById('cursor');

const NAV_QUOTES = [
  '"I am the master of my fate, I am the captain of my soul." — Invictus',
  'Let the beauty of what you love be what you do." — Rumi',
  'Every act of creation is first an act of destruction." — Picasso',
  '"Words are loaded pistols." — Jean-Paul Sartre',
  '"In the struggle between yourself and the world, back the world." — Franz Kafka',
  '"Without music, life would be a mistake." — Nietzsche',
  '"I understood that the world is not a problem to be solved but an adventure to be had." — Anthony Bourdain',
  '"Life is coming from you, not at you.',
  ''
];

let currentSectionIdx = 0;

function setQuote(idx) {
  const text = NAV_QUOTES[idx] || '';
  const track = document.getElementById('quote-track');
  if (!track) return;

  const separator = ' · ';
  const unit = text + separator;

  // Measure single unit width
  const tempSpan = document.createElement('span');
  tempSpan.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;';
  tempSpan.textContent = unit;
  document.body.appendChild(tempSpan);
  const unitWidth = tempSpan.offsetWidth;
  document.body.removeChild(tempSpan);

  if (unitWidth === 0) return;

  // Enough repeats to fill 200% of viewport width
  const repeats = Math.ceil((window.innerWidth * 2) / unitWidth) + 2;

  // Double for seamless loop
  let html = '';
  for (let i = 0; i < repeats * 2; i++) {
    html += `<span class="quote-repeat">${unit}</span>`;
  }
  track.innerHTML = html;

  // Set loop width (first half of the track)
  const loopWidth = unitWidth * repeats;
  track.style.setProperty('--loop-width', loopWidth + 'px');

  // Restart animation
  track.style.animation = 'none';
  track.offsetHeight; // force reflow
  const duration = Math.max(12, loopWidth / 80);
  track.style.animation = `ticker ${duration}s linear infinite`;
}

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
  if (isMobile()) {
    sectionsTrack.style.transform = '';
    return;
  }
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
    return;
  }
  if (idx < 0 || idx >= sections.length) return;
  currentSectionIdx = idx;

  if (isMobile()) {
    const sectionId = 'sec-0' + idx;
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  } else {
    slideTo(idx);
    setParallaxFromSection(idx, sections.length);
  }

  navItems.forEach(ni => ni.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-idx="' + idx + '"]');
  if (activeNav) {
    activeNav.classList.add('active');
    if (!isMobile()) updateCursor();
  }

  setQuote(idx);
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

/* Re-snap on resize; recheck mobile on every resize */
window.addEventListener('resize', () => {
  checkMobile();
  updateMobilePadding();
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


/* ─── PHOTO SLOT EXPAND ───────────────────────── */
document.querySelectorAll('.photo-slot').forEach(function(slot) {
  slot.addEventListener('click', function() {
    var col = slot.closest('.photo-col');
    var wasOpen = slot.classList.contains('open');
    col.querySelectorAll('.photo-slot.open').forEach(function(el) { el.classList.remove('open'); });
    if (!wasOpen) slot.classList.add('open');
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

