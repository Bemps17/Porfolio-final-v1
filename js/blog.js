// Blog JavaScript - RSS Feed Management
class BlogManager {
    constructor() {
        this.parser = new RSSParser();
        this.articles = [];
        this.currentCategory = 'all';
        this.articlesPerPage = 12;
        this.currentPage = 1;
        
        // RSS Sources Configuration - Working feeds prioritized
        this.rssSources = {
            tech: [
                { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'tech', language: 'en' },
                { name: 'Wired', url: 'https://www.wired.com/feed/', category: 'tech', language: 'en' },
                { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'tech', language: 'en' },
                { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'tech', language: 'en' },
                { name: 'Numerama', url: 'https://www.numerama.com/feed/', category: 'tech', language: 'fr' },
                { name: 'ZDNet', url: 'https://www.zdnet.com/news/rss.xml', category: 'tech', language: 'en' },
                { name: 'Le Journal du Geek', url: 'https://www.journaldugeek.com/feed/', category: 'tech', language: 'fr' },
                { name: 'Clubic', url: 'https://www.clubic.com/rss.xml', category: 'tech', language: 'fr' },
                { name: "Tom's Hardware", url: 'https://www.tomshardware.com/feeds/all', category: 'tech', language: 'en' },
                { name: 'Gizmodo', url: 'https://gizmodo.com/rss', category: 'tech', language: 'en' },
                { name: 'Mashable', url: 'https://mashable.com/feed/', category: 'tech', language: 'en' },
                { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'tech', language: 'en' },
                { name: 'CNET', url: 'https://www.cnet.com/rss/news/', category: 'tech', language: 'en' },
                { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: 'tech', language: 'en' },
                { name: 'Les Numériques', url: 'https://www.lesnumeriques.com/rss.xml', category: 'tech', language: 'fr' },
                // Alternative working feeds
                { name: 'Reddit Technology', url: 'https://www.reddit.com/r/technology/.rss', category: 'tech', language: 'en' },
                { name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'tech', language: 'en' },
                { name: 'Dev.to', url: 'https://dev.to/feed', category: 'tech', language: 'en' }
            ],
            design: [
                { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'design', language: 'en' },
                { name: 'A List Apart', url: 'https://alistapart.com/main/feed/', category: 'design', language: 'en' },
                { name: 'Creative Bloq', url: 'https://www.creativebloq.com/rss.xml', category: 'design', language: 'en' },
                { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', category: 'design', language: 'en' },
                { name: 'UX Design.cc', url: 'https://uxdesign.cc/feed', category: 'design', language: 'en' },
                { name: 'Abduzeedo', url: 'https://abduzeedo.com/feed', category: 'design', language: 'en' },
                { name: 'Muzli', url: 'https://medium.com/feed/muzli', category: 'design', language: 'en' },
                { name: 'UX Collective', url: 'https://uxdesign.cc/feed', category: 'design', language: 'en' },
                { name: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/rss/', category: 'design', language: 'en' },
                { name: 'Graphiste.com', url: 'https://graphiste.com/blog/feed/', category: 'design', language: 'fr' },
                { name: 'Designmodo', url: 'https://feeds.feedburner.com/designmodo', category: 'design', language: 'en' },
                { name: 'Webdesigner Depot', url: 'https://webdesignerdepot.com/feed', category: 'design', language: 'en' },
                // Alternative working feeds
                { name: 'Dribbble Shots', url: 'https://dribbble.com/shots/popular.rss', category: 'design', language: 'en' },
                { name: 'Behance Featured', url: 'https://www.behance.net/rss', category: 'design', language: 'en' },
                { name: 'Reddit Design', url: 'https://www.reddit.com/r/Design/.rss', category: 'design', language: 'en' }
            ],
            dev: [
                { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/XML/RSS.atom', category: 'dev', language: 'en' },
                { name: 'Stack Overflow Blog', url: 'https://stackoverflow.blog/feed/', category: 'dev', language: 'en' },
                { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/rss/', category: 'dev', language: 'en' },
                { name: 'Developpez.com', url: 'https://www.developpez.com/index/rss', category: 'dev', language: 'fr' },
                // Alternative working feeds
                { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', category: 'dev', language: 'en' },
                { name: 'JavaScript Weekly', url: 'https://javascriptweekly.com/rss/', category: 'dev', language: 'en' },
                { name: 'Node Weekly', url: 'https://nodeweekly.com/rss/', category: 'dev', language: 'en' },
                { name: 'Frontend Focus', url: 'https://frontendfoc.us/rss', category: 'dev', language: 'en' },
                { name: 'Reddit Programming', url: 'https://www.reddit.com/r/programming/.rss', category: 'dev', language: 'en' }
            ],
            social: [
                { name: 'Dribbble', url: 'https://dribbble.com/shots/feed', category: 'social', language: 'en' },
                { name: 'Behance', url: 'https://www.behance.net/rss', category: 'social', language: 'en' },
                { name: 'Product Hunt', url: 'https://www.producthunt.com/feed', category: 'social', language: 'en' },
                { name: 'TechPowerUp', url: 'https://techpowerup.com/rss/news', category: 'social', language: 'en' },
                { name: 'Designer News', url: 'https://www.designernews.co/?format=rss', category: 'social', language: 'en' },
                // Alternative working feeds
                { name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'social', language: 'en' },
                { name: 'Reddit WebDev', url: 'https://www.reddit.com/r/webdev/.rss', category: 'social', language: 'en' },
                { name: 'GitHub Trending', url: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml', category: 'social', language: 'en' }
            ],
            podcasts: [
                { name: 'Design Matters', url: 'https://designmattersmedia.com/feed/', category: 'podcasts', language: 'en' },
                { name: '99% Invisible', url: 'https://feeds.99percentinvisible.org/99percentinvisible', category: 'podcasts', language: 'en' },
                // Alternative working feeds
                { name: 'Syntax FM', url: 'https://syntax.fm/rss', category: 'podcasts', language: 'en' },
                { name: 'ShopTalk Show', url: 'https://shoptalkshow.com/feed/', category: 'podcasts', language: 'en' },
                { name: 'CSS Tricks Podcast', url: 'https://css-tricks.com/podcasts/the-css-podcast/feed/', category: 'podcasts', language: 'en' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadArticles();
    }
    
    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.updateActiveFilter(e.target);
            });
        });
        
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshArticles();
        });
        
        // Retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.loadArticles();
        });
        
        // Load more button
        document.getElementById('load-more-btn').addEventListener('click', () => {
            this.loadMoreArticles();
        });
    }
    
