/**
 * splash.js — Premium deck-to-grid card intro for the home page.
 *
 * 14 stock interior photos begin stacked like a playing-card deck,
 * fan out in an arc, then deal one-by-one into a photographic grid.
 * After the grid forms, a bold "ELEVATING OFFICE SPACES" heading
 * fades in. The whole sequence is ~9.8 seconds.
 *
 * Fully responsive: mobile (2 cols), tablet (3 cols), desktop (5 cols).
 * Plays only once per browser session.
 */
(function () {
    'use strict';

    var SKEY      = 'skn_splash_v3';
    var REMOVE_AT = 9800; // ms — splash element removed

    var splash = document.getElementById('splash-screen');
    if (!splash) return;

    /* --- Already shown this session → remove silently --- */
    try {
        if (sessionStorage.getItem(SKEY)) {
            splash.parentNode.removeChild(splash);
            return;
        }
    } catch (e) { /* private-browsing may throw */ }

    /* Lock body scroll */
    document.documentElement.classList.add('splash-active');

    var cards   = Array.prototype.slice.call(splash.querySelectorAll('.splash-card'));
    var brand   = splash.querySelector('.splash-brand');
    var heading = document.getElementById('splash-heading');
    var N       = cards.length; // 14

    /* ---- Preload card images ---- */
    var imgLoaded = 0;
    var started   = false;

    function bump() {
        imgLoaded++;
        if (imgLoaded >= N && !started) begin();
    }

    cards.forEach(function (c) {
        var img = c.querySelector('img');
        if (!img)                             { bump(); return; }
        if (img.complete && img.naturalWidth) { bump(); return; }
        img.onload  = bump;
        img.onerror = bump;
    });

    /* Safety-net: start even if some images are slow */
    setTimeout(function () { if (!started) begin(); }, 2500);

    /* ============================================================
       ANIMATION ORCHESTRATION
       ============================================================ */
    function begin() {
        if (started) return;
        started = true;

        var vw     = window.innerWidth;
        var vh     = window.innerHeight;
        var mobile = vw < 640;
        var tablet = !mobile && vw < 1024;

        /* --- Card & grid sizing (responsive) --- */
        var cols, gap, cardW, cardH;

        if (mobile) {
            cols  = 2;
            gap   = 8;
            cardW = Math.floor((vw - gap * 3) / 2);
            if (cardW > 170) cardW = 170;
        } else if (tablet) {
            cols  = 3;
            gap   = 12;
            cardW = Math.min(190, Math.floor((vw - gap * 4) / 3));
        } else {
            cols  = 5;
            gap   = 14;
            cardW = Math.min(200, Math.floor((Math.min(vw, 1200) - gap * 6) / 5));
        }
        cardH = Math.floor(cardW * 0.62);

        /* --- Compute grid target positions (center of each cell) --- */
        var rows  = Math.ceil(N / cols);
        var gridH = rows * cardH + (rows - 1) * gap;
        var gridY = Math.max(16, Math.floor((vh - gridH - (mobile ? 40 : 60)) / 2));

        var positions = [];
        for (var i = 0; i < N; i++) {
            var r      = Math.floor(i / cols);
            var c      = i % cols;
            var inRow  = (r < rows - 1) ? cols : (N - r * cols);
            var rowW   = inRow * cardW + (inRow - 1) * gap;
            var rx     = Math.floor((vw - rowW) / 2);

            positions.push({
                cx: rx + c * (cardW + gap) + cardW / 2,
                cy: gridY + r * (cardH + gap) + cardH / 2
            });
        }

        /* Apply card dimensions */
        cards.forEach(function (card) {
            card.style.width  = cardW + 'px';
            card.style.height = cardH + 'px';
        });

        /* ---- PHASE 0  (0 s)  — brand fades in ---- */
        requestAnimationFrame(function () {
            if (brand) {
                brand.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
                brand.style.opacity    = '1';
                brand.style.transform  = 'scale(1)';
            }
        });

        /* ---- PHASE 1  (0.7 s) — deck fans out, brand drifts up ---- */
        at(700, function () {
            if (brand) {
                brand.style.transition = 'all 0.9s cubic-bezier(.4,0,.2,1)';
                brand.style.transform  = 'translateY(' + Math.round(-vh * 0.30) + 'px) scale(.5)';
                brand.style.opacity    = '0';
            }

            var mid = (N - 1) / 2;
            cards.forEach(function (card, idx) {
                var angle = (idx - mid) * (mobile ? 3 : 5);
                var tx    = (idx - mid) * (mobile ? 4 : 9);
                var ty    = (idx - mid) * -2;

                card.style.transition =
                    'all 0.5s cubic-bezier(.4,0,.2,1) ' + (idx * 0.03) + 's';
                card.style.opacity   = '1';
                card.style.transform =
                    'translate(-50%,-50%) ' +
                    'translateX(' + tx + 'px) ' +
                    'translateY(' + ty + 'px) ' +
                    'rotate(' + angle + 'deg)';
            });
        });

        /* ---- PHASE 2  (2.0 s) — deal cards to grid one-by-one ---- */
        at(2000, function () {
            cards.forEach(function (card, idx) {
                var p = positions[idx];
                var stagger = mobile ? 0.12 : 0.15;
                card.style.transition =
                    'all 0.6s cubic-bezier(.22,1,.36,1) ' + (idx * stagger) + 's';
                card.style.left      = p.cx + 'px';
                card.style.top       = p.cy + 'px';
                card.style.transform = 'translate(-50%,-50%) rotate(0deg)';
                card.style.boxShadow = '0 8px 28px rgba(0,0,0,0.35)';
                card.style.borderRadius = '8px';
            });
        });

        /* ---- PHASE 3  (5.4 s) — golden shimmer on the grid ---- */
        at(5400, function () {
            cards.forEach(function (card) {
                card.style.transition = 'box-shadow 0.7s ease';
                card.style.boxShadow =
                    '0 0 24px rgba(212,175,55,.2), 0 6px 24px rgba(0,0,0,.3)';
            });
        });

        /* ---- PHASE 3.5  (5.8 s) — heading fades in ---- */
        at(5800, function () {
            if (heading) {
                heading.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(.4,0,.2,1)';
                heading.style.opacity    = '1';
                heading.style.transform  = 'translateX(-50%) translateY(0)';
            }
        });

        /* ---- PHASE 4  (8.0 s) — fade out splash ---- */
        at(8000, function () {
            splash.style.transition = 'opacity 1.4s ease';
            splash.style.opacity    = '0';
        });

        /* ---- Cleanup ---- */
        at(REMOVE_AT, function () {
            document.documentElement.classList.remove('splash-active');
            if (splash.parentNode) splash.parentNode.removeChild(splash);
            try { sessionStorage.setItem(SKEY, '1'); } catch (e) {}
        });
    }

    /* tiny helpers */
    function at(ms, fn) { setTimeout(fn, ms); }
})();
