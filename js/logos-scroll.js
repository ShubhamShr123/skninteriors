// Infinite scroll carousel cloning - handles logos and projects
// Deferred load: runs after DOM is ready
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarouselCloning);
    } else {
        initCarouselCloning();
    }
    
    function initCarouselCloning() {
        // Clone logos for infinite scroll
        const logosTrack = document.getElementById('logos-track');
        if (logosTrack) {
            const originalContent = logosTrack.innerHTML;
            logosTrack.innerHTML = originalContent + originalContent + originalContent;
        }
        
        // Clone projects for infinite scroll
        const projectsTrack = document.getElementById('projects-track');
        if (projectsTrack) {
            const originalContent = projectsTrack.innerHTML;
            projectsTrack.innerHTML = originalContent + originalContent + originalContent;
        }
    }
})();
