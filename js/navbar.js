// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
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
