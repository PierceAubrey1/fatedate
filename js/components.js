/* ═══════════════════════════════════════
   FATEDATE — GLOBAL COMPONENTS
   Loads header.html and footer.html into
   every page, then boots shared JS.
═══════════════════════════════════════ */

(function () {

  /* ── Fetch a fragment and inject it ── */
  function inject(url, targetId, position) {
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var target = document.getElementById(targetId);
        if (!target) return;
        if (position === 'before') {
          target.insertAdjacentHTML('beforebegin', html);
        } else {
          target.insertAdjacentHTML('afterend', html);
        }
        /* Boot JS after injection */
        if (url.includes('header')) bootNav();
        if (url.includes('footer')) { /* nothing extra needed */ }
        /* After both are injected, boot shared JS */
        checkAndBootShared();
      })
      .catch(function (e) { console.warn('FateDate components: could not load ' + url, e); });
  }

  var _headerLoaded = false;
  var _footerLoaded = false;

  function checkAndBootShared() {
    /* Only boot cursor + scroll reveal once both are in the DOM */
    if (document.getElementById('site-header') && document.getElementById('site-footer')) {
      if (!_headerLoaded || !_footerLoaded) {
        _headerLoaded = !!document.getElementById('site-header');
        _footerLoaded = !!document.getElementById('site-footer');
        bootShared();
      }
    }
  }

  /* ── Inject into page ── */
  /* Header goes before #page-start, footer goes after #page-end */
  /* Pages just need <div id="page-start"></div> and <div id="page-end"></div> */
  inject('header.html', 'page-start', 'before');
  inject('footer.html', 'page-end',   'after');


  /* ══════════════════════════════════════
     NAV — mobile overlay + dropdown
  ══════════════════════════════════════ */
  function bootNav() {

    /* Mobile overlay */
    var hamburger = document.getElementById('nav-hamburger');
    var overlay   = document.getElementById('nav-overlay');
    if (hamburger && overlay) {
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
      hamburger.addEventListener('click', function () {
        overlay.classList.contains('open') ? closeNav() : openNav();
      });
      overlay.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeNav);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });
    }

    /* Desktop dropdown */
    document.querySelectorAll('.nav-item-dropdown').forEach(function (item) {
      var trigger = item.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;
      function open()  { item.classList.add('open');    trigger.setAttribute('aria-expanded', 'true');  }
      function close() { item.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        item.classList.contains('open') ? close() : open();
      });
      document.addEventListener('click', close);
      item.addEventListener('click', function (e) { e.stopPropagation(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    });

    /* Mobile overlay dropdown */
    document.querySelectorAll('.nav-overlay-dropdown-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item   = trigger.closest('.nav-overlay-item-dropdown');
        var isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
        var sub = item.querySelector('.nav-overlay-sub');
        if (sub) sub.setAttribute('aria-hidden', String(isOpen));
      });
    });

    /* Header scroll state */
    var header = document.getElementById('site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.pageYOffset > 40);
      }, { passive: true });
    }

    /* Highlight active nav link */
    var path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '') || 'fatedate';
    document.querySelectorAll('#site-header .nav-links a, #site-header .nav-dropdown a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href && path.includes(href.replace(/^\//, ''))) {
        a.classList.add('nav-active');
      }
    });
  }


  /* ══════════════════════════════════════
     SHARED — cursor + scroll reveal
  ══════════════════════════════════════ */
  function bootShared() {

    /* Scroll reveal — fd-reveal system */
    var els = document.querySelectorAll('.fd-reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('fd-visible'); });
    } else {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('fd-visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
      els.forEach(function (el) { obs.observe(el); });
    }

    /* Custom cursor */
    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    var rx = -100, ry = -100, dx = -100, dy = -100;
    dot.style.cssText  = 'left:-100px;top:-100px';
    ring.style.cssText = 'left:-100px;top:-100px';
    document.addEventListener('mousemove', function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    }, { passive: true });
    (function loop() {
      rx += (dx - rx) * 0.12; ry += (dy - ry) * 0.12;
      ring.style.left = rx.toFixed(1) + 'px'; ring.style.top = ry.toFixed(1) + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .perk-card, .safety-feature-card, .connect-card, .outcome-card, .resource-card, .cta').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

})();
