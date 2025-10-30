const fs = require('fs-extra');
const path = require('path');
const { format } = require('date-fns');
const { CONFIG } = require('../config/apis');

class FormatterService {
  constructor() {
    this.outputDir = CONFIG.output.folder;
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    fs.ensureDirSync(path.join(this.outputDir, 'articles'));
    fs.ensureDirSync(path.join(this.outputDir, 'data'));
  }

  async formatAndSave(articles) {
    console.log(`📝 Formatting and saving ${articles.length} articles...`);
    
    const results = {
      saved: 0,
      skipped: 0,
      errors: []
    };

    // Remove duplicates
    const uniqueArticles = this.removeDuplicates(articles);
    console.log(`🔄 Removed ${articles.length - uniqueArticles.length} duplicates`);

    // Sort by date (newest first)
    uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Save based on format configuration
    if (CONFIG.output.format === 'json' || CONFIG.output.format === 'both') {
      await this.saveAsJSON(uniqueArticles);
    }

    if (CONFIG.output.format === 'markdown' || CONFIG.output.format === 'both') {
      const markdownResults = await this.saveAsMarkdown(uniqueArticles);
      results.saved += markdownResults.saved;
      results.skipped += markdownResults.skipped;
      results.errors.push(...markdownResults.errors);
    }

    // Generate index
    if (CONFIG.output.generateIndex) {
      await this.generateIndex(uniqueArticles);
    }

    console.log(`✅ Formatting completed: ${results.saved} saved, ${results.skipped} skipped`);
    
    return results;
  }

  removeDuplicates(articles) {
    const seen = new Set();
    return articles.filter(article => {
      const key = `${article.source}-${article.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async saveAsJSON(articles) {
    try {
      // Save complete dataset
      const dataPath = path.join(this.outputDir, 'data', 'articles.json');
      await fs.writeJSON(dataPath, {
        articles: articles,
        metadata: {
          total: articles.length,
          lastUpdated: new Date().toISOString(),
          categories: this.getCategoryStats(articles),
          sources: this.getSourceStats(articles)
        }
      }, { spaces: 2 });

      // Save by category
      const categories = this.groupByCategory(articles);
      for (const [category, categoryArticles] of Object.entries(categories)) {
        const categoryPath = path.join(this.outputDir, 'data', `${category}.json`);
        await fs.writeJSON(categoryPath, categoryArticles, { spaces: 2 });
      }

      console.log(`💾 Saved JSON: ${articles.length} articles`);
    } catch (error) {
      console.error('❌ Failed to save JSON:', error.message);
      throw error;
    }
  }

  async saveAsMarkdown(articles) {
    const results = {
      saved: 0,
      skipped: 0,
      errors: []
    };

    for (const article of articles) {
      try {
        const filename = this.generateMarkdownFilename(article);
        const filepath = path.join(this.outputDir, 'articles', filename);
        
        // Skip if file already exists
        if (await fs.pathExists(filepath)) {
          results.skipped++;
          continue;
        }

        const content = this.generateMarkdownContent(article);
        await fs.writeFile(filepath, content, 'utf8');
        results.saved++;
        
      } catch (error) {
        results.errors.push({
          article: article.title,
          error: error.message
        });
      }
    }

    console.log(`📝 Saved Markdown: ${results.saved} files`);
    return results;
  }

  generateMarkdownFilename(article) {
    const date = format(new Date(article.publishedAt), 'yyyy-MM-dd');
    const safeTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return `${date}-${safeTitle}.md`;
  }

  generateMarkdownContent(article) {
    const frontmatter = {
      title: article.title,
      date: article.publishedAt,
      source: article.source,
      sourceUrl: article.sourceUrl,
      url: article.url,
      author: article.author,
      category: article.category,
      language: article.language,
      tags: article.tags,
      image: article.image,
      summary: article.summary
    };

    // Add metadata if available
    if (article.metadata) {
      frontmatter.metadata = article.metadata;
    }

    return `---
${Object.entries(frontmatter)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
    }
    return `${key}: "${value}"`;
  })
  .join('\n')}
---

# ${article.title}

**Source:** [${article.source}](${article.url})  
**Author:** ${article.author}  
**Published:** ${format(new Date(article.publishedAt), 'PPP')}  

## Summary

${article.summary}

## Content

${article.content}

---

*This article was automatically imported from ${article.source} on ${format(new Date(article.createdAt), 'PPP')}.*
`;
  }

  async generateIndex(articles) {
    try {
      const indexPath = path.join(this.outputDir, 'index.html');
      const indexContent = this.generateIndexHTML(articles);
      await fs.writeFile(indexPath, indexContent, 'utf8');
      
      console.log('📄 Generated index.html');
    } catch (error) {
      console.error('❌ Failed to generate index:', error.message);
    }
  }

  generateIndexHTML(articles) {
    const categories = this.groupByCategory(articles);
    const totalArticles = articles.length;
    const lastUpdated = new Date().toISOString();

    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog de Veille - Index</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .category { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .category h2 { margin-top: 0; color: #333; }
        .article-list { list-style: none; padding: 0; }
        .article { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .article:last-child { border-bottom: none; }
        .article-title { font-weight: 600; margin-bottom: 5px; }
        .article-meta { font-size: 0.9em; color: #666; }
        .article a { text-decoration: none; color: #0066cc; }
        .article a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📰 Blog de Veille Technologique</h1>
            <p>Dernière mise à jour: ${format(new Date(lastUpdated), 'PPP HH:mm')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>${totalArticles}</h3>
                <p>Articles totaux</p>
            </div>
            <div class="stat-card">
                <h3>${Object.keys(categories).length}</h3>
                <p>Catégories</p>
            </div>
            <div class="stat-card">
                <h3>${this.getSourceStats(articles).length}</h3>
                <p>Sources</p>
            </div>
        </div>
        
        <div class="categories">
`;

    for (const [category, categoryArticles] of Object.entries(categories)) {
      html += `
            <div class="category">
                <h2>📂 ${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryArticles.length})</h2>
                <ul class="article-list">
`;

      categoryArticles.slice(0, 10).forEach(article => {
        html += `
                    <li class="article">
                        <div class="article-title">
                            <a href="${article.url}" target="_blank">${article.title}</a>
                        </div>
                        <div class="article-meta">
                            ${article.source} • ${format(new Date(article.publishedAt), 'dd MMM yyyy')}
                        </div>
                    </li>
`;
      });

      if (categoryArticles.length > 10) {
        html += `
                    <li class="article">
                        <div class="article-meta">
                            ... et ${categoryArticles.length - 10} autres articles
                        </div>
                    </li>
`;
      }

      html += `
                </ul>
            </div>
`;
    }

    html += `
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  groupByCategory(articles) {
    return articles.reduce((groups, article) => {
      const category = article.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(article);
      return groups;
    }, {});
  }

  getCategoryStats(articles) {
    const categories = this.groupByCategory(articles);
    return Object.entries(categories).map(([category, categoryArticles]) => ({
      category,
      count: categoryArticles.length
    }));
  }

  getSourceStats(articles) {
    const sources = {};
    articles.forEach(article => {
      if (!sources[article.source]) {
        sources[article.source] = 0;
      }
      sources[article.source]++;
    });
    return Object.entries(sources).map(([source, count]) => ({ source, count }));
  }
}

module.exports = FormatterService;
