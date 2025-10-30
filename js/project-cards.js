// Project Cards Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to all project cards
    const projectCards = document.querySelectorAll('[data-project-id]');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            if (projectId && window.openProjectModal) {
                window.openProjectModal(projectId);
            }
        });
    });
});
