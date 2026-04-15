/* ═══════════════════════════════════════
   MOBILE NAV OVERLAY
═══════════════════════════════════════ */
(function() {
  var hamburger = document.getElementById('nav-hamburger');
  var overlay   = document.getElementById('nav-overlay');
  if (!hamburger || !overlay) return;

  function openNav() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('nav-open');
  }

  hamburger.addEventListener('click', function() {
    overlay.classList.contains('open') ? closeNav() : openNav();
  });

  // Close on link click
  overlay.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });
})();

/* ═══════════════════════════════════════
   HEADER SCROLL STATE
═══════════════════════════════════════ */
(function() {
  var header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.pageYOffset > 40);
  }, { passive: true });
})();

/* ═══════════════════════════════════════
   SCROLL REVEAL — fd-reveal system
═══════════════════════════════════════ */
(function() {
  var els = document.querySelectorAll('.fd-reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('fd-visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('fd-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(function(el) { obs.observe(el); });
})();

/* ═══════════════════════════════════════
   LOADER
═══════════════════════════════════════ */
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});


/* ═══════════════════════════════════════
   SCREEN CONFIG
   Replace null with '/path/to/image.png' for real screens
═══════════════════════════════════════ */
var SCREENS = [
  { img: 'assets/verif.PNG',  label: 'verify',        num: '01', bg1: '#0d0820', bg2: '#1a1040', accent: '#c9b8ff' },
  { img: 'assets/connect.png', label: 'connection',    num: '02', bg1: '#0a0030', bg2: '#160055', accent: '#9b7dff' },
  { img: 'assets/date.png',    label: 'go on a date',  num: '03', bg1: '#051a10', bg2: '#0a3020', accent: '#02A0AE' },
  { img: 'assets/match.png',   label: 'make a match',  num: '04', bg1: '#120830', bg2: '#1e1050', accent: '#7B2EFD' },
];




var loadedImgs = SCREENS.map(function(s) {
  if (!s.img) return null;
  var im = new Image(); im.src = s.img; return im;
});

var canvas = document.getElementById('screen-canvas');
var ctx    = canvas.getContext('2d');
var CW     = canvas.width;
var CH     = canvas.height;

function drawScreen(idx) {
  var s = SCREENS[idx], im = loadedImgs[idx];
  if (im && im.complete && im.naturalWidth > 0) { ctx.drawImage(im, 0, 0, CW, CH); return; }

  ctx.clearRect(0, 0, CW, CH);
  var grad = ctx.createLinearGradient(0, 0, 0, CH);
  grad.addColorStop(0, s.bg1); grad.addColorStop(1, s.bg2);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, CW, CH);

  var rg = ctx.createRadialGradient(CW/2, CH*0.45, 0, CW/2, CH*0.45, 280);
  rg.addColorStop(0, s.accent + '60'); rg.addColorStop(1, 'transparent');
  ctx.fillStyle = rg; ctx.fillRect(0, 0, CW, CH);

  ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = s.accent;
  ctx.font = 'bold 260px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(s.num, CW/2, CH/2); ctx.restore();

  ctx.save(); ctx.fillStyle = s.accent + '30'; ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(CW/2-110, CH/2-32, 220, 64, 32) : ctx.rect(CW/2-110, CH/2-32, 220, 64);
  ctx.fill(); ctx.restore();

  ctx.fillStyle = s.accent; ctx.font = 'bold 26px serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(s.label, CW/2, CH/2 - 6);
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '16px sans-serif';
  ctx.fillText('add your screenshot', CW/2, CH/2 + 38);

  [-1,0,1].forEach(function(o) {
    ctx.beginPath(); ctx.arc(CW/2+o*18, CH-50, o===0?6:4, 0, Math.PI*2);
    ctx.fillStyle = o===0 ? s.accent : 'rgba(255,255,255,0.2)'; ctx.fill();
  });
}

var firstImg = loadedImgs[0];
if (firstImg) {
  firstImg.onload = function() { drawScreen(0); };
  if (firstImg.complete) drawScreen(0);
} else {
  drawScreen(0);
}

