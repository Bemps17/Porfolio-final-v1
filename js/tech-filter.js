// Technology Filter System
class TechFilter {
    constructor() {
        this.allTechs = new Set();
        this.selectedTechs = new Set();
        this.projectsByTech = {};
        this.init();
    }

    init() {
        this.buildTechMap();
        this.createFilterUI();
        this.addEventListeners();
    }

    // Build mapping of technologies to projects
    buildTechMap() {
        const projects = [
            { id: 'coursfull', techs: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Dev Web'] },
            { id: 'snippetbank', techs: ['JavaScript', 'LocalStorage', 'Syntax Highlighting', 'PWA', 'Dev Web'] },
            { id: 'ahistory', techs: ['JavaScript', 'Canvas', 'Maps API', 'Timeline', 'Dev Web'] },
            { id: 'pooltimer', techs: ['JavaScript', 'Web Audio API', 'LocalStorage', 'PWA', 'Dev Web'] },
            { id: 'pooltools', techs: ['Canvas', 'JavaScript', 'Physics Engine', 'Animations', 'Dev Web'] },
            { id: 'poolscore', techs: ['WebSocket', 'JavaScript', 'Chart.js', 'Real-time', 'Dev Web'] },
            { id: 'mapointeuse', techs: ['PWA', 'JavaScript', 'PDF Export', 'LocalStorage', 'Dev Web'] },
            { id: 'juriaide', techs: ['JavaScript', 'Search Engine', 'Database', 'Knowledge Base', 'Dev Web'] },
            { id: 'vacanceslr', techs: ['Weather API', 'Maps API', 'JavaScript', 'Recommendations', 'Dev Web'] },
            { id: 'workfloow', techs: ['Drag & Drop', 'WebSocket', 'Chart.js', 'JavaScript', 'Kanban', 'Dev Web'] },
            { id: 'chronorganizer', techs: ['Web Audio API', 'Notifications', 'JavaScript', 'Timer', 'Dev Web'] },
            { id: 'eisenhowermatrixv1', techs: ['Drag & Drop', 'JavaScript', 'CSS Animations', 'Priority', 'Dev Web'] },
            { id: 'suivijardin', techs: ['Camera API', 'Weather API', 'JavaScript', 'Database', 'Dev Web'] },
            { id: 'guidestream', techs: ['Video API', 'WebRTC', 'JavaScript', 'Streaming', 'Dev Web'] },
            { id: 'flutterisation', techs: ['Flutter', 'Dart', 'Code Generation', 'Mobile', 'Dev Web'] },
            { id: 'seo-checking', techs: ['SEO Analysis', 'JavaScript', 'Chart.js', 'Reports', 'Dev Web'] }
        ];

        // Add design tools mapping
        const designProjects = {
            'Figma': ['coursfull', 'snippetbank', 'workfloow', 'chronorganizer'],
            'Photoshop': ['coursfull', 'snippetbank', 'vacanceslr', 'guidestream'],
            'Illustrator': ['coursfull', 'workfloow', 'chronorganizer', 'flutterisation'],
            'WordPress': ['coursfull', 'juriaide', 'vacanceslr'],
            'CRM': ['workfloow', 'chronorganizer', 'suivijardin'],
            'LinkedIn': ['workfloow', 'juriaide', 'seo-checking'],
            'IA Tools': ['guidestream', 'seo-checking', 'vacanceslr', 'workfloow'],
            'Excel': ['mapointeuse', 'poolscore', 'suivijardin']
        };

        // Build tech map
        projects.forEach(project => {
            project.techs.forEach(tech => {
                this.allTechs.add(tech);
                if (!this.projectsByTech[tech]) {
                    this.projectsByTech[tech] = [];
                }
                this.projectsByTech[tech].push(project.id);
            });
        });

        // Add design tools to map
        Object.entries(designProjects).forEach(([tech, projectIds]) => {
            this.allTechs.add(tech);
            this.projectsByTech[tech] = projectIds;
        });

        console.log('✅ Tech filter initialized with', this.allTechs.size, 'technologies');
    }

    createFilterUI() {
        const filterContainer = document.getElementById('techFilterContainer');
        if (!filterContainer) return;

        const sortedTechs = Array.from(this.allTechs).sort();
        
        filterContainer.innerHTML = `
            <div class="flex flex-wrap gap-2 mb-6">
                <button class="tech-filter-btn px-4 py-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all" data-tech="all">
                    Tous les projets
                </button>
                ${sortedTechs.map(tech => `
                    <button class="tech-filter-btn px-4 py-2 rounded-full border-2 border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all" data-tech="${tech}">
                        ${tech}
                    </button>
                `).join('')}
            </div>
        `;
    }

    addEventListeners() {
        const filterButtons = document.querySelectorAll('.tech-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tech = e.target.getAttribute('data-tech');
                this.filterByTech(tech);
            });
        });
    }

    filterByTech(tech) {
        // Update button states
        const filterButtons = document.querySelectorAll('.tech-filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-orange-500', 'text-white', 'border-orange-500');
            btn.classList.add('border-gray-600', 'text-gray-300');
        });

        // Highlight selected button
        const selectedBtn = document.querySelector(`[data-tech="${tech}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('bg-orange-500', 'text-white', 'border-orange-500');
            selectedBtn.classList.remove('border-gray-600', 'text-gray-300');
        }

        // Get projects to show
        let projectsToShow = [];
        if (tech === 'all') {
            projectsToShow = Array.from(document.querySelectorAll('[data-project-id]')).map(el => el.getAttribute('data-project-id'));
        } else {
            projectsToShow = this.projectsByTech[tech] || [];
        }

        // Filter project cards
        this.filterProjectCards(projectsToShow);
    }

    filterProjectCards(projectsToShow) {
        const projectCards = document.querySelectorAll('[data-project-id]');
        
        projectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            if (projectsToShow.includes(projectId)) {
                card.style.display = '';
                card.classList.add('fade-in');
                setTimeout(() => card.classList.remove('fade-in'), 300);
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`📊 Showing ${projectsToShow.length} projects for selected technology`);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new TechFilter();
});
