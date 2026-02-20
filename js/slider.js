// Initialize sliders when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeGalleryModal();
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

function initializeGalleryModal() {
    const grid = document.querySelector('.project-gallery-grid');
    const modal = document.querySelector('.gallery-modal');
    if (!grid || !modal) {
        return;
    }

    const items = Array.from(grid.querySelectorAll('.gallery-item'));
    const images = items.map(item => {
        const img = item.querySelector('img');
        return {
            src: img ? img.src : '',
            alt: img ? img.alt : 'Project image'
        };
    });

    const modalImg = modal.querySelector('.gallery-modal-image');
    const counter = modal.querySelector('.gallery-counter');
    const prevBtn = modal.querySelector('.gallery-prev');
    const nextBtn = modal.querySelector('.gallery-next');
    const closeBtn = modal.querySelector('.gallery-close');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateModal(index) {
        if (!images.length) {
            return;
        }

        if (index >= images.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = images.length - 1;
        } else {
            currentIndex = index;
        }

        modalImg.src = images[currentIndex].src;
        modalImg.alt = images[currentIndex].alt;
        counter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    function openModal(index) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        updateModal(index);
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    function showNext() {
        updateModal(currentIndex + 1);
    }

    function showPrev() {
        updateModal(currentIndex - 1);
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowRight') {
            showNext();
        } else if (event.key === 'ArrowLeft') {
            showPrev();
        }
    });

    modal.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    modal.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < 50) {
            return;
        }

        if (deltaX < 0) {
            showNext();
        } else {
            showPrev();
        }
    });
}