/* ═══════════════════════════════════════
   SPIN ENGINE + TILT + AMBIENT + GLINT
═══════════════════════════════════════ */
var rotor        = document.getElementById('phone-rotor');
var phoneScene   = document.getElementById('phone-scene');
var phoneAmbient = document.getElementById('phone-ambient');
var phoneGlint   = document.getElementById('phone-glint');
var scrollSec    = document.getElementById('scroll-section');
var allSteps     = document.querySelectorAll('.step');
var dots         = document.querySelectorAll('.dot');
var NUM_STEPS    = 4;
scrollSec.style.setProperty('--steps', NUM_STEPS);

var activeStep   = 0, rotDeg = 0, spinFrom = 0, spinTo = 0;
var spinFrame    = 0, spinning = false, pendingIdx = 0, didSwap = false;
var sceneTopPx   = 0, currentTopPx = 0;
var SPIN_FRAMES  = 52;

var scrollProgress = 0;

function easeInOut(t) { return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
function lerp(a, b, t) { return a + (b - a) * t; }

// Hex to rgb helper
function hexToRgb(hex) {
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function updateAmbient(idx) {
  var s = SCREENS[idx];
  var rgb = hexToRgb(s.accent);
  var col = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0.28)';
  var col2 = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0.1)';
  phoneAmbient.style.background =
    'radial-gradient(ellipse at center, '+col+' 0%, '+col2+' 35%, transparent 70%)';
}

function triggerGlint() {
  phoneGlint.classList.remove('glint-active');
  void phoneGlint.offsetWidth; // reflow to restart animation
  phoneGlint.classList.add('glint-active');
}

function startSpin(toIdx) {
  if (spinning) {
    rotDeg = spinTo;
    rotor.style.transform = buildRotorTransform(rotDeg);
    if (!didSwap) { drawScreen(pendingIdx); updateAmbient(pendingIdx); }
    spinning = false;
  }
  pendingIdx=toIdx; didSwap=false; spinFrom=rotDeg; spinTo=rotDeg+360; spinFrame=0; spinning=true;
}

function buildRotorTransform(ry) {
  return 'rotateY('+ry+'deg)';
}

function activateStep(idx) {
  if (idx===activeStep) return;
  activeStep=idx;
  allSteps.forEach(function(s){ s.classList.toggle('active', parseInt(s.dataset.step)===idx); });
  dots.forEach(function(d,i){ d.classList.toggle('active', i===idx); });
  startSpin(idx);
}

var tickPaused = false;
var tickRafId = null;

function startTick() {
  if (!tickRafId) tickRafId = requestAnimationFrame(tick);
}
function stopTick() {
  if (tickRafId) { cancelAnimationFrame(tickRafId); tickRafId = null; }
}

var tickObserver = new IntersectionObserver(function(entries) {
  tickPaused = !entries[0].isIntersecting;
  if (tickPaused) stopTick(); else startTick();
}, { rootMargin: '200px 0px 200px 0px' });
tickObserver.observe(scrollSec);

function tick() {
  tickRafId = requestAnimationFrame(tick);

  // Lerp scene vertical parallax
  var prevTopPx = currentTopPx;
  currentTopPx += (sceneTopPx - currentTopPx) * 0.055;

  if (Math.abs(currentTopPx - prevTopPx) > 0.01 || spinning) {
    phoneScene.style.transform = 'translate(-50%, calc(-50% + '+currentTopPx.toFixed(2)+'px)) scale(var(--phone-scale))';
  }

  if (!spinning) return;
  spinFrame++;
  var prog = Math.min(1, spinFrame/SPIN_FRAMES);
  var eased = easeInOut(prog);
  rotDeg = spinFrom + (spinTo-spinFrom)*eased;
  if (!didSwap && (rotDeg-spinFrom)>=180) {
    drawScreen(pendingIdx);
    updateAmbient(pendingIdx);
    didSwap=true;
  }
  rotor.style.transform = buildRotorTransform(rotDeg);
  if (prog>=1) {
    spinning=false;
    rotDeg=spinTo;
    rotor.style.transform=buildRotorTransform(rotDeg);
    triggerGlint();
  }
}

tick();

// Initial ambient
updateAmbient(0);

