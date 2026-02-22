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
    
    // Zoom functionality variables
    let scale = 1;
    let lastScale = 1;
    let posX = 0;
    let posY = 0;
    let lastPosX = 0;
    let lastPosY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastTapTime = 0;
    let initialDistance = 0;

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
        
        // Reset zoom when changing images
        resetZoom();
    }
    
    function resetZoom() {
        scale = 1;
        lastScale = 1;
        posX = 0;
        posY = 0;
        lastPosX = 0;
        lastPosY = 0;
        applyTransform();
    }
    
    function applyTransform() {
        modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }
    
    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
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
        resetZoom();
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
        if (event.touches.length === 2) {
            // Pinch zoom start
            initialDistance = getDistance(event.touches);
            lastScale = scale;
        } else if (event.touches.length === 1) {
            // Check for double tap
            const currentTime = new Date().getTime();
            const tapGap = currentTime - lastTapTime;
            
            if (tapGap < 300 && tapGap > 0) {
                // Double tap detected
                event.preventDefault();
                if (scale > 1) {
                    resetZoom();
                } else {
                    scale = 2.5;
                    applyTransform();
                }
                lastTapTime = 0;
            } else {
                lastTapTime = currentTime;
                
                if (scale > 1) {
                    // Start dragging when zoomed
                    isDragging = true;
                    startX = event.touches[0].clientX - posX;
                    startY = event.touches[0].clientY - posY;
                } else {
                    // Swipe navigation when not zoomed
                    touchStartX = event.touches[0].clientX;
                }
            }
        }
    }, { passive: false });

    modal.addEventListener('touchmove', (event) => {
        if (event.touches.length === 2) {
            // Pinch zoom
            event.preventDefault();
            const currentDistance = getDistance(event.touches);
            scale = Math.min(Math.max(1, lastScale * (currentDistance / initialDistance)), 5);
            applyTransform();
        } else if (isDragging && event.touches.length === 1) {
            // Pan when zoomed
            event.preventDefault();
            posX = event.touches[0].clientX - startX;
            posY = event.touches[0].clientY - startY;
            applyTransform();
        }
    }, { passive: false });

    modal.addEventListener('touchend', (event) => {
        if (event.touches.length === 0) {
            if (isDragging) {
                isDragging = false;
                lastPosX = posX;
                lastPosY = posY;
            } else if (scale === 1 && touchStartX !== 0) {
                // Swipe navigation when not zoomed
                touchEndX = event.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;

                if (Math.abs(deltaX) >= 50) {
                    if (deltaX < 0) {
                        showNext();
                    } else {
                        showPrev();
                    }
                }
                touchStartX = 0;
            }
        }
    });
    
    // Mouse wheel zoom for desktop
    modalImg.addEventListener('wheel', (event) => {
        if (!modal.classList.contains('open')) {
            return;
        }
        event.preventDefault();
        
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        scale = Math.min(Math.max(1, scale * delta), 5);
        applyTransform();
    }, { passive: false });
}
