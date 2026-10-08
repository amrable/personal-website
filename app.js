(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav ---- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var siteNav = document.getElementById('site-nav');

  function closeNav() {
    if (siteNav) siteNav.removeAttribute('data-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      if (siteNav.getAttribute('data-open') === 'true') {
        closeNav();
      } else {
        siteNav.setAttribute('data-open', 'true');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });

    siteNav.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (event) {
      if (siteNav.getAttribute('data-open') !== 'true') return;
      if (!(event.target.closest && event.target.closest('.site-header'))) closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 720) closeNav();
    });
  }

  /* ---- Header solidifies once the hero scrolls past ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var syncHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* ---- Scroll reveal ---- */
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!els.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  els.forEach(function (el) {
    var siblings = el.parentElement
      ? el.parentElement.querySelectorAll(':scope > [data-reveal]')
      : [el];
    var i = Array.prototype.indexOf.call(siblings, el);
    if (i > 0) el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
    io.observe(el);
  });
})();
