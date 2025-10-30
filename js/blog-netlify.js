// Blog JavaScript - Netlify Production Version
class BlogManager {
    constructor() {
        this.articles = [];
        this.currentCategory = 'all';
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
    }

    async init() {
        this.setupEventListeners();
        this.showLoadingState();
        
        try {
            // Try to load production RSS data first
            await this.loadProductionRSSData();
        } catch (error) {
            console.warn('⚠️ Production data not available, loading manually...');
            // Fallback to manual RSS loading
            await this.loadAllFeeds();
        }
        
        this.hideLoadingState();
    }

    async loadProductionRSSData() {
        try {
            console.log('📡 Loading RSS data from Netlify...');
            
            // Load main RSS data
            const response = await fetch('./data/articles.json');
            if (!response.ok) {
                throw new Error('RSS data not found');
            }
            
            const data = await response.json();
            this.rssArticles = data.articles || [];
            this.rssMetadata = data.metadata || {};
            
            console.log(`✅ Loaded ${this.rssArticles.length} RSS articles`);
            
            // Display articles
            this.displayRSSArticles(this.rssArticles);
            this.updateRSSStats(this.rssMetadata);
            
            // Update last sync time
            this.updateLastSyncTime(this.rssMetadata.lastUpdated);
            
        } catch (error) {
            console.error('❌ Failed to load RSS data:', error);
            throw error;
        }
    }

    displayRSSArticles(articles) {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Filter articles by category
        const filteredArticles = this.currentCategory === 'all' 
            ? articles 
            : articles.filter(article => article.category === this.currentCategory);
        
        // Sort by date (newest first)
        filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Display articles
        const articlesToShow = filteredArticles.slice(0, this.articlesPerPage);
        
        articlesToShow.forEach(article => {
            const articleCard = this.createRSSArticleCard(article);
            grid.appendChild(articleCard);
        });
        
        // Update load more button
        this.updateLoadMoreButton(filteredArticles);
        
        // Update category stats
        this.updateCategoryStats(filteredArticles);
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
                    ${article.summary || article.content.substring(0, 150) + '...'}
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
            'sources-count': metadata.sources ? metadata.sources.length : 0,
            'categories-count': metadata.categories ? metadata.categories.length : 0,
            'articles-count': metadata.total || 0
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
            syncElement.textContent = `Dernière sync: ${syncDate}`;
        }
    }

    updateCategoryStats(articles) {
        const categoryCounts = {};
        
        Object.keys(this.categories).forEach(category => {
            if (category !== 'all') {
                categoryCounts[category] = articles.filter(article => article.category === category).length;
            }
        });
        
        // Update category buttons with counts
        Object.entries(categoryCounts).forEach(([category, count]) => {
            const button = document.querySelector(`[data-category="${category}"]`);
            if (button) {
                const countElement = button.querySelector('.category-count');
                if (countElement) {
                    countElement.textContent = count;
                }
            }
        });
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('[data-category]').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-articles');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshArticles();
            });
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active', 'bg-orange-500', 'text-white');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-orange-500', 'text-white');
        }
        
        // Re-display articles
        this.displayRSSArticles(this.rssArticles);
    }

    loadMoreArticles() {
        this.articlesPerPage += 12;
        this.displayRSSArticles(this.rssArticles);
    }

    async refreshArticles() {
        this.showLoadingState();
        
        try {
            // Force refresh by adding timestamp
            const response = await fetch(`./data/articles.json?t=${Date.now()}`);
            const data = await response.json();
            
            this.rssArticles = data.articles || [];
            this.rssMetadata = data.metadata || {};
            
            this.displayRSSArticles(this.rssArticles);
            this.updateRSSStats(this.rssMetadata);
            this.updateLastSyncTime(this.rssMetadata.lastUpdated);
            
            console.log('✅ Articles refreshed');
            
        } catch (error) {
            console.error('❌ Failed to refresh articles:', error);
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

    hideLoadingState() {
        // Loading state will be replaced by articles
    }

    // Fallback methods for manual loading (if production data fails)
    async loadAllFeeds() {
        console.log('🔄 Manual RSS loading not implemented in production');
        // In production, we rely on pre-built data
    }
}

// Initialize blog when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
    window.blogManager.init();
});