    async loadArticles() {
        this.showLoading();
        this.articles = [];
        
        try {
            // Load articles from ALL sources for comprehensive coverage
            const allSources = [
                ...this.rssSources.tech,
                ...this.rssSources.design,
                ...this.rssSources.dev,
                ...this.rssSources.social,
                ...this.rssSources.podcasts
            ];
            
            console.log(`Loading articles from ${allSources.length} sources...`);
            
            // Check each source and load articles
            const results = [];
            for (const source of allSources) {
                try {
                    const articles = await this.fetchRSSFeed(source);
                    if (articles.length > 0) {
                        results.push({
                            source: source.name,
                            category: source.category,
                            language: source.language,
                            articles: articles,
                            status: 'success'
                        });
                        console.log(`✅ ${source.name}: ${articles.length} articles loaded`);
                    } else {
                        results.push({
                            source: source.name,
                            category: source.category,
                            language: source.language,
                            articles: [],
                            status: 'empty'
                        });
                        console.warn(`⚠️ ${source.name}: No articles found`);
                    }
                } catch (error) {
                    results.push({
                        source: source.name,
                        category: source.category,
                        language: source.language,
                        articles: [],
                        status: 'error',
                        error: error.message
                    });
                    console.error(`❌ ${source.name}: ${error.message}`);
                }
            }
            
            // Flatten all articles
            results.forEach(result => {
                if (result.status === 'success') {
                    this.articles.push(...result.articles);
                }
            });
            
            // Sort articles by date (newest first)
            this.articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            
            // Remove duplicates
            this.articles = this.removeDuplicates(this.articles);
            
            // Display source status summary
            this.displaySourceStatus(results);
            
            // Display articles
            this.displayArticles();
            this.hideLoading();
            
            console.log(`Total articles loaded: ${this.articles.length}`);
            
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showError();
        }
    }
    
