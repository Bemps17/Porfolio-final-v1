const fs = require('fs-extra');
const path = require('path');

class BlogIntegration {
  constructor() {
    this.blogPath = path.resolve(__dirname, '..');
    this.importerPath = __dirname;
    this.dataPath = path.join(this.importerPath, 'output', 'data');
  }

  async syncToBlog() {
    console.log('🔄 Synchronizing RSS data to blog...');
    
    try {
      // 1. Read the latest RSS data
      const articlesData = await this.readRSSData();
      if (!articlesData || !articlesData.articles) {
        throw new Error('No RSS data found. Run the importer first.');
      }
      
      console.log(`📊 Found ${articlesData.articles.length} articles`);
      
      // 2. Update blog JavaScript with RSS data
      await this.updateBlogJS(articlesData);
      
      // 3. Create RSS data file for blog
      await this.createBlogDataFile(articlesData);
      
      // 4. Update blog statistics
      await this.updateBlogStats(articlesData);
      
      // 5. Create backup
      await this.createBackup(articlesData);
      
      console.log('✅ Blog synchronized successfully!');
      
      return {
        success: true,
        articles: articlesData.articles.length,
        sources: articlesData.metadata.sources.length,
        categories: articlesData.metadata.categories.length
      };
      
    } catch (error) {
      console.error('❌ Synchronization failed:', error.message);
      throw error;
    }
  }

  async readRSSData() {
    const dataFile = path.join(this.dataPath, 'articles.json');
    
    if (!await fs.pathExists(dataFile)) {
      throw new Error('RSS data file not found. Run npm start first.');
    }
    
    return await fs.readJSON(dataFile);
  }

  async updateBlogJS(articlesData) {
    const blogJSPath = path.join(this.blogPath, 'js', 'blog.js');
    
    if (!await fs.pathExists(blogJSPath)) {
      throw new Error('blog.js not found in the main project.');
    }
    
    // Read original blog.js
    let blogJS = await fs.readFile(blogJSPath, 'utf8');
    
    // Extract the articles section to replace
    const articlesStart = blogJS.indexOf('// RSS Articles Data');
    const articlesEnd = blogJS.indexOf('// End RSS Articles Data');
    
    if (articlesStart === -1 || articlesEnd === -1) {
      console.warn('⚠️ RSS data section not found in blog.js, appending...');
      await this.appendRSSDataToBlogJS(articlesData);
      return;
    }
    
    // Generate new RSS data section
    const newRSSData = this.generateRSSDataSection(articlesData);
    
    // Replace the section
    const before = blogJS.substring(0, articlesStart);
    const after = blogJS.substring(articlesEnd + '// End RSS Articles Data'.length);
    
    const updatedBlogJS = before + newRSSData + after;
    
    await fs.writeFile(blogJSPath, updatedBlogJS, 'utf8');
    console.log('✅ Updated blog.js with RSS data');
  }

  async appendRSSDataToBlogJS(articlesData) {
    const blogJSPath = path.join(this.blogPath, 'js', 'blog.js');
    const blogJS = await fs.readFile(blogJSPath, 'utf8');
    
    const rssDataSection = this.generateRSSDataSection(articlesData);
    const updatedBlogJS = blogJS + '\n\n' + rssDataSection;
    
    await fs.writeFile(blogJSPath, updatedBlogJS, 'utf8');
    console.log('✅ Appended RSS data to blog.js');
  }

  generateRSSDataSection(articlesData) {
    const articles = articlesData.articles.slice(0, 100); // Limit to 100 for performance
    const metadata = articlesData.metadata;
    
    return `// RSS Articles Data - Auto-generated
// Generated on: ${new Date().toISOString()}
// Total articles: ${metadata.total}

this.rssArticles = ${JSON.stringify(articles, null, 2)};

this.rssMetadata = ${JSON.stringify(metadata, null, 2)};

// Method to load RSS articles
async loadRSSArticles() {
    try {
        this.displayRSSArticles(this.rssArticles);
        this.updateRSSStats(this.rssMetadata);
        console.log('✅ RSS articles loaded successfully');
    } catch (error) {
        console.error('❌ Failed to load RSS articles:', error);
    }
}

// Method to display RSS articles
displayRSSArticles(articles) {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Filter articles based on current category
    const filteredArticles = this.currentCategory === 'all' 
        ? articles 
        : articles.filter(article => article.categories.includes(this.currentCategory));
    
    // Display articles
    filteredArticles.slice(0, this.articlesPerPage).forEach(article => {
        const articleCard = this.createRSSArticleCard(article);
        grid.appendChild(articleCard);
    });
    
    // Update load more button
    this.updateLoadMoreButton(filteredArticles);
}

// Method to create RSS article card
createRSSArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'blog-card bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300';
    
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    card.innerHTML = \`
        <div class="relative">
            \${article.image ? \`
            <img src="\${article.image}" alt="\${article.title}" class="w-full h-48 object-cover">
            \` : \`
            <div class="w-full h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <i class="fas fa-newspaper text-white text-4xl"></i>
            </div>
            \`}
            <div class="absolute top-2 left-2">
                <span class="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                    \${article.source}
                </span>
            </div>
        </div>
        <div class="p-6">
            <div class="flex items-center justify-between mb-3">
                <span class="text-sm text-gray-400">
                    <i class="far fa-calendar mr-1"></i>
                    \${publishedDate}
                </span>
                <span class="text-sm px-2 py-1 bg-gray-800 text-gray-300 rounded">
                    \${article.language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                </span>
            </div>
            <h3 class="text-xl font-semibold mb-3 line-clamp-2">
                <a href="\${article.url}" target="_blank" class="hover:text-orange-400 transition-colors">
                    \${article.title}
                </a>
            </h3>
            <p class="text-gray-400 mb-4 line-clamp-3">
                \${article.summary || article.content.substring(0, 150) + '...'}
            </p>
            <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                    \${article.categories ? article.categories.slice(0, 3).map(cat => 
                        \`<span class="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">\${cat}</span>\`
                    ).join('') : ''}
                </div>
                <a href="\${article.url}" target="_blank" class="text-orange-400 hover:text-orange-300 transition-colors">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    \`;
    
    return card;
}

// Method to update RSS statistics
updateRSSStats(metadata) {
    const statsElements = {
        'sources-count': metadata.sources.length,
        'categories-count': metadata.categories.length,
        'articles-count': metadata.total
    };
    
    Object.entries(statsElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// End RSS Articles Data`;
  }

