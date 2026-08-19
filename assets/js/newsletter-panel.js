(function () {
    var tab = document.getElementById('newsletter-tab');
    var panel = document.getElementById('email-updates');
    var backdrop = document.getElementById('newsletter-backdrop');
    var closeBtn = document.getElementById('newsletter-close');

    if (!tab || !panel || !backdrop) {
        return;
    }

    function setOpen(open) {
        tab.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.classList.toggle('is-open', open);
        backdrop.classList.toggle('is-visible', open);
        panel.hidden = !open;
        backdrop.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';

        if (open) {
            closeBtn.focus();
        } else {
            tab.focus();
        }
    }

    function openPanel() {
        setOpen(true);
    }

    function closePanel() {
        setOpen(false);
    }

    tab.addEventListener('click', function () {
        if (panel.classList.contains('is-open')) {
            closePanel();
        } else {
            openPanel();
        }
    });

    document.querySelectorAll('[data-open-newsletter]').forEach(function (trigger) {
        trigger.addEventListener('click', function (ev) {
            ev.preventDefault();
            openPanel();
        });
    });

    closeBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);

    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && panel.classList.contains('is-open')) {
            closePanel();
        }
    });

    function hashOpensPanel() {
        return window.location.hash === '#email-updates';
    }

    if (hashOpensPanel()) {
        openPanel();
    }

    window.addEventListener('hashchange', function () {
        if (hashOpensPanel()) {
            openPanel();
        }
    });

})();
