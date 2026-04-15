

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
  
(function() {
  var h = document.getElementById('site-header');
  if (h) window.addEventListener('scroll', function() { h.classList.toggle('scrolled', window.pageYOffset > 40); }, { passive: true });
})();
(function() {
  var btn = document.getElementById('nav-hamburger');
  var overlay = document.getElementById('nav-overlay');
  if (!btn || !overlay) return;
  btn.addEventListener('click', function() {
    var open = document.body.classList.toggle('nav-open');
    overlay.setAttribute('aria-hidden', !open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();
(function() {
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var rx = -100, ry = -100, dx = -100, dy = -100;
  dot.style.cssText  = 'left:-100px;top:-100px';
  ring.style.cssText = 'left:-100px;top:-100px';
  document.addEventListener('mousemove', function(e) {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
  }, { passive: true });
  (function loop() {
    rx += (dx - rx) * 0.12; ry += (dy - ry) * 0.12;
    ring.style.left = rx.toFixed(1) + 'px'; ring.style.top = ry.toFixed(1) + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.value-card,.team-card').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
  });
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



// How it works


(function() {
  var hamburger = document.getElementById('nav-hamburger');
  var overlay = document.getElementById('nav-overlay');
  if (!hamburger || !overlay) return;
  function openNav() { hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded','true'); overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; document.body.classList.add('nav-open'); }
  function closeNav() { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; document.body.classList.remove('nav-open'); }
  hamburger.addEventListener('click', function() { overlay.classList.contains('open') ? closeNav() : openNav(); });
  overlay.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeNav(); });
})();
(function() {
  var header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function() { header.classList.toggle('scrolled', window.pageYOffset > 40); }, { passive: true });
})();
(function() {
  var els = document.querySelectorAll('.fd-reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(el) { el.classList.add('fd-visible'); }); return; }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('fd-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(function(el) { obs.observe(el); });
})();
(function() {
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var rx=-100, ry=-100, dx=-100, dy=-100;
  dot.style.cssText='left:-100px;top:-100px'; ring.style.cssText='left:-100px;top:-100px';
  document.addEventListener('mousemove', function(e) { dx=e.clientX; dy=e.clientY; dot.style.left=dx+'px'; dot.style.top=dy+'px'; }, { passive: true });
  (function loop() { rx+=(dx-rx)*0.12; ry+=(dy-ry)*0.12; ring.style.left=rx.toFixed(1)+'px'; ring.style.top=ry.toFixed(1)+'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button,.connect-card,.outcome-card,.cta').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
  });
})();