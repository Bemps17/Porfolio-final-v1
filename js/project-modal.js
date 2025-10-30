// Project Modal System
class ProjectModal {
    constructor() {
        this.modal = null;
        this.currentProject = null;
        this.currentProjectIndex = 0;
        this.projects = [
            {
                id: 'coursfull',
                name: 'CoursFull',
                url: 'https://coursfull.netlify.app/',
                description: 'Plateforme d\'apprentissage en ligne avec gestion complète des cours et des étudiants.',
                features: [
                    'Gestion des cours et modules',
                    'Système d\'inscription et suivi des étudiants',
                    'Interface d\'administration complète',
                    'Tableaux de bord analytics',
                    'Support multimédia pour les contenus'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Design responsive', 'Interface utilisateur moderne'],
                screenshots: ['home', 'dashboard', 'courses']
            },
            {
                id: 'snippetbank',
                name: 'SnippetBank',
                url: 'https://snippetbank.netlify.app/',
                description: 'Banque de snippets de code pour développeurs avec recherche et organisation.',
                features: [
                    'Stockage de snippets de code',
                    'Système de recherche avancé',
                    'Tags et catégories',
                    'Syntax highlighting',
                    'Export/import des snippets',
                    'Interface sombre/clair'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Syntax highlighting library', 'LocalStorage'],
                screenshots: ['home', 'editor', 'search']
            },
            {
                id: 'ahistory',
                name: 'AHistory',
                url: 'https://ahistory.netlify.app/',
                description: 'Application interactive de visualisation historique avec timeline.',
                features: [
                    'Timeline historique interactive',
                    'Cartes géographiques animées',
                    'Contenus multimédias intégrés',
                    'Système de recherche par période',
                    'Mode éducation avec quiz',
                    'Favoris et parcours personnalisés'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Visualisation libraries', 'API cartographiques'],
                screenshots: ['timeline', 'map', 'event']
            },
            {
                id: 'pooltimer',
                name: 'PoolTimer',
                url: 'https://pooltimer.netlify.app/',
                description: 'Chronomètre professionnel pour joueurs de billard anglais.',
                features: [
                    'Chronomètre précis au centième',
                    'Statistiques de jeu en temps réel',
                    'Mode tournoi et entraînement',
                    'Historique des parties',
                    'Interface tactile optimisée',
                    'Export des statistiques'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API', 'LocalStorage'],
                screenshots: ['timer', 'stats', 'history']
            },
            {
                id: 'pooltools',
                name: 'PoolTools',
                url: 'https://pooltools.netlify.app/',
                description: 'Suite complète d\'outils pour passionnés de billard anglais.',
                features: [
                    'Calculateur de trajectoires',
                    'Gestionnaire de tournois',
                    'Simulateur de coups',
                    'Base de données de techniques',
                    'Mode entraînement guidé',
                    'Partage de configurations'
                ],
                technologies: ['HTML5 Canvas', 'JavaScript avancé', 'CSS3 animations', 'Algorithmes de physique'],
                screenshots: ['simulator', 'tournament', 'techniques']
            },
            {
                id: 'poolscore',
                name: 'PoolScore',
                url: 'https://poolscore.netlify.app/',
                description: 'Système de notation et suivi pour compétitions de billard.',
                features: [
                    'Saisie de scores en temps réel',
                    'Tableaux de classement automatiques',
                    'Statistiques détaillées par joueur',
                    'Gestion de tournois multi-tables',
                    'Export des résultats',
                    'Mode spectateur avec affichage'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'WebSocket', 'Chart.js'],
                screenshots: ['scoreboard', 'ranking', 'tournament']
            },
            {
                id: 'mapointeuse',
                name: 'MaPointeuse',
                url: 'https://mapointeuse.netlify.app/',
                description: 'Application de pointeuse digitale pour gestion du temps de travail.',
                features: [
                    'Pointage par empreinte digitale (simulation)',
                    'Calcul automatique des heures',
                    'Gestion des pauses et congés',
                    'Rapports hebdomadaires/mensuels',
                    'Export en PDF/Excel',
                    'Mode hors ligne avec synchronisation'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'PWA', 'API de génération PDF'],
                screenshots: ['clock', 'reports', 'dashboard']
            },
            {
                id: 'juriaide',
                name: 'JuriAide',
                url: 'https://juriaide.netlify.app/',
                description: 'Assistant juridique numérique pour particuliers et professionnels.',
                features: [
                    'Base de connaissances juridiques',
                    'Générateur de documents',
                    'Calculateur de droits',
                    'Suivi des démarches',
                    'Chatbot juridique',
                    'Mises à jour légales'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Base de données structurée', 'Système de recherche'],
                screenshots: ['home', 'documents', 'assistance']
            },
            {
                id: 'vacanceslr',
                name: 'VacancesLR',
                url: 'https://vacanceslr.netlify.app/',
                description: 'Planificateur intelligent de vacances avec intégration météo et activités.',
                features: [
                    'Planification d\'itinéraires détaillés',
                    'Intégration météo en temps réel',
                    'Suggestions d\'activités locales',
                    'Gestion de budget voyage',
                    'Partage avec les voyageurs',
                    'Carnet de voyage numérique'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'APIs météo et cartographiques', 'Algorithmes de recommandation'],
                screenshots: ['planning', 'weather', 'activities']
            },
            {
                id: 'workfloow',
                name: 'WorkFloow',
                url: 'https://workfloow.netlify.app/',
                description: 'Plateforme de gestion de flux de travail et collaboration d\'équipe.',
                features: [
                    'Gestion de projets Kanban',
                    'Assignation des tâches',
                    'Suivi du temps de travail',
                    'Communication intégrée',
                    'Tableaux de bord analytics',
                    'Intégrations tierces'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Drag & Drop', 'WebSocket', 'Chart.js'],
                screenshots: ['kanban', 'dashboard', 'team']
            },
            {
                id: 'chronorganizer',
                name: 'ChronOrganizer',
                url: 'https://chronorganizer.netlify.app/',
                description: 'Organisateur temporel avancé avec système Pomodoro intégré.',
                features: [
                    'Timer Pomodoro personnalisable',
                    'Planification de tâches',
                    'Statistiques de productivité',
                    'Mode focus et breaks',
                    'Synchronisation multi-appareils',
                    'Thèmes et sons relaxants'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API', 'Notifications push'],
                screenshots: ['timer', 'tasks', 'stats']
            },
            {
                id: 'eisenhowermatrixv1',
                name: 'Eisenhower Matrix V1',
                url: 'https://eisenhowermatrixv1.netlify.app/',
                description: 'Application de gestion des priorités selon la matrice d\'Eisenhower.',
                features: [
                    'Matrice visuelle des tâches',
                    'Glisser-déposer intuitif',
                    'Catégorisation automatique',
                    'Suivi des tâches complétées',
                    'Export des priorités',
                    'Mode équipe et partage'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Drag & Drop API', 'Animations CSS'],
                screenshots: ['matrix', 'tasks', 'analytics']
            },
            {
                id: 'suivijardin',
                name: 'SuiviJardin',
                url: 'https://suivijardin.netlify.app/',
                description: 'Application de suivi et gestion pour passionnés de jardinage.',
                features: [
                    'Suivi des plantations et croissance',
                    'Calendrier d\'arrosage et entretien',
                    'Alertes météo et conseils',
                    'Journal de jardin photo',
                    'Base de données plantes',
                    'Partage avec la communauté'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'APIs météo et botaniques', 'Camera API'],
                screenshots: ['garden', 'plants', 'calendar']
            },
            {
                id: 'guidestream',
                name: 'GuideStream',
                url: 'https://guidestream.netlify.app/',
                description: 'Plateforme de streaming et guides multimédias interactifs.',
                features: [
                    'Streaming vidéo HD',
                    'Guides interactifs synchronisés',
                    'Système de chapitrage',
                    'Notes et bookmarks',
                    'Ressources téléchargeables',
                    'Mode apprentissage progressif'
                ],
                technologies: ['HTML5 Video API', 'JavaScript moderne', 'WebRTC', 'Design cinématographique'],
                screenshots: ['player', 'guides', 'library']
            },
            {
                id: 'flutterisation',
                name: 'Flutterisation',
                url: 'https://flutterisation.netlify.app/',
                description: 'Outils et ressources pour développement Flutter et applications multiplateformes.',
                features: [
                    'Générateur de code Flutter',
                    'Templates d\'interface',
                    'Bibliothèque de composants',
                    'Guides et tutoriels',
                    'Preview en temps réel',
                    'Export multiplateforme'
                ],
                technologies: ['Flutter/Dart', 'Web technologies', 'Code generation', 'Material Design'],
                screenshots: ['editor', 'templates', 'preview']
            },
            {
                id: 'seo-checking',
                name: 'SEO Checking',
                url: 'https://seo-checking.netlify.app/',
                description: 'Outil complet d\'analyse et optimisation SEO pour sites web.',
                features: [
                    'Audit SEO complet',
                    'Analyse de mots-clés',
                    'Suivi des positions',
                    'Optimisation on-page',
                    'Rapports détaillés',
                    'Suggestions d\'amélioration'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'APIs d\'analyse SEO', 'Visualisation de données'],
                screenshots: ['dashboard', 'audit', 'keywords']
            }
        ];
        this.init();
    }

    init() {
        this.createModal();
        this.addEventListeners();
        console.log('✅ Project Modal initialized');
    }

    createModal() {
        console.log('🔨 Creating modal...');
        const modalHTML = `
            <div id="projectModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300">
                <!-- Project Navigation Arrows - Outside Modal -->
                <button id="prevProjectBtn" class="fixed left-8 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-2xl hover:scale-110 hidden sm:flex">
                    <i class="fas fa-angle-double-left text-2xl"></i>
                </button>
                <button id="nextProjectBtn" class="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-2xl hover:scale-110 hidden sm:flex">
                    <i class="fas fa-angle-double-right text-2xl"></i>
                </button>
                
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300 relative">
                        <div class="relative">
                            <!-- Header with cover image -->
                            <div class="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
                                <img id="modalCoverImage" src="" alt="" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div class="absolute bottom-6 left-6 right-6">
                                    <h2 id="modalProjectName" class="text-3xl sm:text-4xl font-bold text-white mb-2"></h2>
                                    <p id="modalProjectDescription" class="text-gray-200 text-lg"></p>
                                    <!-- Project counter -->
                                    <p id="projectCounter" class="text-gray-300 text-sm mt-2"></p>
                                </div>
                                <!-- Close button -->
                                <button id="modalCloseButton" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <!-- Content -->
                            <div class="p-6 sm:p-8">
                                <!-- Live link -->
                                <div class="mb-8">
                                    <a id="modalProjectUrl" href="" target="_blank" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                        <i class="fas fa-external-link-alt"></i>
                                        Voir le projet en ligne
                                    </a>
                                </div>
                                
                                <!-- Screenshots carousel -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-bold text-white mb-4">Captures d'écran</h3>
                                    <div class="relative">
                                        <div class="overflow-hidden rounded-xl">
                                            <div id="screenshotCarousel" class="flex transition-transform duration-300">
                                                <!-- Screenshots will be inserted here -->
                                            </div>
                                        </div>
                                        <!-- Carousel controls -->
                                        <button id="carouselPrevButton" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <button id="carouselNextButton" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    <!-- Carousel indicators -->
                                    <div id="carouselIndicators" class="flex justify-center gap-2 mt-4">
                                        <!-- Indicators will be inserted here -->
                                    </div>
                                </div>
                                
                                <!-- Features -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-bold text-white mb-4">Fonctionnalités principales</h3>
                                    <ul id="modalProjectFeatures" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <!-- Features will be inserted here -->
                                    </ul>
                                </div>
                                
                                <!-- Technologies -->
                                <div>
                                    <h3 class="text-xl font-bold text-white mb-4">Technologies utilisées</h3>
                                    <div id="modalProjectTechnologies" class="flex flex-wrap gap-2">
                                        <!-- Technologies will be inserted here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('projectModal');
        this.currentScreenshotIndex = 0;
        console.log('✅ Modal created and added to DOM');
    }

    addEventListeners() {
        // Close modal on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.close();
            }
            // Arrow keys for project navigation
            if (!this.modal.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    this.previousProject();
                } else if (e.key === 'ArrowRight') {
                    this.nextProject();
                }
            }
        });

        // Close button
        const closeButton = document.getElementById('modalCloseButton');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        // Project navigation buttons
        const prevBtn = document.getElementById('prevProjectBtn');
        const nextBtn = document.getElementById('nextProjectBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousProject();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextProject();
            });
        }

        // Carousel controls
        const prevButton = document.getElementById('carouselPrevButton');
        const nextButton = document.getElementById('carouselNextButton');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.previousScreenshot();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.nextScreenshot();
            });
        }

        // Add swipe support for mobile
        this.addSwipeSupport();
    }

    open(projectId) {
        console.log(`📂 Opening modal for project: ${projectId}`);
        
        // Find project by ID in the array
        this.currentProjectIndex = this.projects.findIndex(p => p.id === projectId);
        if (this.currentProjectIndex === -1) {
            console.error(`❌ Project ${projectId} not found`);
            return;
        }
        
        this.currentProject = this.projects[this.currentProjectIndex];
        this.currentScreenshotIndex = 0;
        console.log(`✅ Found project at index ${this.currentProjectIndex}: ${this.currentProject.name}`);
        
        this.populateModal();
        this.showModal();
    }

    close() {
        this.hideModal();
    }

    populateModal() {
        // Update project counter
        const counter = document.getElementById('projectCounter');
        if (counter) {
            counter.textContent = `Projet ${this.currentProjectIndex + 1} / ${this.projects.length}`;
        }

        // Populate project details
        document.getElementById('modalProjectName').textContent = this.currentProject.name;
        document.getElementById('modalProjectDescription').textContent = this.currentProject.description;
        document.getElementById('modalProjectUrl').href = this.currentProject.url;
        document.getElementById('modalCoverImage').src = `assets/projects/${this.getProjectId()}/screenshots/cover.jpg`;
        document.getElementById('modalCoverImage').alt = this.currentProject.name;
        
        this.populateFeatures();
        this.populateTechnologies();
        this.populateScreenshots();
    }

    populateFeatures() {
        const featuresContainer = document.getElementById('modalProjectFeatures');
        featuresContainer.innerHTML = this.currentProject.features.map(feature => `
            <li class="flex items-start gap-2 text-gray-300">
                <i class="fas fa-check text-orange-400 mt-1"></i>
                <span>${feature}</span>
            </li>
        `).join('');
    }

    populateTechnologies() {
        const techContainer = document.getElementById('modalProjectTechnologies');
        techContainer.innerHTML = this.currentProject.technologies.map(tech => `
            <span class="px-3 py-1 glass-orange rounded-full text-sm text-white">${tech}</span>
        `).join('');
    }

    populateScreenshots() {
        const carousel = document.getElementById('screenshotCarousel');
        const indicators = document.getElementById('carouselIndicators');
        
        const projectId = this.getProjectId();
        
        // Define all possible files to check
        const possibleFiles = [
            'cover.jpg',
            'section1.png', 
            'section2.png', 
            'section3.png'
        ];
        
        let loadedCount = 0;
        const validScreenshots = [];
        
        // Check each file
        possibleFiles.forEach((filename, index) => {
            const img = new Image();
            img.onload = () => {
                validScreenshots.push(filename);
                loadedCount++;
                
                // When all images are checked, populate the carousel
                if (loadedCount === possibleFiles.length) {
                    this.populateCarousel(validScreenshots, projectId);
                }
            };
            img.onerror = () => {
                loadedCount++;
                
                // When all images are checked, populate the carousel
                if (loadedCount === possibleFiles.length) {
                    this.populateCarousel(validScreenshots, projectId);
                }
            };
            img.src = `assets/projects/${projectId}/screenshots/${filename}`;
        });
    }
    
    populateCarousel(screenshots, projectId) {
        const carousel = document.getElementById('screenshotCarousel');
        const indicators = document.getElementById('carouselIndicators');
        
        if (screenshots.length === 0) {
            console.log(`No screenshots found for ${projectId}`);
            return;
        }
        
        console.log(`Found ${screenshots.length} screenshots for ${projectId}:`, screenshots);
        
        // Populate carousel with found images
        carousel.innerHTML = screenshots.map((filename, index) => {
            const screenshotName = filename.replace('.jpg', '').replace('.png', '');
            return `
                <div class="w-full flex-shrink-0">
                    <img src="assets/projects/${projectId}/screenshots/${filename}" 
                         alt="${this.currentProject.name} - ${screenshotName}" 
                         class="w-full h-auto rounded-xl"
                         loading="lazy">
                </div>
            `;
        }).join('');

        // Populate indicators
        indicators.innerHTML = screenshots.map((_, index) => `
            <button data-screenshot-index="${index}" class="w-2 h-2 rounded-full transition-colors ${
                index === 0 ? 'bg-orange-500' : 'bg-gray-600 hover:bg-gray-500'
            }"></button>
        `).join('');

        // Add click listeners to indicators
        indicators.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-screenshot-index'));
                this.goToScreenshot(index);
            });
        });

        this.updateCarouselPosition();
    }

    getProjectId() {
        return this.currentProject.id;
    }

    // Project navigation methods
    nextProject() {
        this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
        this.currentProject = this.projects[this.currentProjectIndex];
        this.currentScreenshotIndex = 0;
        this.populateModal();
    }

    previousProject() {
        this.currentProjectIndex = (this.currentProjectIndex - 1 + this.projects.length) % this.projects.length;
        this.currentProject = this.projects[this.currentProjectIndex];
        this.currentScreenshotIndex = 0;
        this.populateModal();
    }

    // Swipe support for mobile
    addSwipeSupport() {
        if (typeof Hammer === 'undefined') return;
        
        const modalContent = this.modal.querySelector('.glass');
        if (!modalContent) return;
        
        const hammer = new Hammer(modalContent);
        
        // Horizontal swipe for project navigation
        hammer.on('swipeleft', () => {
            this.nextProject();
        });
        
        hammer.on('swiperight', () => {
            this.previousProject();
        });
    }

    showModal() {
        this.modal.classList.remove('hidden');
        // Show project navigation buttons
        const prevBtn = document.getElementById('prevProjectBtn');
        const nextBtn = document.getElementById('nextProjectBtn');
        if (prevBtn) prevBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.remove('hidden');
        
        // Force a reflow to ensure the transition works properly
        this.modal.offsetHeight;
        setTimeout(() => {
            this.modal.classList.remove('opacity-0');
            this.modal.querySelector('.transform').classList.remove('scale-95');
            this.modal.querySelector('.transform').classList.add('scale-100');
        }, 50);
    }

    hideModal() {
        this.modal.classList.add('opacity-0');
        this.modal.querySelector('.transform').classList.remove('scale-100');
        this.modal.querySelector('.transform').classList.add('scale-95');
        
        // Hide project navigation buttons
        const prevBtn = document.getElementById('prevProjectBtn');
        const nextBtn = document.getElementById('nextProjectBtn');
        
        setTimeout(() => {
            this.modal.classList.add('hidden');
            if (prevBtn) prevBtn.classList.add('hidden');
            if (nextBtn) nextBtn.classList.add('hidden');
        }, 300);
    }

    updateCarouselPosition() {
        const carousel = document.getElementById('screenshotCarousel');
        if (!carousel) return;
        
        carousel.style.transform = `translateX(-${this.currentScreenshotIndex * 100}%)`;
        
        // Update indicators
        const indicators = document.getElementById('carouselIndicators');
        if (!indicators) return;
        
        const indicatorButtons = indicators.children;
        Array.from(indicatorButtons).forEach((indicator, index) => {
            if (index === this.currentScreenshotIndex) {
                indicator.classList.remove('bg-gray-600', 'hover:bg-gray-500');
                indicator.classList.add('bg-orange-500');
            } else {
                indicator.classList.remove('bg-orange-500');
                indicator.classList.add('bg-gray-600', 'hover:bg-gray-500');
            }
        });
    }

    nextScreenshot() {
        const indicators = document.getElementById('carouselIndicators');
        if (!indicators) return;
        
        const totalScreenshots = indicators.children.length;
        this.currentScreenshotIndex = (this.currentScreenshotIndex + 1) % totalScreenshots;
        this.updateCarouselPosition();
    }

    previousScreenshot() {
        const indicators = document.getElementById('carouselIndicators');
        if (!indicators) return;
        
        const totalScreenshots = indicators.children.length;
        this.currentScreenshotIndex = (this.currentScreenshotIndex - 1 + totalScreenshots) % totalScreenshots;
        this.updateCarouselPosition();
    }

    goToScreenshot(index) {
        this.currentScreenshotIndex = index;
        this.updateCarouselPosition();
    }
}

// Initialize the modal system
let projectModal;

// Global functions for onclick handlers
function openProjectModal(projectId) {
    if (!projectModal) {
        projectModal = new ProjectModal();
    }
    projectModal.open(projectId);
}

function closeProjectModal() {
    if (projectModal) {
        projectModal.close();
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    projectModal = new ProjectModal();
});
