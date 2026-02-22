function ensureTopRollingBarStyles() {
    if (document.getElementById('top-rolling-bar-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'top-rolling-bar-styles';
    style.textContent = `
        .top-rolling-bar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1100;
            width: 100%;
            height: 30px;
            border-radius: 0 0 14px 14px;
            background: rgba(245, 242, 239, 0.97);
            border: none;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.10);
            overflow: hidden;
            backdrop-filter: blur(4px);
        }

        @media only screen and (min-width: 1101px) {
            .top-rolling-bar {
                left: 0;
                transform: none;
                width: 100vw;
                max-width: 100vw;
                border: none;
                box-shadow: none;
            }

            .top-rolling-viewport {
                width: 100%;
            }

            .top-rolling-track,
            .top-rolling-track.show-second {
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr;
                width: 100%;
                transition: none;
                transform: none !important;
            }

            .top-rolling-item {
                grid-area: 1 / 1;
                width: 100%;
                animation-duration: 8s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                will-change: transform, opacity;
            }

            .top-rolling-item:first-child {
                animation-name: rollingMessageOne;
            }

            .top-rolling-item:last-child {
                animation-name: rollingMessageTwo;
            }

            @keyframes rollingMessageOne {
                0% {
                    transform: translateX(100vw);
                    opacity: 0;
                }
                8% {
                    transform: translateX(0);
                    opacity: 1;
                }
                45% {
                    transform: translateX(0);
                    opacity: 1;
                }
                58% {
                    transform: translateX(-100vw);
                    opacity: 0;
                }
                100% {
                    transform: translateX(-100vw);
                    opacity: 0;
                }
            }

            @keyframes rollingMessageTwo {
                0% {
                    transform: translateX(100vw);
                    opacity: 0;
                }
                50% {
                    transform: translateX(100vw);
                    opacity: 0;
                }
                58% {
                    transform: translateX(0);
                    opacity: 1;
                }
                95% {
                    transform: translateX(0);
                    opacity: 1;
                }
                100% {
                    transform: translateX(-100vw);
                    opacity: 0;
                }
            }
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
            transform: translateY(-30px);
        }

        .top-rolling-item {
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 0 12px;
            color: #2f2f2f;
            font-family: "Poppins", sans-serif;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
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
            width: 22px;
            height: 22px;
            border-radius: 50%;
            text-decoration: none;
            background: #4A7C59;
            color: #ffffff;
            font-size: 12px;
            line-height: 1;
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .top-rolling-icon:hover {
            transform: translateY(-1px);
            background-color: #3a6048;
        }

        @media only screen and (max-width: 768px) {
            .top-rolling-bar {
                height: 28px;
                border-radius: 0 0 12px 12px;
            }

            .top-rolling-track.show-second {
                transform: translateY(-28px);
            }

            .top-rolling-item {
                height: 28px;
                font-size: 10px;
                gap: 8px;
                padding: 0 8px;
            }

            .top-rolling-icon {
                width: 18px;
                height: 18px;
                font-size: 10px;
            }
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
    createTopRollingBar();

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
