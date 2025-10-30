// Blog JavaScript - Version avec données pré-générées
class BlogManager {
    constructor() {
        this.articles = [];
        this.currentCategory = 'all';
        this.currentSource = 'all';
        this.articlesPerPage = 12;
        this.currentPage = 1;
        this.rssArticles = [];
        this.rssMetadata = {};
        
        // Categories
        this.categories = {
            all: { name: 'Toutes', icon: 'fas fa-globe' },
            tech: { name: 'Tech', icon: 'fas fa-microchip' },
            design: { name: 'Design', icon: 'fas fa-palette' },
            dev: { name: 'Dev', icon: 'fas fa-code' },
            social: { name: 'Social', icon: 'fas fa-users' },
            podcasts: { name: 'Podcasts', icon: 'fas fa-podcast' }
        };

        // Sources RSS
        this.sources = {
            all: { name: 'Toutes les sources', icon: 'fas fa-globe' },
            'github-trending': { name: 'GitHub Trending', icon: 'fab fa-github' },
            'the-verge': { name: 'The Verge', icon: 'fas fa-laptop' },
            'wired': { name: 'Wired', icon: 'fas fa-wifi' },
            'techcrunch': { name: 'TechCrunch', icon: 'fas fa-rocket' },
            'ars-technica': { name: 'Ars Technica', icon: 'fas fa-flask' },
            'numerama': { name: 'Numerama', icon: 'fas fa-robot' },
            'zdnet': { name: 'ZDNet', icon: 'fas fa-server' },
            'le-journal-du-geek': { name: 'Le Journal du Geek', icon: 'fas fa-gamepad' },
            'les-numeriques': { name: 'Les Numériques', icon: 'fas fa-mobile-alt' },
            'engadget': { name: 'Engadget', icon: 'fas fa-camera' },
            'toms-hardware': { name: "Tom's Hardware", icon: 'fas fa-microchip' },
            'gizmodo': { name: 'Gizmodo', icon: 'fas fa-tablet-alt' },
            'dev-to': { name: 'Dev.to', icon: 'fab fa-dev' },
            'hacker-news': { name: 'Hacker News', icon: 'fab fa-hacker-news' },
            'reddit-programming': { name: 'Reddit Programming', icon: 'fab fa-reddit' },
            'reddit-webdev': { name: 'Reddit WebDev', icon: 'fab fa-reddit' },
            'reddit-design': { name: 'Reddit Design', icon: 'fab fa-reddit' },
            'reddit-javascript': { name: 'Reddit JavaScript', icon: 'fab fa-reddit' },
            'developpez-com': { name: 'Developpez.com', icon: 'fas fa-code' },
            'graphiste-com': { name: 'Graphiste.com', icon: 'fas fa-palette' },
            'venturebeat': { name: 'VentureBeat', icon: 'fas fa-rocket' },
            'freecodecamp': { name: 'freeCodeCamp', icon: 'fab fa-free-code-camp' },
            'css-tricks': { name: 'CSS-Tricks', icon: 'fas fa-code' },
            'webdesigner-depot': { name: 'Webdesigner Depot', icon: 'fas fa-palette' },
            'frontend-focus': { name: 'Frontend Focus', icon: 'fas fa-envelope' },
            'ux-design-cc': { name: 'UX Design.cc', icon: 'fas fa-palette' },
            'stack-overflow-blog': { name: 'Stack Overflow Blog', icon: 'fab fa-stack-overflow' },
            'node-weekly': { name: 'Node Weekly', icon: 'fab fa-node-js' },
            'smashing-magazine': { name: 'Smashing Magazine', icon: 'fas fa-code' },
            'shoptalk-show': { name: 'ShopTalk Show', icon: 'fas fa-podcast' },
            'javascript-weekly': { name: 'JavaScript Weekly', icon: 'fab fa-js' },
            'a-list-apart': { name: 'A List Apart', icon: 'fas fa-code' },
            'github': { name: 'GitHub', icon: 'fab fa-github' },
            'abduzeedo': { name: 'Abduzeedo', icon: 'fas fa-palette' }
        };
    }

