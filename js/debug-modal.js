// Debug script to check modal functionality
console.log('🔍 Debug Modal Script Loaded');

// Check if project cards exist
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('[data-project-id]');
    console.log(`Found ${projectCards.length} project cards`);
    
    // Check if modal exists
    const modal = document.getElementById('projectModal');
    if (modal) {
        console.log('✅ Modal found in DOM');
    } else {
        console.log('❌ Modal not found in DOM');
    }
    
    // Check screenshot directories
    const projects = ['coursfull', 'snippetbank', 'ahistory', 'pooltimer', 'pooltools', 'poolscore', 'mapointeuse', 'juriaide', 'vacanceslr', 'workfloow', 'chronorganizer', 'eisenhowermatrixv1', 'suivijardin', 'guidestream', 'flutterisation', 'seo-checking'];
    
    projects.forEach(project => {
        console.log(`Checking ${project}:`);
        ['cover.jpg', 'section1.png', 'section2.png', 'section3.png'].forEach(file => {
            const img = new Image();
            img.onload = () => console.log(`  ✅ ${file} exists`);
            img.onerror = () => console.log(`  ❌ ${file} not found`);
            img.src = `assets/projects/${project}/screenshots/${file}`;
        });
    });
});

// Test modal opening
window.testModal = function(projectId) {
    console.log(`Testing modal for ${projectId}`);
    if (window.openProjectModal) {
        window.openProjectModal(projectId);
    } else {
        console.log('❌ openProjectModal function not available');
    }
};
