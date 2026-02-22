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
        }

        .top-rolling-track.show-second {
            transform: translateY(-32px);
        }

        .top-rolling-item {
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 0 10px;
            color: #2f2f2f;
            font-family: "Poppins", sans-serif;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            width: max-content;
            max-width: calc(100vw - 16px);
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid rgba(74, 124, 89, 0.18);
            border-radius: 999px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
        }

        .top-rolling-icons {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .top-rolling-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
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
    const baseNavbarHeight = 55;
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
    if (navlist) {
        if (window.innerWidth <= 1110) {
            navlist.style.top = `${totalHeaderHeight}px`;
            navlist.style.height = `calc(100vh - ${totalHeaderHeight}px)`;
        } else {
            navlist.style.top = '';
            navlist.style.height = '';
        }
    }

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
                        <a class="top-rolling-icon" href="mailto:skninteriors@outlook.com" aria-label="Email us" title="Email us">✉</a>
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
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('main .background');

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

    updateNavbarMatchColor();
    updateNavbarScrollState();
    window.addEventListener('scroll', updateNavbarScrollState);
    window.addEventListener('resize', () => {
        updateNavbarMatchColor();
        updateNavbarScrollState();
    });
    
    if (hamburger && navlist) {
        const dropdownItems = navlist.querySelectorAll('.dropdown');
        const dropdownToggles = navlist.querySelectorAll('.dropdown-toggle');

        function closeAllDropdowns() {
            dropdownItems.forEach(item => item.classList.remove('open'));
        }

        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navlist.classList.toggle('active');

            if (!navlist.classList.contains('active')) {
                closeAllDropdowns();
            }
        });

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
                hamburger.classList.remove('active');
                navlist.classList.remove('active');
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
                hamburger.classList.remove('active');
                navlist.classList.remove('active');
            }
        });
    }
});

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