    async init() {
        this.setupEventListeners();
        this.initTheme();
        this.showLoadingState();
        
        try {
            // Charger les données RSS pré-générées
            await this.loadProductionRSSData();
            
            // Attendre un peu que le DOM soit complètement prêt
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Mettre à jour les compteurs après le chargement
            console.log('🔄 Mise à jour finale des compteurs...');
            this.updateCategoryStats(this.rssArticles);
            this.updateSourceStats(this.rssArticles);
            
        } catch (error) {
            console.warn('⚠️ Données RSS non disponibles, affichage du message d\'erreur');
            this.showErrorState();
        }
        
        this.hideLoadingState();
    }

    async loadProductionRSSData() {
        try {
            console.log('📡 Chargement des données RSS pré-générées...');
            
            // Charger les données JSON statiques
            const response = await fetch('./data/articles.json');
            if (!response.ok) {
                throw new Error('Fichier de données RSS non trouvé');
            }
            
            const data = await response.json();
            this.rssArticles = data.articles || [];
            this.rssMetadata = data.metadata || {
                lastUpdated: new Date().toISOString(),
                total: this.rssArticles.length,
                sources: ['TechCrunch', 'Wired', 'The Verge', 'Ars Technica', 'Numerama', 'ZDNet', 'Le Journal du Geek', 'Smashing Magazine', 'A List Apart', 'CSS-Tricks', 'UX Design.cc', 'Dev.to', 'Hacker News', 'Reddit Programming'],
                categories: ['tech', 'design', 'dev', 'social', 'podcasts']
            };
            
            console.log(`✅ ${this.rssArticles.length} articles RSS chargés`);
            
            // Afficher les articles
            this.displayRSSArticles(this.rssArticles);
            this.updateRSSStats(this.rssMetadata);
            
            // Mettre à jour l'heure de synchronisation
            this.updateLastSyncTime(this.rssMetadata.lastUpdated);
            
            // Forcer la mise à jour des compteurs
            console.log('🔄 Mise à jour forcée des compteurs...');
            this.updateCategoryStats(this.rssArticles);
            this.updateSourceStats(this.rssArticles);
            
        } catch (error) {
            console.error('❌ Erreur de chargement des données RSS:', error);
            throw error;
        }
    }

