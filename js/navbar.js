function loadAosAssets() {
    return new Promise(resolve => {
        const existingScript = document.getElementById('skn-aos-js');
        const existingAosGlobal = window.AOS;

        if (!document.getElementById('skn-aos-css')) {
            const aosCss = document.createElement('link');
            aosCss.id = 'skn-aos-css';
            aosCss.rel = 'stylesheet';
            aosCss.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
            document.head.appendChild(aosCss);
        }

        if (existingAosGlobal) {
            resolve();
            return;
        }

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(), { once: true });
            existingScript.addEventListener('error', () => resolve(), { once: true });
            return;
        }

        const aosScript = document.createElement('script');
        aosScript.id = 'skn-aos-js';
        aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        aosScript.async = true;
        aosScript.onload = () => resolve();
        aosScript.onerror = () => resolve();
        document.head.appendChild(aosScript);
    });
}

function applyAutoAosAttributes() {
    const selectors = [
        'main img',
        'main h1, main h2, main h3, main h4, main h5, main h6',
        'main p, main li, main figcaption, main blockquote',
        'main a, main button, main span, main strong, main em',
        '.footer-info img, .footer-info h1, .footer-info h2, .footer-info h3, .footer-info h4, .footer-info h5, .footer-info h6',
        '.footer-info p, .footer-info li, .footer-info a, .footer-info span, .footer-info strong',
        'footer p, footer span, footer a, footer strong'
    ];

    const uniqueElements = [];
    const seen = new Set();

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (!seen.has(element)) {
                seen.add(element);
                uniqueElements.push(element);
            }
        });
    });

    function isExcluded(element) {
        if (element.matches && element.matches('.project-item img')) {
            return true;
        }

        return !!element.closest('header, .navbar, .navlist, .top-rolling-bar, footer, .project-overlay, .portfolio-card-overlay, .project-item-overlay');
    }

    function hasMeaningfulText(element) {
        return (element.textContent || '').trim().length > 0;
    }

    let delay = 80;
    uniqueElements.forEach(element => {
        if (element.hasAttribute('data-aos')) {
            return;
        }

        if (isExcluded(element)) {
            return;
        }

        const isImage = element.tagName === 'IMG';
        const isTextual = !isImage;

        if (isTextual && !hasMeaningfulText(element)) {
            return;
        }

        element.setAttribute('data-aos', isImage ? 'zoom-in' : 'fade-up');
        element.setAttribute('data-aos-delay', String(delay));
        delay += 60;
        if (delay > 380) {
            delay = 80;
        }
    });
}

function initAosSitewide() {
    if (window.__sknAosInitialized) {
        return;
    }

    window.__sknAosInitialized = true;
    applyAutoAosAttributes();

    if (window.AOS) {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80
        });

        if (typeof AOS.refreshHard === 'function') {
            requestAnimationFrame(() => {
                AOS.refreshHard();
                replayInitiallyVisibleAosElements();
            });
            window.addEventListener('load', () => {
                AOS.refreshHard();
                replayInitiallyVisibleAosElements();
            }, { once: true });
        } else {
            replayInitiallyVisibleAosElements();
        }
    }
}

function replayInitiallyVisibleAosElements() {
    const animatedElements = document.querySelectorAll('[data-aos].aos-animate');

    if (!animatedElements.length) {
        return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const toReplay = [];

    animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < viewportHeight && rect.bottom > 0;

        if (isVisible) {
            toReplay.push(element);
            element.classList.remove('aos-animate');
        }
    });

    if (!toReplay.length) {
        return;
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toReplay.forEach(element => {
                element.classList.add('aos-animate');
            });
        });
    });
}

function scheduleAosInitialization() {
    const initialize = () => {
        loadAosAssets().then(() => {
            initAosSitewide();
        });
    };

    initialize();
}