var scrollTicking = false;
window.addEventListener('scroll', function() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(function() { scrollTicking = false; });
  var rect = scrollSec.getBoundingClientRect();
  var sectionH = rect.height - window.innerHeight;
  var p = Math.max(0, Math.min(1, -rect.top / sectionH));
  // Show/hide particle canvas only while section is in view

  var step = Math.min(NUM_STEPS-1, Math.floor(p*NUM_STEPS));
  scrollProgress = p;

  activateStep(step);

  // Vertical parallax
  sceneTopPx = (p - 0.5) * -80;



}, { passive: true });

/* ═══════════════════════════════════════
   CUSTOM CURSOR
   Uses transform (not left/top) to avoid layout recalculation.
   RAF loop only runs while cursor is moving, then self-suspends.
═══════════════════════════════════════ */
var cursorDot  = document.getElementById('cursor-dot');
var cursorRing = document.getElementById('cursor-ring');
var ringX = window.innerWidth/2, ringY = window.innerHeight/2;
var dotX  = ringX, dotY = ringY;
var ringRafId = null;

// Position dot immediately on move — no lerp needed for the dot itself
document.addEventListener('mousemove', function(e) {
  dotX = e.clientX; dotY = e.clientY;
  cursorDot.style.transform = 'translate(calc(' + dotX + 'px - 50%), calc(' + dotY + 'px - 50%))';
  if (!ringRafId) ringRafId = requestAnimationFrame(animateRing);
}, { passive: true });

function animateRing() {
  ringX += (dotX - ringX) * 0.12;
  ringY += (dotY - ringY) * 0.12;
  cursorRing.style.transform = 'translate(calc(' + ringX.toFixed(1) + 'px - 50%), calc(' + ringY.toFixed(1) + 'px - 50%))';
  // Stop looping once ring has caught up — restarts on next mousemove
  if (Math.abs(dotX - ringX) > 0.3 || Math.abs(dotY - ringY) > 0.3) {
    ringRafId = requestAnimationFrame(animateRing);
  } else {
    ringRafId = null;
  }
}

// Hover state — triggers on all interactive elements
document.querySelectorAll('a, button, .perk-card, .safety-video-card, .cta').forEach(function(el) {
  el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
  el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
});

/* ═══════════════════════════════════════
   HERO — MOUSE PARALLAX + SCROLL PARALLAX
═══════════════════════════════════════ */
var heroContainer = document.getElementById('hero-container');





/* ═══════════════════════════════════════
   SCROLL-DRIVEN IMAGE CAROUSEL
═══════════════════════════════════════ */
(function() {
  var wrap  = document.getElementById('img-carousel-wrap');
  var track = document.getElementById('img-carousel-track');
  if (!wrap || !track) return;

  var DRAG     = 0.55; // how far it travels — increase to scroll further
  var currentX = 0;
  var targetX  = 0;
  var rafId    = null;

  function getProgress() {
    var rect  = wrap.getBoundingClientRect();
    var total = window.innerHeight + wrap.offsetHeight;
    var passed = window.innerHeight - rect.top;
    return Math.max(0, Math.min(1, passed / total));
  }

  function maxTravel() {
    return (track.scrollWidth - wrap.offsetWidth) * DRAG;
  }

  function onScroll() {
    targetX = -(getProgress() * maxTravel());
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function loop() {
    rafId = null;
    currentX += (targetX - currentX) * 0.08;
    track.style.transform = 'translateX(' + currentX.toFixed(2) + 'px)';
    if (Math.abs(targetX - currentX) > 0.1) {
      rafId = requestAnimationFrame(loop);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Desktop dropdown ── */
document.querySelectorAll('.nav-item-dropdown').forEach(function(item) {
  var trigger = item.querySelector('.nav-dropdown-trigger');
  function open() {
    item.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }
  function close() {
    item.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }
  trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    item.classList.contains('open') ? close() : open();
  });
  document.addEventListener('click', close);
  item.addEventListener('click', function(e) { e.stopPropagation(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close();
  });
});

/* ── Mobile overlay dropdown ── */
document.querySelectorAll('.nav-overlay-dropdown-trigger').forEach(function(trigger) {
  trigger.addEventListener('click', function() {
    var item = trigger.closest('.nav-overlay-item-dropdown');
    var isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    trigger.setAttribute('aria-expanded', !isOpen);
    var sub = item.querySelector('.nav-overlay-sub');
    sub.setAttribute('aria-hidden', isOpen);
  });
});