  async createBlogDataFile(articlesData) {
    const blogDataPath = path.join(this.blogPath, 'data');
    await fs.ensureDir(blogDataPath);
    
    const dataFile = path.join(blogDataPath, 'rss-articles.json');
    await fs.writeJSON(dataFile, articlesData, { spaces: 2 });
    
    console.log('✅ Created RSS data file for blog');
  }

  async updateBlogStats(articlesData) {
    const blogHTMLPath = path.join(this.blogPath, 'blog.html');
    
    if (!await fs.pathExists(blogHTMLPath)) {
      console.warn('⚠️ blog.html not found, skipping stats update');
      return;
    }
    
    let blogHTML = await fs.readFile(blogHTMLPath, 'utf8');
    
    // Update statistics in blog.html
    const stats = articlesData.metadata;
    
    // Update sources count
    blogHTML = blogHTML.replace(
      /<div class="text-2xl sm:text-3xl font-bold text-orange-400">\d+\+<\/div>\s*<div class="text-sm text-gray-400">Sources RSS<\/div>/,
      `<div class="text-2xl sm:text-3xl font-bold text-orange-400">${stats.sources.length}+</div>
                    <div class="text-sm text-gray-400">Sources RSS</div>`
    );
    
    // Update categories count  
    blogHTML = blogHTML.replace(
      /<div class="text-2xl sm:text-3xl font-bold text-orange-400">\d+<\/div>\s*<div class="text-sm text-gray-400">Catégories<\/div>/,
      `<div class="text-2xl sm:text-3xl font-bold text-orange-400">${stats.categories.length}</div>
                    <div class="text-sm text-gray-400">Catégories</div>`
    );
    
    await fs.writeFile(blogHTMLPath, blogHTML, 'utf8');
    console.log('✅ Updated blog statistics');
  }

  async createBackup(articlesData) {
    const backupPath = path.join(this.importerPath, 'backups');
    await fs.ensureDir(backupPath);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupPath, `rss-backup-${timestamp}.json`);
    
    await fs.writeJSON(backupFile, articlesData, { spaces: 2 });
    console.log(`✅ Created backup: ${backupFile}`);
  }

  async getSyncStatus() {
    try {
      const rssData = await this.readRSSData();
      const blogJSPath = path.join(this.blogPath, 'js', 'blog.js');
      const blogJS = await fs.readFile(blogJSPath, 'utf8');
      
      const hasRSSData = blogJS.includes('this.rssArticles');
      const lastSync = rssData.metadata.lastUpdated;
      
      return {
        hasRSSData,
        lastSync,
        articlesCount: rssData.metadata.total,
        sourcesCount: rssData.metadata.sources.length,
        categoriesCount: rssData.metadata.categories.length
      };
    } catch (error) {
      return {
        hasRSSData: false,
        lastSync: null,
        error: error.message
      };
    }
  }
}

// CLI interface
async function main() {
  const integration = new BlogIntegration();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'status':
      console.log('📊 Checking sync status...');
      const status = await integration.getSyncStatus();
      console.log('Sync Status:');
      console.log(`- RSS Data in blog: ${status.hasRSSData ? '✅' : '❌'}`);
      console.log(`- Last sync: ${status.lastSync || 'Never'}`);
      console.log(`- Articles: ${status.articlesCount || 0}`);
      console.log(`- Sources: ${status.sourcesCount || 0}`);
      console.log(`- Categories: ${status.categoriesCount || 0}`);
      break;
      
    case 'sync':
      console.log('🔄 Starting synchronization...');
      await integration.syncToBlog();
      break;
      
    default:
      console.log('🔄 Syncing RSS data to blog...');
      await integration.syncToBlog();
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Integration failed:', error.message);
    process.exit(1);
  });
}

module.exports = BlogIntegration;