function ensureTopRollingBarStyles() {
    if (document.getElementById('top-rolling-bar-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'top-rolling-bar-styles';
    style.textContent = `
        header,
        header.scrolled-nav,
        header.beige-nav {
            border-bottom: 1px solid rgba(74, 124, 89, 0.18);
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            overflow: visible;
        }

        .navbar,
        .navbar.background,
        .navbar.scrolled-nav,
        .navbar.beige-nav,
        .navbar.beige-nav.scrolled-nav {
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;
            background: #F5F2EF;
        }

        .top-rolling-bar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1100;
            width: 100%;
            height: 32px;
            border-radius: 0;
            background: transparent;
            border: none;
            box-shadow: none;
            overflow: hidden;
            backdrop-filter: none;
        }

        .top-rolling-viewport {
            height: 100%;
            overflow: hidden;
        }

        .top-rolling-track {
            display: flex;
            flex-direction: column;
            transition: transform 0.5s ease;

                function isTabletOrMobile() {
                    return window.matchMedia('(max-width: 1110px)').matches;
                }

                function openMenu() {
                    hamburger.classList.add('active');
                    navlist.classList.add('active');

                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.className = 'overlay';
                        document.body.appendChild(overlay);
                        overlay.addEventListener('click', closeMenu);
                    }

                    overlay.classList.add('active');

                    if (isTabletOrMobile()) {
                        navlist.style.top = '80px';
                        navlist.style.maxHeight = '60vh';
                        // rely on CSS transform/opacity transitions for smooth drop
                        navlist.style.transform = '';
                    } else {
                        navlist.style.top = '0';
                        navlist.style.maxHeight = '';
                        // rely on CSS for desktop slide-in
                        navlist.style.transform = '';
                    }

                    // rely on the hamburger control to open/close the menu; do not inject
                    // an extra in-menu close button to avoid duplicate controls
                }

                function closeMenu() {
                    hamburger.classList.remove('active');
                    navlist.classList.remove('active');
                    navlist.style.top = '';
                    navlist.style.height = '';
                    navlist.style.maxHeight = '';
                    navlist.style.transform = '';

                    const closeBtn = navlist.querySelector('.close-btn');
                    if (closeBtn) {
                        closeBtn.remove();
                    }

                    if (overlay) {
                        overlay.classList.remove('active');
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        overlay = null;
                    }

                    closeAllDropdowns();
                }
        }

                    if (navlist.classList.contains('active')) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
            border-radius: 50%;
            text-decoration: none;
            background: #4A7C59;
            color: #ffffff;
            font-size: 11px;
            line-height: 1;
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .top-rolling-icon:hover {
            transform: translateY(-1px);
            background-color: #3a6048;
        }

    `;

    document.head.appendChild(style);
}

function applyTopRollingBarLayout(barHeight) {
    const navTop = document.querySelector('.nav-top');
    const measuredNavTopHeight = navTop ? navTop.offsetHeight : 0;
    const baseNavbarHeight = measuredNavTopHeight > 0 ? measuredNavTopHeight : 55;
    const totalHeaderHeight = baseNavbarHeight + barHeight;

    const header = document.querySelector('header');
    if (header) {
        header.style.height = `${totalHeaderHeight}px`;
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.height = `${totalHeaderHeight}px`;
        navbar.style.paddingTop = `${barHeight}px`;
        navbar.style.alignItems = 'center';
    }

    const navlist = document.getElementById('navlist');
    // Do not modify navlist inline positioning here — visual placement is controlled by CSS
    // (previous behavior set top/height which conflicted with the slide-in menu on smaller viewports)

    const mains = document.querySelectorAll('main');
    mains.forEach(main => {
        if (!main.dataset.basePaddingTop) {
            main.dataset.basePaddingTop = window.getComputedStyle(main).paddingTop;
        }

        const basePadding = parseFloat(main.dataset.basePaddingTop) || 0;
        main.style.paddingTop = `${basePadding + barHeight}px`;
    });
}

function createTopRollingBar() {
    const header = document.querySelector('header');

    if (!header || document.querySelector('.top-rolling-bar')) {
        return;
    }

    ensureTopRollingBarStyles();

    const path = (window.location.pathname || '').toLowerCase();
    const contactHref = path.includes('/projects/') ? '../contact.html' : 'contact.html';

    const bar = document.createElement('div');
    bar.className = 'top-rolling-bar';
    bar.innerHTML = `
        <div class="top-rolling-viewport" aria-live="polite">
            <div class="top-rolling-track" id="top-rolling-track">
                <div class="top-rolling-item">
                    <span>Get in touch with our experts:</span>
                    <span class="top-rolling-icons">
                        <a class="top-rolling-icon" href="tel:+919310326361" aria-label="Call now" title="Call now">☎</a>
                        <a class="top-rolling-icon" href="mailto:shriraminteriors@zohomail.in" aria-label="Email us" title="Email us">✉</a>
                    </span>
                </div>
                <div class="top-rolling-item">
                    <span>Get a free estimate:</span>
                    <span class="top-rolling-icons">
                        <a class="top-rolling-icon" href="${contactHref}" aria-label="Go to Get In Touch form" title="Get In Touch">💬</a>
                    </span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(bar);

    const updateTopRollingLayout = () => {
        const barHeight = bar.offsetHeight || 34;
        applyTopRollingBarLayout(barHeight);
    };

    updateTopRollingLayout();
    window.addEventListener('resize', updateTopRollingLayout);

    const track = document.getElementById('top-rolling-track');
    if (!track) {
        return;
    }

    let showSecond = false;
    setInterval(() => {
        showSecond = !showSecond;
        track.classList.toggle('show-second', showSecond);
    }, 3000);
}

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    scheduleAosInitialization();
    ensureTopRollingBarStyles();

    const hamburger = document.getElementById('hamburger');
    const navlist = document.getElementById('navlist');
    let overlay = document.querySelector('.overlay');
    let lottiePlayer = null;
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('main .background');

    function getRootPrefix() {
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('/projects/miscellenous/')) {
            return '../../';
        }
        if (path.includes('/projects/')) {
            return '../';
        }
        return '';
    }

    function getMatchColor() {
        if (!heroSection) {
            return '#ffffff';
        }

        const computed = window.getComputedStyle(heroSection).backgroundColor;
        if (!computed || computed === 'rgba(0, 0, 0, 0)') {
            return '#ffffff';
        }

        return computed;
    }

    function updateNavbarMatchColor() {
        if (!header || !navbar) {
            return;
        }

        const matchColor = getMatchColor();
        header.style.setProperty('--nav-match-color', matchColor);
        navbar.style.setProperty('--nav-match-color', matchColor);
    }

    function updateNavbarScrollState() {
        if (!header || !navbar) {
            return;
        }

        if (!heroSection) {
            header.classList.toggle('scrolled-nav', window.scrollY > 10);
            navbar.classList.toggle('scrolled-nav', window.scrollY > 10);
            return;
        }

        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const headerHeight = header.offsetHeight;
        const shouldUseWhite = heroBottom <= headerHeight;

        header.classList.toggle('scrolled-nav', shouldUseWhite);
        navbar.classList.toggle('scrolled-nav', shouldUseWhite);
    }

    // Replace hamburger visuals with Lottie animated icon (if present in workspace)
    function ensureLottieHamburger() {
        if (!hamburger) return;

        // compute JSON path relative to current page (projects pages live in /projects/)
        const path = (window.location.pathname || '').toLowerCase();
        const base = path.includes('/projects/') ? '../' : '';
        const lottieJson = base + 'animated icons/lottieflow-menu-nav-11-9-000000-easey.json';

        // load lottie-player webcomponent if not already loaded
        if (!window.customElements || !window.customElements.get('lottie-player')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
            script.async = true;
            script.onload = () => insertLottie();
            document.head.appendChild(script);
        } else {
            insertLottie();
        }

        function insertLottie() {
            // avoid replacing if already inserted
            if (hamburger.querySelector('lottie-player')) return;

            // clear existing content and insert the lottie player
            hamburger.innerHTML = '';
            const player = document.createElement('lottie-player');
            player.setAttribute('src', lottieJson);
            player.setAttribute('background', 'transparent');
            player.setAttribute('speed', '1');
            // do not autoplay or loop — we will control playback on toggle
            player.style.width = '36px';
            player.style.height = '36px';
            player.style.display = 'block';
            player.style.margin = '0';
            // expose reference for open/close control
            lottiePlayer = player;
            // ensure initial (hamburger) pose
            if (typeof player.stop === 'function') {
                try { player.stop(); } catch (e) { }
            }
            hamburger.appendChild(player);
        }
    }

    function ensureMobileGetInTouchInMenu() {
        if (!navlist) return;

        const existing = navlist.querySelector('.mobile-menu-cta');
        if (existing) return;

        const rootPrefix = getRootPrefix();
        const li = document.createElement('li');
        li.className = 'mobile-menu-cta';

        const link = document.createElement('a');
        link.href = rootPrefix + 'contact.html';
        link.className = 'get-in-touch';
        link.textContent = 'Get In Touch';

        li.appendChild(link);
        navlist.appendChild(li);
    }

    function ensureHomeLikeFooterEverywhere() {
        const rootPrefix = getRootPrefix();

        const footerSections = Array.from(document.querySelectorAll('.footer-info'));
        let footerInfo = footerSections[0] || document.createElement('section');
        footerInfo.className = 'footer-info';
        footerInfo.innerHTML = `
            <div class="footer-content">
                <div class="footer-column">
                    <h3>Contact Us</h3>
                    <div class="footer-contact-stack">
                        <div class="footer-contact-card">
                            <div class="footer-contact-icon" aria-hidden="true">✉</div>
                            <div class="footer-contact-body">
                                <a href="mailto:shriraminteriors@zohomail.in">shriraminteriors@zohomail.in</a>
                                <a href="mailto:shriraminteriorsolutions@gmail.com">shriraminteriorsolutions@gmail.com</a>
                            </div>
                        </div>
                        <div class="footer-contact-card">
                            <div class="footer-contact-icon" aria-hidden="true">☎</div>
                            <div class="footer-contact-body">
                                <a href="tel:+919310326361">+91 9310326361</a>
                                <a href="tel:+919911486680">+91 9911486680</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="${rootPrefix}portfolio.html">Portfolio</a></li>
                        <li><a href="${rootPrefix}services.html">Services</a></li>
                        <li><a href="${rootPrefix}about.html">About Us</a></li>
                        <li><a href="${rootPrefix}contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Recent Projects</h3>
                    <ul>
                        <li><a href="${rootPrefix}projects/project-big-cash.html">Big Cash</a></li>
                        <li><a href="${rootPrefix}projects/project-powertech.html">Powertech</a></li>
                        <li><a href="${rootPrefix}projects/project-clark.html">Clark Hotels</a></li>
                        <li><a href="${rootPrefix}projects/project-golden-tobie.html">Golden Tobie</a></li>
                        <li><a href="${rootPrefix}projects/project-jatan-singh.html">Jatan Singh Associates</a></li>
                        <li><a href="${rootPrefix}projects/project-mr-koti.html">Mr. Koti</a></li>
                        <li><a href="${rootPrefix}projects/project-shobha.html">Shobha</a></li>
                    </ul>
                </div>
                <div class="footer-column footer-map">
                    <h3>Our Location</h3>
                    <div class="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.8749666671165!2d77.05333267470363!3d28.453185275763133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1858ac54f913%3A0xdb199da20ae5ac0a!2s150%2C%20near%20ryan%20school%2C%20Urban%20Estate%2C%20Sector%2040%2C%20Gurugram%2C%20Haryana%20122003!5e0!3m2!1sen!2sin!4v1771662440143!5m2!1sen!2sin"
                            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        `;
        footerSections.slice(1).forEach(section => section.remove());

        const existingFooters = Array.from(document.querySelectorAll('footer'));
        let primaryFooter = null;

        if (existingFooters.length) {
            primaryFooter = existingFooters[existingFooters.length - 1];
            existingFooters.slice(0, -1).forEach(footerEl => footerEl.remove());
        } else {
            primaryFooter = document.createElement('footer');
            document.body.appendChild(primaryFooter);
        }

        primaryFooter.innerHTML = `
            <div>COPYRIGHT &copy; skninteriors.com 2026</div>
            <div>Managed by <a href="https://wa.me/919310326361" target="_blank" rel="noopener noreferrer">Shubham Sharma</a></div>
        `;

        if (!footerInfo.parentNode || footerInfo.nextElementSibling !== primaryFooter) {
            primaryFooter.parentNode.insertBefore(footerInfo, primaryFooter);
        }
    }

    /* Create compact magnify-to-search behavior for very small screens */
    function ensureMobileSearchToggle() {
        const navSearch = document.querySelector('.nav-search');
        if (!navSearch) return;
        if (navSearch.dataset._searchToggle === '1') return;
        navSearch.dataset._searchToggle = '1';

        const input = navSearch.querySelector('input[type="search"]');
        if (!input) return;
        input.classList.add('search-input');

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-search-toggle';
        toggle.setAttribute('aria-label', 'Open search');
        toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
        toggle.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:#fff;border:none;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:0;margin:0;';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'nav-search-close';
        closeBtn.setAttribute('aria-label', 'Close search');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:#fff;border:none;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:0;margin:0;font-size:20px;';

        // Insert toggle before input; append close button
        navSearch.insertBefore(toggle, input);
        navSearch.appendChild(closeBtn);

        // initial state: let CSS decide for larger screens, compact for small
        input.style.display = '';

        function openSearch() {
            navSearch.classList.add('expanded');
            input.style.display = 'block';
            closeBtn.style.display = 'inline-flex';
            toggle.style.display = 'none';
            try { input.focus(); } catch (e) {}
        }

        function closeSearch() {
            navSearch.classList.remove('expanded');
            closeBtn.style.display = 'none';
            if (window.matchMedia('(min-width:542px)').matches) {
                input.style.display = '';
            } else {
                input.style.display = 'none';
            }
            toggle.style.display = window.matchMedia('(max-width:541px)').matches ? 'inline-flex' : 'none';
            try { input.blur(); } catch (e) {}
        }

        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            // toggle opens the search; if already expanded do nothing (closing handled by outside click)
            if (!navSearch.classList.contains('expanded')) openSearch();
        });

        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeSearch();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navSearch.classList.contains('expanded')) {
                closeSearch();
            }
        });

        // Close the expanded search when clicking outside of it
        document.addEventListener('click', function(e) {
            if (!navSearch.classList.contains('expanded')) return;
            if (navSearch.contains(e.target)) return;
            // clicked outside
            closeSearch();
        });


        function handleResize() {
            const small = window.matchMedia('(max-width:541px)').matches;
            if (small) {
                // compact icon-only state on small screens
                input.style.display = 'none';
                toggle.style.display = 'inline-flex';
                closeBtn.style.display = 'none';
            } else {
                // larger screens: show input, hide toggle
                input.style.display = '';
                toggle.style.display = 'none';
                closeBtn.style.display = 'none';
                navSearch.classList.remove('expanded');
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();
    }

    /* Robust site search suggestions (always available) */
    function ensureSiteSearchGlobal() {
        const navSearch = document.querySelector('.nav-search');
        if (!navSearch) return;
        if (navSearch.dataset._siteSearchGlobal === '1') return;
        navSearch.dataset._siteSearchGlobal = '1';

        const input = navSearch.querySelector('input[type="search"]');
        if (!input) return;

        const form = navSearch.closest('form') || (navSearch.tagName === 'FORM' ? navSearch : null);
        const results = document.createElement('div');
        results.className = 'nav-search-results';
        results.style.display = 'none';
        // append to body to avoid transformed ancestor creating a containing block
        // which would break fixed positioning on pages that use transforms (AOS, etc)
        document.body.appendChild(results);

        const defaultPages = [
            'index.html',
            'about.html',
            'portfolio.html',
            'services.html',
            'contact.html',
            'residential.html',
            'commercial.html',
            'commercial-showrooms.html'
        ];

        function titleFromPath(path) {
            const file = (path.split('/').pop() || path).replace(/\.html?$/i, '');
            return file.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }

        const pageMap = new Map();
        defaultPages.forEach(p => pageMap.set(p, { url: p, title: titleFromPath(p) }));

        // Fetch sitemap and also fetch each page to build a simple content index
        let fullIndexReady = false;
        async function loadSitemapUrls() {
            try {
                const response = await fetch('sitemap.xml', { cache: 'no-cache' });
                if (!response.ok) return;
                const text = await response.text();
                const xml = new DOMParser().parseFromString(text, 'application/xml');
                const locs = Array.from(xml.querySelectorAll('url > loc')).map(n => (n.textContent || '').trim()).filter(Boolean);

                const parser = new DOMParser();
                for (const loc of locs) {
                    try {
                        const parsed = new URL(loc, window.location.origin);
                        let pathname = parsed.pathname || '';
                        if (pathname.startsWith('/')) pathname = pathname.slice(1);
                        if (!pathname || pathname.endsWith('/')) pathname += 'index.html';

                        if (!pageMap.has(pathname)) pageMap.set(pathname, { url: pathname, title: titleFromPath(pathname) });

                        // try to fetch page content to index body and meta description
                        try {
                            const resp = await fetch(pathname, { credentials: 'same-origin' });
                            if (!resp.ok) continue;
                            const docText = await resp.text();
                            const doc = parser.parseFromString(docText, 'text/html');
                            const title = (doc.querySelector('title') || { textContent: titleFromPath(pathname) }).textContent.trim();
                            const descMeta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
                            const description = descMeta ? (descMeta.getAttribute('content') || '') : '';
                            const body = doc.body ? doc.body.textContent.replace(/\s+/g, ' ').trim() : '';
                            pageMap.set(pathname, { url: pathname, title, description, body });
                        } catch (e) {
                            // ignore per-page fetch errors
                            continue;
                        }
                    } catch (e) {
                        if (!pageMap.has(loc)) {
                            pageMap.set(loc, { url: loc, title: titleFromPath(loc) });
                        }
                    }
                }

                fullIndexReady = true;
            } catch (e) {
                console.warn('Search sitemap load failed:', e);
            }
        }

        function getEntries() {
            return Array.from(pageMap.values());
        }

                function filterEntries(query) {
                        const q = (query || '').trim().toLowerCase();
                        if (!q) return [];

                        const scored = getEntries().map(entry => {
                                const title = (entry.title || '').toLowerCase();
                                const url = (entry.url || '').toLowerCase();
                                const body = (entry.body || '').toLowerCase();
                                const desc = (entry.description || '').toLowerCase();
                                let score = 0;
                                if (title.includes(q)) score += 80;
                                if (url.includes(q)) score += 30;
                                if (desc.includes(q)) score += 30;
                                const bodyIdx = body.indexOf(q);
                                if (bodyIdx !== -1) score += 40 + Math.max(0, 100 - Math.floor(bodyIdx/10));
                                if (title.startsWith(q)) score += 20;
                                return { ...entry, score, bodyIndex: bodyIdx };
                        }).filter(item => item.score > 0)
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 12);

                        return scored;
                }

        function render(entries) {
            results.innerHTML = '';
            if (!entries.length) {
                results.style.display = 'none';
                return;
            }

            const list = document.createElement('ul');
            list.className = 'nav-search-results-list';

            entries.forEach(entry => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.className = 'nav-search-result-link';
                link.href = entry.url;
                link.textContent = entry.title || entry.url;

                const hint = document.createElement('p');
                hint.className = 'nav-search-result-snippet';
                hint.textContent = entry.description || entry.url || '';

                // if we have a bodyIndex, show a snippet from body
                if (typeof entry.bodyIndex === 'number' && entry.bodyIndex >= 0 && entry.body) {
                    const start = Math.max(0, entry.bodyIndex - 40);
                    hint.textContent = (start > 0 ? '... ' : '') + (entry.body || '').substr(start, 140).trim() + (start + 140 < (entry.body||'').length ? ' ...' : '');
                }

                li.appendChild(link);
                li.appendChild(hint);
                list.appendChild(li);
            });

            results.appendChild(list);

            // position results: on very small screens (compact expanded search)
            // anchor the dropdown to the visible input so it appears directly
            // beneath the magnifier-expanded input. Otherwise center under header.
            try {
                const small = window.matchMedia('(max-width:541px)').matches;
                if (small && navSearch.classList.contains('expanded')) {
                    const inRect = input.getBoundingClientRect();
                    // anchor the dropdown directly to the input's left edge and
                    // match the input width (clamped to viewport with small padding)
                    results.style.position = 'fixed';
                    results.style.top = (inRect.bottom + 6) + 'px';
                    let w = Math.max(200, Math.min(inRect.width, window.innerWidth - 16));
                    let left = Math.max(8, Math.min(Math.round(inRect.left), window.innerWidth - w - 8));
                    results.style.width = w + 'px';
                    results.style.left = left + 'px';
                    results.style.transform = 'none';
                } else {
                    const header = document.querySelector('header');
                    if (header) {
                        const rect = header.getBoundingClientRect();
                        results.style.position = 'fixed';
                        results.style.top = (rect.bottom + 8) + 'px';
                        results.style.left = '50%';
                        results.style.transform = 'translateX(-50%)';
                        results.style.width = '';
                    }
                }
            } catch (e) {}

            results.style.display = 'block';
        }

        function runSearch() {
            const q = input.value || '';
            render(filterEntries(q));
        }

        input.addEventListener('input', runSearch);

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const entries = filterEntries(input.value || '');
                if (entries.length) {
                    window.location.href = entries[0].url;
                }
            });
        }

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const entries = filterEntries(input.value || '');
                if (entries.length) {
                    window.location.href = entries[0].url;
                }
            }
        });

        document.addEventListener('click', function(e) {
            if (navSearch.contains(e.target)) return;
            results.style.display = 'none';
        });

        // Apply query from URL if present (e.g., ?q=residential)
        try {
            const params = new URLSearchParams(window.location.search);
            const q = (params.get('q') || '').trim();
            if (q && !input.value) input.value = q;
            if (input.value.trim()) runSearch();
        } catch (e) {}

        // Enrich results with sitemap URLs in background
        loadSitemapUrls().then(() => {
            if (input.value.trim()) runSearch();
        });
    }

    // insert animated hamburger if available
    ensureLottieHamburger();
    ensureMobileGetInTouchInMenu();
    ensureHomeLikeFooterEverywhere();
    // setup compact search toggle for very small screens
    try { ensureMobileSearchToggle(); } catch (e) { /* ignore if not available */ }
    // setup site-wide client-side search suggestions
    try { ensureSiteSearchGlobal(); } catch (e) { console.warn('Search init failed:', e); }
    // Fallback: delegated handler in case the toggle's direct listener didn't attach
    // This ensures the magnifier button reliably opens the compact search on published sites
    document.addEventListener('click', function (ev) {
        try {
            var t = ev.target;
            if (!t || typeof t.closest !== 'function') return;
            var toggle = t.closest('.nav-search-toggle');
            if (!toggle) return;
            var navSearch = toggle.closest('.nav-search');
            if (!navSearch) return;
            // prevent the global click handler from immediately closing it
            ev.stopPropagation();
            if (navSearch.classList.contains('expanded')) return;
            navSearch.classList.add('expanded');
            var input = navSearch.querySelector('.search-input');
            var closeBtn = navSearch.querySelector('.nav-search-close');
            if (input) {
                input.style.display = 'block';
                try { input.focus(); } catch (e) {}
            }
            if (closeBtn) closeBtn.style.display = 'inline-flex';
            toggle.style.display = 'none';
        } catch (e) { /* silent fallback */ }
    });
    
    if (hamburger && navlist) {
        const dropdownItems = navlist.querySelectorAll('.dropdown');
        const dropdownToggles = navlist.querySelectorAll('.dropdown-toggle');

        function closeAllDropdowns() {
            dropdownItems.forEach(item => item.classList.remove('open'));
        }

        function closeMenu() {
            if (hamburger) hamburger.classList.remove('active');
            if (navlist) {
                navlist.classList.remove('active');
                navlist.style.top = '';
                navlist.style.height = '';
                const existingClose = navlist.querySelector('.close-btn');
                if (existingClose) existingClose.remove();
            }
            if (overlay) {
                overlay.classList.remove('active');
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                overlay = null;
            }
            // animate lottie to close (reverse) if available
            if (lottiePlayer && typeof lottiePlayer.setDirection === 'function') {
                try {
                    lottiePlayer.setDirection(-1);
                    lottiePlayer.play();
                } catch (e) { }
            }
            closeAllDropdowns();
        }

        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navlist.classList.toggle('active');

            // Ensure overlay exists and toggle it (use outer-scope variable)
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'overlay';
                document.body.appendChild(overlay);
                overlay.addEventListener('click', function() {
                    closeMenu();
                });
            }
            overlay.classList.toggle('active');

            // Ensure navlist uses CSS-controlled positioning (avoid forcing top/height)
            if (navlist.classList.contains('active')) {
                navlist.style.top = '';
                navlist.style.height = '';
                // animate lottie to open (forward) if available
                if (lottiePlayer && typeof lottiePlayer.setDirection === 'function') {
                    try {
                        lottiePlayer.setDirection(1);
                        lottiePlayer.play();
                    } catch (e) { }
                }
            } else {
                navlist.style.top = '';
                navlist.style.height = '';
                // animate lottie to close (reverse) if available
                if (lottiePlayer && typeof lottiePlayer.setDirection === 'function') {
                    try {
                        lottiePlayer.setDirection(-1);
                        lottiePlayer.play();
                    } catch (e) { }
                }
            }

            // do not add a duplicate in-menu close button; the hamburger controls closing

            if (!navlist.classList.contains('active')) {
                closeAllDropdowns();
            }
        });

    // --- Site search implementation ---
    function ensureSiteSearch() {
        const navSearch = document.querySelector('.nav-search');
        if (!navSearch) return;
        if (navSearch.dataset._siteSearch === '1') return;
        navSearch.dataset._siteSearch = '1';

        const input = navSearch.querySelector('input[type="search"]');
        if (!input) return;

        // results container
        const results = document.createElement('div');
        results.className = 'nav-search-results';
        results.setAttribute('aria-live', 'polite');
        results.style.display = 'none';
        // append to body so fixed positioning is relative to viewport (avoids
        // transformed ancestor issues on pages like the home page)
        document.body.appendChild(results);

        let indexReady = false;
        let siteIndex = null;
        const INDEX_KEY = 'siteSearchIndexV1';

        function loadIndexFromCache() {
            try {
                const raw = sessionStorage.getItem(INDEX_KEY);
                if (!raw) return null;
                return JSON.parse(raw);
            } catch (e) { return null; }
        }

        function saveIndexToCache(idx) {
            try { sessionStorage.setItem(INDEX_KEY, JSON.stringify(idx)); } catch (e) {}
        }

        async function buildIndex() {
            // try cache first
            const cached = loadIndexFromCache();
            if (cached && Array.isArray(cached) && cached.length) {
                siteIndex = cached;
                indexReady = true;
                return;
            }

            // fetch sitemap.xml and index listed pages
            try {
                const sitemapResp = await fetch('sitemap.xml');
                const sitemapText = await sitemapResp.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(sitemapText, 'application/xml');
                const locs = Array.from(xml.querySelectorAll('url > loc')).map(n => n.textContent.trim());
                const base = window.location.origin;
                const paths = locs.map(u => {
                    try {
                        const url = new URL(u);
                        return url.pathname + url.search + url.hash;
                    } catch (e) {
                        return u;
                    }
                }).filter(Boolean);

                const entries = [];
                for (const p of paths) {
                    try {
                        const resp = await fetch(p, { credentials: 'same-origin' });
                        if (!resp.ok) continue;
                        const text = await resp.text();
                        const doc = parser.parseFromString(text, 'text/html');
                        const title = (doc.querySelector('title') || { textContent: '' }).textContent.trim();
                        const descMeta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
                        const description = descMeta ? (descMeta.getAttribute('content') || '') : '';
                        // extract body text, limited length
                        const body = doc.body ? doc.body.textContent.replace(/\s+/g, ' ').trim() : '';
                        entries.push({ url: p, title, description, body });
                    } catch (e) {
                        // skip fetch errors
                        continue;
                    }
                }

                siteIndex = entries;
                saveIndexToCache(siteIndex);
                indexReady = true;
            } catch (e) {
                indexReady = false;
            }
        }

        function snippetFromText(text, idx, len = 120) {
            if (!text) return '';
            const start = Math.max(0, idx - Math.floor(len/2));
            const snip = text.substr(start, len).trim();
            return (start > 0 ? '... ' : '') + snip + (start + len < text.length ? ' ...' : '');
        }

        function searchIndex(q) {
            if (!indexReady || !siteIndex) return [];
            const term = q.trim().toLowerCase();
            if (!term) return [];
            const resultsArr = [];
            for (const e of siteIndex) {
                const title = (e.title || '').toLowerCase();
                const body = (e.body || '').toLowerCase();
                let score = 0;
                if (title.includes(term)) score += 50;
                const bodyIdx = body.indexOf(term);
                if (bodyIdx !== -1) score += 20 + Math.max(0, 100 - bodyIdx/10);
                if (e.description && e.description.toLowerCase().includes(term)) score += 10;
                if (score > 0) {
                    const snippet = bodyIdx !== -1 ? snippetFromText(e.body, bodyIdx) : (e.description || e.body.substr(0, 140));
                    resultsArr.push({ url: e.url, title: e.title || e.url, snippet, score });
                }
            }
            resultsArr.sort((a,b) => b.score - a.score);
            return resultsArr.slice(0, 12);
        }

        function renderResults(list) {
            results.innerHTML = '';
            if (!list || !list.length) {
                results.style.display = 'none';
                return;
            }
            const ul = document.createElement('ul');
            ul.className = 'nav-search-results-list';
            for (const r of list) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = r.url;
                a.textContent = r.title || r.url;
                a.className = 'nav-search-result-link';
                const p = document.createElement('p');
                p.className = 'nav-search-result-snippet';
                p.textContent = r.snippet || '';
                li.appendChild(a);
                li.appendChild(p);
                ul.appendChild(li);
            }
            results.appendChild(ul);
            // If compact mobile search is open, position results under the input
            try {
                const small = window.matchMedia('(max-width:541px)').matches;
                if (small && navSearch.classList.contains('expanded')) {
                    const inRect = input.getBoundingClientRect();
                    results.style.position = 'fixed';
                    results.style.top = (inRect.bottom + 6) + 'px';
                    let w = Math.max(200, Math.min(inRect.width, window.innerWidth - 16));
                    let left = Math.max(8, Math.min(Math.round(inRect.left), window.innerWidth - w - 8));
                    results.style.width = w + 'px';
                    results.style.left = left + 'px';
                    results.style.transform = 'none';
                } else {
                    // default: center under header
                    const header = document.querySelector('header');
                    if (header) {
                        const rect = header.getBoundingClientRect();
                        results.style.position = 'fixed';
                        results.style.top = (rect.bottom + 8) + 'px';
                        results.style.left = '50%';
                        results.style.transform = 'translateX(-50%)';
                        results.style.width = '';
                    }
                }
            } catch (e) {}
            results.style.display = 'block';
        }

        let pendingBuild = null;
        async function ensureIndexReady() {
            if (indexReady) return;
            if (!pendingBuild) pendingBuild = buildIndex();
            await pendingBuild;
        }

        let debounceTimer = null;
        // quick local search fallback (search current DOM anchors and visible text)
        function searchLocalQuick(q) {
            const term = q.trim().toLowerCase();
            if (!term) return [];
            const results = [];
            // search meaningful anchors (nav, footer quick links, project links)
            const anchors = Array.from(document.querySelectorAll('a'));
            const seen = new Set();
            for (const a of anchors) {
                const text = (a.textContent || '').trim();
                const href = a.getAttribute('href') || '';
                if (!text && !href) continue;
                const key = (text + '|' + href).toLowerCase();
                if (seen.has(key)) continue;
                seen.add(key);
                const idx = text.toLowerCase().indexOf(term);
                let score = 0;
                if (idx !== -1) score += 40 + Math.max(0, 100 - idx);
                if (href.toLowerCase().includes(term)) score += 10;
                if (score > 0) {
                    results.push({ url: href || '#', title: text || href, snippet: '', score });
                }
            }
            // also check current document title and body
            const bodyText = (document.body && document.body.textContent) ? document.body.textContent.replace(/\s+/g,' ').trim() : '';
            const bidx = bodyText.toLowerCase().indexOf(term);
            if (bidx !== -1) {
                results.push({ url: window.location.pathname, title: document.title || window.location.pathname, snippet: snippetFromText(bodyText, bidx), score: 20 });
            }
            results.sort((a,b) => b.score - a.score);
            return results.slice(0, 8);
        }

        input.addEventListener('input', function(e) {
            const q = input.value || '';
            if (!q.trim()) {
                renderResults([]);
                return;
            }
            // show quick local results immediately while index builds
            if (!indexReady) {
                const quick = searchLocalQuick(q);
                renderResults(quick);
                ensureIndexReady().then(() => {
                    const res = searchIndex(q);
                    renderResults(res);
                });
                return;
            }
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const res = searchIndex(q);
                renderResults(res);
            }, 220);
        });

        // Enter key opens first result
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const q = input.value || '';
                const res = searchIndex(q);
                if (res && res.length) {
                    window.location.href = res[0].url;
                }
            }
        });

        // Prevent the surrounding form from submitting and refreshing the page
        const form = navSearch.closest('form') || (navSearch.tagName === 'FORM' ? navSearch : null);
        if (form) {
            form.addEventListener('submit', function(ev) {
                ev.preventDefault();
            });
        }

        // hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (results.contains(e.target) || navSearch.contains(e.target)) return;
            results.style.display = 'none';
        });

        // show indexing hint while building
        function showIndexingHint() {
            try {
                results.innerHTML = '<div class="nav-search-indexing">Indexing site…</div>';
                results.style.display = 'block';
            } catch (e) {}
        }

        // prebuild index in background and show hint
        if (!indexReady) showIndexingHint();
        ensureIndexReady().then(() => {
            // hide indexing hint if it was shown
            if (results && results.querySelector('.nav-search-indexing')) {
                results.innerHTML = '';
                results.style.display = 'none';
            }
            console.log('site search index ready', siteIndex ? siteIndex.length : 0);
        }).catch(err => {
            console.warn('site search index failed', err);
        });

        // If the input already has a value (eg. ?q=...), trigger a search immediately
        const initialQ = (input.value || '').trim();
        if (initialQ) {
            // show quick local suggestions first
            const quick = searchLocalQuick ? searchLocalQuick(initialQ) : [];
            renderResults(quick);
            ensureIndexReady().then(() => {
                const res = searchIndex(initialQ);
                renderResults(res);
                // prefer opening the search UI so user sees results
                try { navSearch.classList.add('expanded'); } catch (e) {}
            });
        }
    }

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                const parentDropdown = this.closest('.dropdown');
                const wasOpen = parentDropdown.classList.contains('open');

                closeAllDropdowns();

                if (!wasOpen) {
                    parentDropdown.classList.add('open');
                }
            });
        });

        // Close menu when a link is clicked
        const navLinks = navlist.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (this.classList.contains('dropdown-toggle')) {
                    return;
                }

                closeAllDropdowns();
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navlist.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav) {
                closeAllDropdowns();
            }
            
            if (!isClickInsideNav && !isClickOnHamburger && navlist.classList.contains('active')) {
                closeMenu();
            }
        });
    }
});

// Keep CSS variable `--header-offset` in sync with the header height so
// fixed header doesn't overlap page content on small screens.
function updateHeaderOffsetVar() {
    try {
        var header = document.querySelector('header');
        if (!header) return;
        var h = header.offsetHeight || 88;
        document.documentElement.style.setProperty('--header-offset', h + 'px');
    } catch (e) { }
}

window.addEventListener('load', updateHeaderOffsetVar);
window.addEventListener('resize', function() {
    // debounce a bit
    if (window.__headerOffsetResizeTimer) clearTimeout(window.__headerOffsetResizeTimer);
    window.__headerOffsetResizeTimer = setTimeout(function() {
        updateHeaderOffsetVar();
    }, 120);
});
document.addEventListener('DOMContentLoaded', updateHeaderOffsetVar);

document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    if (!counters.length) {
        return;
    }

    function animateCounter(counter) {
        if (counter.dataset.animated === 'true') {
            return;
        }

        const target = parseInt(counter.dataset.target, 10) || 0;
        const suffix = counter.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        counter.dataset.animated = 'true';

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = `${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = `${target}${suffix}`;
            }
        }

        requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => observer.observe(counter));
    } else {
        counters.forEach(counter => animateCounter(counter));
    }
});

// Initialize sliders when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
});

function initializeSliders() {
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        let currentIndex = 0;
        const images = slider.querySelectorAll('.slider-item');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        // Create dots for each image
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = slider.querySelectorAll('.dot');
        
        function showSlide(index) {
            // Wrap around if index is out of bounds
            if (index >= images.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = images.length - 1;
            } else {
                currentIndex = index;
            }
            
            // Hide all images
            images.forEach(img => img.style.display = 'none');
            
            // Show current image
            images[currentIndex].style.display = 'block';
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }
        
        function goToSlide(index) {
            showSlide(index);
        }
        
        function nextSlide() {
            showSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            showSlide(currentIndex - 1);
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Initialize first slide
        showSlide(0);
    });
}
