// Infinite logo scroll - automatically clones logos for seamless loop
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLogoScroll);
    } else {
        initLogoScroll();
    }
    
    function initLogoScroll() {
        const logosTrack = document.getElementById('logos-track');
        
        if (logosTrack) {
            // Clone the logos multiple times for seamless infinite scroll
            const originalContent = logosTrack.innerHTML;
            // Clone 3 times for ultra-smooth infinite scrolling
            logosTrack.innerHTML = originalContent + originalContent + originalContent;
            
            console.log('Logo scroll initialized - logos cloned successfully');
        } else {
            console.error('logos-track element not found');
        }
    }
})();
