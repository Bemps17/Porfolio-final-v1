// Project Modal System
class ProjectModal {
    constructor() {
        this.modal = null;
        this.currentProject = null;
        this.projects = {
            coursfull: {
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
            snippetbank: {
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
            ahistory: {
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
            pooltimer: {
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
            pooltools: {
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
            poolscore: {
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
            mapointeuse: {
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
            juriaide: {
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
            vacanceslr: {
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
            workfloow: {
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
            chronorganizer: {
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
            eisenhowermatrixv1: {
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
            suivijardin: {
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
            guidestream: {
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
            flutterisation: {
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
            'seo-checking': {
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
        };
        this.init();
    }

    init() {
        this.createModal();
        this.addEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="projectModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300">
                        <div class="relative">
                            <!-- Close button -->
                            <button onclick="closeProjectModal()" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                                <i class="fas fa-times"></i>
                            </button>
                            
                            <!-- Header with cover image -->
                            <div class="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
                                <img id="modalCoverImage" src="" alt="" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div class="absolute bottom-6 left-6 right-6">
                                    <h2 id="modalProjectName" class="text-3xl sm:text-4xl font-bold text-white mb-2"></h2>
                                    <p id="modalProjectDescription" class="text-gray-200 text-lg"></p>
                                </div>
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
                                        <button onclick="previousScreenshot()" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <button onclick="nextScreenshot()" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
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
        });
    }

    open(projectId) {
        this.currentProject = this.projects[projectId];
        if (!this.currentProject) return;

        this.currentScreenshotIndex = 0;
        this.populateModal();
        this.showModal();
    }

    close() {
        this.hideModal();
    }

    populateModal() {
        // Basic info
        document.getElementById('modalProjectName').textContent = this.currentProject.name;
        document.getElementById('modalProjectDescription').textContent = this.currentProject.description;
        document.getElementById('modalProjectUrl').href = this.currentProject.url;
        
        // Cover image
        const coverImagePath = `assets/projects/${this.getProjectId()}/screenshots/cover.jpg`;
        document.getElementById('modalCoverImage').src = coverImagePath;
        document.getElementById('modalCoverImage').alt = this.currentProject.name;

        // Screenshots
        this.populateScreenshots();
        
        // Features
        const featuresContainer = document.getElementById('modalProjectFeatures');
        featuresContainer.innerHTML = this.currentProject.features.map(feature => `
            <li class="flex items-start gap-2 text-gray-300">
                <i class="fas fa-check text-orange-400 mt-1"></i>
                <span>${feature}</span>
            </li>
        `).join('');

        // Technologies
        const techContainer = document.getElementById('modalProjectTechnologies');
        techContainer.innerHTML = this.currentProject.technologies.map(tech => `
            <span class="px-3 py-1 glass-orange rounded-full text-sm text-white">${tech}</span>
        `).join('');
    }

    populateScreenshots() {
        const carousel = document.getElementById('screenshotCarousel');
        const indicators = document.getElementById('carouselIndicators');
        
        carousel.innerHTML = this.currentProject.screenshots.map((screenshot, index) => `
            <div class="w-full flex-shrink-0">
                <img src="assets/projects/${this.getProjectId()}/screenshots/${screenshot}.png" 
                     alt="${this.currentProject.name} - ${screenshot}" 
                     class="w-full h-auto rounded-xl"
                     onerror="this.src='assets/projects/${this.getProjectId()}/screenshots/${screenshot}.jpg'">
            </div>
        `).join('');

        indicators.innerHTML = this.currentProject.screenshots.map((_, index) => `
            <button onclick="goToScreenshot(${index})" class="w-2 h-2 rounded-full transition-colors ${
                index === 0 ? 'bg-orange-500' : 'bg-gray-600 hover:bg-gray-500'
            }"></button>
        `).join('');

        this.updateCarouselPosition();
    }

    getProjectId() {
        return Object.keys(this.projects).find(key => this.projects[key] === this.currentProject);
    }

    showModal() {
        this.modal.classList.remove('hidden');
        setTimeout(() => {
            this.modal.classList.remove('opacity-0');
            this.modal.querySelector('.transform').classList.remove('scale-95');
            this.modal.querySelector('.transform').classList.add('scale-100');
        }, 10);
    }

    hideModal() {
        this.modal.classList.add('opacity-0');
        this.modal.querySelector('.transform').classList.remove('scale-100');
        this.modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            this.modal.classList.add('hidden');
        }, 300);
    }

    updateCarouselPosition() {
        const carousel = document.getElementById('screenshotCarousel');
        carousel.style.transform = `translateX(-${this.currentScreenshotIndex * 100}%)`;
        
        // Update indicators
        const indicators = document.getElementById('carouselIndicators').children;
        Array.from(indicators).forEach((indicator, index) => {
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
        this.currentScreenshotIndex = (this.currentScreenshotIndex + 1) % this.currentProject.screenshots.length;
        this.updateCarouselPosition();
    }

    previousScreenshot() {
        this.currentScreenshotIndex = (this.currentScreenshotIndex - 1 + this.currentProject.screenshots.length) % this.currentProject.screenshots.length;
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

function nextScreenshot() {
    if (projectModal) {
        projectModal.nextScreenshot();
    }
}

function previousScreenshot() {
    if (projectModal) {
        projectModal.previousScreenshot();
    }
}

function goToScreenshot(index) {
    if (projectModal) {
        projectModal.goToScreenshot(index);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    projectModal = new ProjectModal();
});
