(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var mobileQuery = window.matchMedia('(max-width: 768px)');

  function isMobileNav() {
    return mobileQuery.matches;
  }

  function setNavOpen(open) {
    if (!toggle || !nav) {
      return;
    }

    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');

    if (isMobileNav()) {
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    } else {
      nav.removeAttribute('aria-hidden');
    }
  }

  function closeNav() {
    setNavOpen(false);
  }

  function syncNavState() {
    if (!toggle || !nav) {
      return;
    }

    if (!isMobileNav()) {
      nav.classList.remove('is-open');
      nav.removeAttribute('aria-hidden');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open main menu');
      return;
    }

    if (!nav.classList.contains('is-open')) {
      nav.setAttribute('aria-hidden', 'true');
    }
  }

  if (toggle && nav) {
    syncNavState();
    mobileQuery.addEventListener('change', syncNavState);

    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isMobileNav()) {
          closeNav();
        }
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open') && isMobileNav()) {
        closeNav();
        toggle.focus();
      }
    });
  }
})();