    displaySourceStatus(results) {
        const successful = results.filter(r => r.status === 'success').length;
        const empty = results.filter(r => r.status === 'empty').length;
        const errors = results.filter(r => r.status === 'error').length;
        
        console.log(`\n📊 Source Status Summary:`);
        console.log(`✅ Successful: ${successful}/${results.length}`);
        console.log(`⚠️ Empty: ${empty}/${results.length}`);
        console.log(`❌ Errors: ${errors}/${results.length}`);
        
        // Display status on page (optional)
        const statusDiv = document.getElementById('source-status');
        if (statusDiv) {
            statusDiv.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-4 mb-8">
                    <h3 class="text-lg font-semibold mb-2">État des sources RSS</h3>
                    <div class="grid grid-cols-3 gap-4 text-sm">
                        <div class="text-green-400">
                            <i class="fas fa-check-circle mr-1"></i>
                            ${successful} sources actives
                        </div>
                        <div class="text-yellow-400">
                            <i class="fas fa-exclamation-circle mr-1"></i>
                            ${empty} sources vides
                        </div>
                        <div class="text-red-400">
                            <i class="fas fa-times-circle mr-1"></i>
                            ${errors} sources en erreur
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    async fetchRSSFeed(source) {
        try {
            console.log(`🔍 Checking ${source.name} at ${source.url}`);
            
            // Try multiple CORS proxies in order
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?',
                'https://api.codetabs.com/v1/proxy?quest=',
                'https://thingproxy.freeboard.io/fetch/'
            ];
            
            let feed = null;
            let lastError = null;
            
            // Try direct fetch first (for sources that allow CORS)
            try {
                feed = await this.parser.parseURL(source.url);
                console.log(`✅ ${source.name}: Direct fetch successful`);
            } catch (directError) {
                console.log(`🔄 ${source.name}: Direct fetch failed, trying proxies...`);
                lastError = directError;
                
                // Try each proxy
                for (const proxy of proxies) {
                    try {
                        const proxyUrl = proxy + encodeURIComponent(source.url);
                        const response = await fetch(proxyUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Proxy returned ${response.status}`);
                        }
                        
                        const rssText = await response.text();
                        
                        // Validate RSS content
                        if (!rssText.includes('<rss') && !rssText.includes('<feed')) {
                            throw new Error('Invalid RSS content');
                        }
                        
                        feed = await this.parser.parseString(rssText);
                        console.log(`✅ ${source.name}: Proxy ${proxy.split('//')[1].split('/')[0]} successful`);
                        break;
                        
                    } catch (proxyError) {
                        console.log(`❌ ${source.name}: Proxy ${proxy.split('//')[1].split('/')[0]} failed`);
                        lastError = proxyError;
                        continue;
                    }
                }
            }
            
            if (!feed) {
                throw new Error(`All fetch methods failed: ${lastError.message}`);
            }
            
            if (!feed.items || feed.items.length === 0) {
                console.warn(`⚠️ ${source.name}: No items found in feed`);
                return [];
            }
            
            // Process articles
            const articles = feed.items.slice(0, 5).map(item => ({
                title: this.cleanTitle(item.title || 'Sans titre'),
                link: item.link || '#',
                pubDate: this.parseDate(item.pubDate || item.isoDate || item.published || new Date().toISOString()),
                content: this.cleanContent(item.contentSnippet || item.content || item.summary || ''),
                categories: [...(item.categories || []), source.category, source.language],
                source: source.name,
                sourceUrl: this.extractSourceUrl(source.url),
                author: item.author || item.creator || source.name,
                image: this.extractImage(item),
                guid: item.guid || item.link || Math.random().toString(36)
            }));
            
            console.log(`✅ ${source.name}: ${articles.length} articles processed`);
            return articles;
            
        } catch (error) {
            throw new Error(`RSS parsing failed: ${error.message}`);
        }
    }
    
    cleanTitle(title) {
        return title.replace(/[\r\n\t]/g, '').trim().substring(0, 200);
    }
    
    cleanContent(content) {
        if (!content) return '';
        return content
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[\r\n\t]/g, ' ') // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim()
            .substring(0, 300);
    }
    
    parseDate(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return new Date().toISOString();
            }
            return date.toISOString();
        } catch {
            return new Date().toISOString();
        }
    }
    
    extractSourceUrl(rssUrl) {
        try {
            const url = new URL(rssUrl);
            return `${url.protocol}//${url.hostname}`;
        } catch {
            return '#';
        }
    }
    
    extractImage(item) {
        // Try to extract image from content or media thumbnail
        if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
            return item.enclosure.url;
        }
        
        if (item.content) {
            const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/);
            if (imgMatch) return imgMatch[1];
        }
        
        // Default placeholder based on category
        return `https://picsum.photos/seed/${Math.random().toString(36).substr(2, 9)}/400/250.jpg`;
    }
    
    removeDuplicates(articles) {
        const seen = new Set();
        return articles.filter(article => {
            // Use multiple criteria for duplicate detection
            const key = `${article.guid || article.link}-${article.title}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
    
    displayArticles() {
        const grid = document.getElementById('articles-grid');
        const filteredArticles = this.getFilteredArticles();
        const paginatedArticles = filteredArticles.slice(0, this.currentPage * this.articlesPerPage);
        
        if (paginatedArticles.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-newspaper text-4xl text-gray-600 mb-4"></i>
                    <h3 class="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                    <p class="text-gray-400">Essayez de changer de filtre ou d'actualiser.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = paginatedArticles.map(article => this.createArticleCard(article)).join('');
        
        // Show/hide load more button
        const loadMoreContainer = document.getElementById('load-more-container');
        if (filteredArticles.length > paginatedArticles.length) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }
    
    createArticleCard(article) {
        const pubDate = new Date(article.pubDate).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        const categoryColor = this.getCategoryColor(article.categories);
        const languageFlag = article.categories.includes('fr') ? '🇫🇷' : '🇬🇧';
        
        return `
            <article class="blog-card bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl">
                <div class="aspect-w-16 aspect-h-9 bg-gray-800">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover"
                         onerror="this.src='https://picsum.photos/seed/fallback/400/250.jpg'">
                </div>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <span class="category-badge px-2 py-1 rounded-full text-xs font-medium ${categoryColor}">
                                ${this.getMainCategory(article.categories)}
                            </span>
                            <span class="text-xs">${languageFlag}</span>
                        </div>
                        <span class="article-meta text-gray-400">${pubDate}</span>
                    </div>
                    
                    <h3 class="text-lg font-semibold mb-2 line-clamp-2">
                        <a href="${article.link}" target="_blank" class="hover:text-orange-500 transition-colors">
                            ${article.title}
                        </a>
                    </h3>
                    
                    <p class="text-gray-400 text-sm mb-4 line-clamp-3">
                        ${this.truncateText(article.content, 120)}
                    </p>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <img src="https://www.google.com/s2/favicons?sz=16&domain=${new URL(article.sourceUrl).hostname}" 
                                 alt="${article.source}" class="source-icon">
                            <span class="text-xs text-gray-400">${article.source}</span>
                        </div>
                        <a href="${article.link}" target="_blank" 
                           class="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors">
                            Lire <i class="fas fa-external-link-alt ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
    
    getCategoryColor(categories) {
        if (categories.includes('tech')) return 'bg-blue-500/20 text-blue-400';
        if (categories.includes('design')) return 'bg-purple-500/20 text-purple-400';
        if (categories.includes('dev')) return 'bg-green-500/20 text-green-400';
        if (categories.includes('social')) return 'bg-pink-500/20 text-pink-400';
        if (categories.includes('podcasts')) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-gray-500/20 text-gray-400';
    }
    
    getMainCategory(categories) {
        if (categories.includes('tech')) return 'Tech';
        if (categories.includes('design')) return 'Design';
        if (categories.includes('dev')) return 'Dev';
        if (categories.includes('social')) return 'Social';
        if (categories.includes('podcasts')) return 'Podcast';
        return 'Autre';
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
    }
    
    getFilteredArticles() {
        if (this.currentCategory === 'all') {
            return this.articles;
        }
        
        if (this.currentCategory === 'fr') {
            return this.articles.filter(article => article.categories.includes('fr'));
        }
        
        return this.articles.filter(article => article.categories.includes(this.currentCategory));
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.displayArticles();
    }
    
    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    loadMoreArticles() {
        this.currentPage++;
        this.displayArticles();
    }
    
    refreshArticles() {
        this.currentPage = 1;
        this.loadArticles();
    }
    
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('articles-grid').innerHTML = '';
    }
    
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
    
    showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Utility function for contact
function showContact(element) {
    const user = 'bertrandwebdesigner';
    const domain = 'proton.me';
    window.location.href = `mailto:${user}@${domain}`;
}