    displayRSSArticles(articles) {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;
        
        // Vider le contenu existant
        grid.innerHTML = '';
        
        // Filtrer les articles par catégorie ET par source
        let filteredArticles = articles;
        
        if (this.currentCategory !== 'all') {
            filteredArticles = filteredArticles.filter(article => article.category === this.currentCategory);
        }
        
        if (this.currentSource !== 'all') {
            filteredArticles = filteredArticles.filter(article => {
                const sourceKey = this.getSourceKey(article.source);
                return sourceKey === this.currentSource;
            });
        }
        
        // Trier par date (plus récent d'abord)
        filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Afficher les articles
        const articlesToShow = filteredArticles.slice(0, this.articlesPerPage);
        
        if (articlesToShow.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-newspaper text-4xl text-gray-600 mb-4"></i>
                    <p class="text-gray-400">Aucun article trouvé pour cette combinaison</p>
                </div>
            `;
            return;
        }
        
        articlesToShow.forEach(article => {
            const articleCard = this.createRSSArticleCard(article);
            grid.appendChild(articleCard);
        });
        
        // Mettre à jour le bouton "charger plus"
        this.updateLoadMoreButton(filteredArticles);
        
        // Mettre à jour les statistiques de catégories (avec tous les articles)
        this.updateCategoryStats(this.rssArticles);
        
        // Mettre à jour les statistiques de sources (avec tous les articles)
        this.updateSourceStats(this.rssArticles);
    }

    updateLoadMoreButton(filteredArticles) {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        const remainingArticles = filteredArticles.length - this.articlesPerPage;
        
        if (remainingArticles > 0) {
            loadMoreBtn.classList.remove('hidden');
            loadMoreBtn.innerHTML = `
                <i class="fas fa-plus mr-2"></i>
                Charger plus d'articles (${Math.min(remainingArticles, 12)} restants)
            `;
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    }

    createRSSArticleCard(article) {
        const card = document.createElement('article');
        card.className = 'blog-card bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800';
        
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const categoryIcon = this.categories[article.category]?.icon || 'fas fa-newspaper';
        const categoryName = this.categories[article.category]?.name || article.category;
        
        card.innerHTML = `
            <div class="relative">
                ${article.image ? `
                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                ` : `
                <div class="w-full h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <i class="fas fa-newspaper text-white text-4xl"></i>
                </div>
                `}
                <div class="absolute top-2 left-2">
                    <span class="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                        ${article.source}
                    </span>
                </div>
                <div class="absolute top-2 right-2">
                    <span class="px-2 py-1 bg-gray-900 bg-opacity-75 text-white text-xs rounded-full">
                        <i class="${categoryIcon} mr-1"></i>${categoryName}
                    </span>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-gray-400">
                        <i class="far fa-calendar mr-1"></i>
                        ${publishedDate}
                    </span>
                    <span class="text-sm px-2 py-1 bg-gray-800 text-gray-300 rounded">
                        ${article.language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                    </span>
                </div>
                <h3 class="text-xl font-semibold mb-3 line-clamp-2">
                    <a href="${article.url}" target="_blank" class="hover:text-orange-400 transition-colors">
                        ${article.title}
                    </a>
                </h3>
                <p class="text-gray-400 mb-4 line-clamp-3">
                    ${article.summary || article.content ? article.content.substring(0, 150) + '...' : 'Article de veille technologique'}
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-1">
                        ${(article.tags || []).slice(0, 3).map(tag => 
                            `<span class="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">${tag}</span>`
                        ).join('')}
                    </div>
                    <a href="${article.url}" target="_blank" class="text-orange-400 hover:text-orange-300 transition-colors">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    updateRSSStats(metadata) {
        const statsElements = {
            'sources-count': metadata.sources ? metadata.sources.length : 14,
            'categories-count': metadata.categories ? metadata.categories.length : 5,
            'articles-count': metadata.total || this.rssArticles.length
        };
        
        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateLastSyncTime(lastUpdated) {
        const syncElement = document.getElementById('last-sync');
        if (syncElement && lastUpdated) {
            const syncDate = new Date(lastUpdated).toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            syncElement.textContent = `Sync: ${syncDate}`;
        }
    }

    updateCategoryStats(articles) {
        const categoryCounts = {};
        
        console.log('📊 Mise à jour des statistiques de catégories...');
        
        Object.keys(this.categories).forEach(category => {
            if (category !== 'all') {
                categoryCounts[category] = articles.filter(article => article.category === category).length;
                console.log(`   ${category}: ${categoryCounts[category]} articles`);
            }
        });
        
        // Mettre à jour les boutons de catégorie avec les comptes
        Object.entries(categoryCounts).forEach(([category, count]) => {
            const button = document.querySelector(`[data-category="${category}"]`);
            if (button) {
                const countElement = button.querySelector('.category-count');
                if (countElement) {
                    countElement.textContent = count;
                    console.log(`✅ Compteur catégorie ${category} mis à jour: ${count}`);
                } else {
                    console.warn(`⚠️ Compteur non trouvé pour catégorie ${category}`);
                }
            } else {
                console.warn(`⚠️ Bouton non trouvé pour catégorie ${category}`);
            }
        });
    }

    updateSourceStats(articles) {
        const sourceCounts = {};
        
        console.log('📊 Mise à jour des statistiques de sources...');
        
        // Compter les articles par source
        Object.keys(this.sources).forEach(sourceKey => {
            if (sourceKey !== 'all') {
                sourceCounts[sourceKey] = articles.filter(article => {
                    const articleSourceKey = this.getSourceKey(article.source);
                    return articleSourceKey === sourceKey;
                }).length;
                if (sourceCounts[sourceKey] > 0) {
                    console.log(`   ${sourceKey}: ${sourceCounts[sourceKey]} articles`);
                }
            }
        });
        
        // Mettre à jour les boutons de source avec les comptes
        Object.entries(sourceCounts).forEach(([sourceKey, count]) => {
            const button = document.querySelector(`[data-source="${sourceKey}"]`);
            if (button) {
                const countElement = button.querySelector('.source-count');
                if (countElement) {
                    countElement.textContent = count;
                    console.log(`✅ Compteur source ${sourceKey} mis à jour: ${count}`);
                } else {
                    console.warn(`⚠️ Compteur non trouvé pour source ${sourceKey}`);
                }
            } else {
                console.warn(`⚠️ Bouton non trouvé pour source ${sourceKey}`);
            }
        });
    }

    getSourceKey(sourceName) {
        // Convertir le nom de la source en clé pour le filtrage
        const sourceMap = {
            'GitHub Trending': 'github-trending',
            'The Verge': 'the-verge',
            'Wired': 'wired',
            'TechCrunch': 'techcrunch',
            'Ars Technica': 'ars-technica',
            'Numerama': 'numerama',
            'ZDNet': 'zdnet',
            'Le Journal du Geek': 'le-journal-du-geek',
            'Les Numériques': 'les-numeriques',
            'Engadget': 'engadget',
            "Tom's Hardware": 'toms-hardware',
            'Gizmodo': 'gizmodo',
            'Dev.to': 'dev-to',
            'Hacker News': 'hacker-news',
            'Reddit Programming': 'reddit-programming',
            'Reddit r/programming': 'reddit-programming',
            'Reddit WebDev': 'reddit-webdev',
            'Reddit r/webdev': 'reddit-webdev',
            'Reddit Design': 'reddit-design',
            'Reddit r/design': 'reddit-design',
            'Reddit r/javascript': 'reddit-javascript',
            'Developpez.com': 'developpez-com',
            'Graphiste.com': 'graphiste-com',
            'VentureBeat': 'venturebeat',
            'freeCodeCamp': 'freecodecamp',
            'CSS-Tricks': 'css-tricks',
            'Webdesigner Depot': 'webdesigner-depot',
            'Frontend Focus': 'frontend-focus',
            'UX Design.cc': 'ux-design-cc',
            'Stack Overflow Blog': 'stack-overflow-blog',
            'Node Weekly': 'node-weekly',
            'Smashing Magazine': 'smashing-magazine',
            'ShopTalk Show': 'shoptalk-show',
            'JavaScript Weekly': 'javascript-weekly',
            'A List Apart': 'a-list-apart',
            'GitHub': 'github',
            'Abduzeedo': 'abduzeedo'
        };
        
        return sourceMap[sourceName] || sourceName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/reddit-r\//g, 'reddit-');
    }

    setupEventListeners() {
        // Filtres de catégorie
        document.querySelectorAll('[data-category]').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });
        
        // Filtres de source
        document.querySelectorAll('[data-source]').forEach(button => {
            button.addEventListener('click', (e) => {
                const source = e.currentTarget.dataset.source;
                this.filterBySource(source);
            });
        });
        
        // Bouton "charger plus"
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }
        
        // Bouton "actualiser"
        const refreshBtn = document.getElementById('refresh-articles');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshArticles();
            });
        }
        
        // Boutons de réinitialisation
        const resetFiltersBtn = document.getElementById('reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetAllFilters();
            });
        }
        
        const clearSourceFilterBtn = document.getElementById('clear-source-filter');
        if (clearSourceFilterBtn) {
            clearSourceFilterBtn.addEventListener('click', () => {
                this.clearSourceFilter();
            });
        }
        
        // Gestion du panneau de paramètres
        const settingsToggle = document.getElementById('settings-toggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', () => {
                this.toggleSettingsPanel();
            });
        }
        
        const closeSettings = document.getElementById('close-settings');
        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                this.closeSettingsPanel();
            });
        }
        
        // Sélecteur articles par page
        const articlesPerPageSelect = document.getElementById('articles-per-page');
        if (articlesPerPageSelect) {
            articlesPerPageSelect.addEventListener('change', (e) => {
                this.articlesPerPage = parseInt(e.target.value);
                this.displayRSSArticles(this.rssArticles);
            });
        }
        
        // Fermer le panneau en cliquant sur l'overlay
        const overlay = document.getElementById('settings-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSettingsPanel();
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        // Mettre à jour le bouton actif
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active', 'bg-orange-500', 'text-white');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-orange-500', 'text-white');
        }
        
        // Réafficher les articles
        this.displayRSSArticles(this.rssArticles);
    }

    filterBySource(source) {
        this.currentSource = source;
        
        // Mettre à jour le bouton actif
        document.querySelectorAll('[data-source]').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
        });
        
        const activeBtn = document.querySelector(`[data-source="${source}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-blue-500', 'text-white');
        }
        
        // Réafficher les articles
        this.displayRSSArticles(this.rssArticles);
    }

    loadMoreArticles() {
        this.articlesPerPage += 12;
        this.displayRSSArticles(this.rssArticles);
    }

    resetAllFilters() {
        // Réinitialiser catégorie et source
        this.currentCategory = 'all';
        this.currentSource = 'all';
        
        // Réinitialiser boutons de catégorie
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active', 'bg-orange-500', 'text-white');
        });
        document.querySelector('[data-category="all"]').classList.add('active', 'bg-orange-500', 'text-white');
        
        // Réinitialiser boutons de source
        document.querySelectorAll('[data-source]').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
        });
        document.querySelector('[data-source="all"]').classList.add('active', 'bg-blue-500', 'text-white');
        
        // Réafficher tous les articles
        this.displayRSSArticles(this.rssArticles);
        
        console.log('✅ Tous les filtres réinitialisés');
    }

    clearSourceFilter() {
        // Réinitialiser uniquement le filtre source
        this.currentSource = 'all';
        
        // Réinitialiser boutons de source
        document.querySelectorAll('[data-source]').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
        });
        document.querySelector('[data-source="all"]').classList.add('active', 'bg-blue-500', 'text-white');
        
        // Réafficher les articles avec seulement le filtre de catégorie
        this.displayRSSArticles(this.rssArticles);
        
        console.log('✅ Filtre source effacé');
    }

    toggleSettingsPanel() {
        const panel = document.getElementById('settings-panel');
        const overlay = document.getElementById('settings-overlay');
        
        if (panel && overlay) {
            panel.classList.toggle('open');
            overlay.classList.toggle('active');
            console.log('⚙️ Panneau de paramètres togglé');
        }
    }

    closeSettingsPanel() {
        const panel = document.getElementById('settings-panel');
        const overlay = document.getElementById('settings-overlay');
        
        if (panel && overlay) {
            panel.classList.remove('open');
            overlay.classList.remove('active');
            console.log('⚙️ Panneau de paramètres fermé');
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark' || !html.getAttribute('data-theme');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (isDark) {
            // Passer au mode light
            html.setAttribute('data-theme', 'light');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
            }
            localStorage.setItem('theme', 'light');
            console.log('☀️ Mode light activé');
        } else {
            // Passer au mode dark
            html.setAttribute('data-theme', 'dark');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon text-gray-400"></i>';
            }
            localStorage.setItem('theme', 'dark');
            console.log('🌙 Mode dark activé');
        }
    }

    initTheme() {
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const themeToggle = document.getElementById('theme-toggle');
        
        html.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            if (savedTheme === 'light') {
                themeToggle.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon text-gray-400"></i>';
            }
        }
        
        console.log(`🎨 Thème initialisé: ${savedTheme}`);
    }

    async refreshArticles() {
        this.showLoadingState();
        
        try {
            // Forcer le rafraîchissement avec timestamp
            const response = await fetch(`./data/articles.json?t=${Date.now()}`);
            const data = await response.json();
            
            this.rssArticles = data.articles || [];
            this.rssMetadata = data.metadata || {};
            
            this.displayRSSArticles(this.rssArticles);
            this.updateRSSStats(this.rssMetadata);
            this.updateLastSyncTime(this.rssMetadata.lastUpdated);
            
            console.log('✅ Articles actualisés');
            
        } catch (error) {
            console.error('❌ Échec de l\'actualisation:', error);
        }
        
        this.hideLoadingState();
    }

    showLoadingState() {
        const grid = document.getElementById('articles-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-spinner fa-spin text-4xl text-orange-400 mb-4"></i>
                    <p class="text-gray-400">Chargement des articles...</p>
                </div>
            `;
        }
    }

    showErrorState() {
        const grid = document.getElementById('articles-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-orange-400 mb-4"></i>
                    <p class="text-gray-400">Impossible de charger les articles RSS</p>
                    <p class="text-gray-500 text-sm mt-2">Veuillez générer les données avec le système d'import</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // L'état de chargement sera remplacé par les articles
    }
}

// Initialiser le blog quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
    window.blogManager.init();
});
