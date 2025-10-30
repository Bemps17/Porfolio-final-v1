const Parser = require('rss-parser');
const axios = require('axios');
const { ALL_FEEDS } = require('../config/feeds');
const { CONFIG } = require('../config/apis');

class RSSParserService {
  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      customFields: {
        item: [
          'pubDate',
          'isoDate',
          'content',
          'contentSnippet',
          'summary',
          'author',
          'creator',
          'guid',
          'categories',
          'enclosure'
        ]
      }
    });
    
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  async parseAllFeeds() {
    console.log(`🔄 Starting RSS parsing for ${ALL_FEEDS.length} feeds...`);
    
    const results = [];
    
    // Parser par priorité pour optimiser le chargement
    const priorityGroups = this.groupByPriority(ALL_FEEDS);
    
    for (const [priority, feeds] of Object.entries(priorityGroups)) {
      console.log(`📊 Processing priority ${priority} (${feeds.length} feeds)...`);
      
      const groupResults = await Promise.allSettled(
        feeds.map(feed => this.parseFeed(feed))
      );
      
      groupResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(...result.value);
          this.stats.successful++;
        } else {
          this.stats.failed++;
          this.stats.errors.push({
            feed: feeds[index].name,
            error: result.reason.message
          });
          console.error(`❌ Failed to parse ${feeds[index].name}:`, result.reason.message);
        }
        this.stats.total++;
      });
      
      // Pause entre les groupes pour éviter la surcharge
      if (priority !== 'low') {
        await this.sleep(2000);
      }
    }
    
    console.log(`✅ RSS parsing completed: ${this.stats.successful}/${this.stats.total} successful`);
    
    return {
      articles: results,
      stats: this.stats
    };
  }

  async parseFeed(feedConfig) {
    try {
      console.log(`🔍 Parsing ${feedConfig.name}...`);
      
      const feed = await this.parser.parseURL(feedConfig.url);
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`⚠️ No items found in ${feedConfig.name}`);
        return [];
      }
      
      const articles = feed.items
        .slice(0, CONFIG.output.maxArticles)
        .map(item => this.formatArticle(item, feedConfig))
        .filter(article => this.isValidArticle(article));
      
      console.log(`✅ ${feedConfig.name}: ${articles.length} articles parsed`);
      return articles;
      
    } catch (error) {
      throw new Error(`RSS parsing failed for ${feedConfig.name}: ${error.message}`);
    }
  }

  formatArticle(item, feedConfig) {
    return {
      id: this.generateId(item, feedConfig),
      title: this.cleanText(item.title),
      url: item.link || item.guid,
      content: this.cleanContent(item.contentSnippet || item.content || item.summary || ''),
      summary: this.cleanText(item.contentSnippet || item.summary || ''),
      author: this.cleanText(item.author || item.creator || feedConfig.name),
      source: feedConfig.name,
      sourceUrl: this.extractDomain(feedConfig.url),
      category: feedConfig.category,
      language: feedConfig.language,
      publishedAt: this.parseDate(item.pubDate || item.isoDate || item.published),
      createdAt: new Date().toISOString(),
      tags: this.extractTags(item.categories, feedConfig),
      image: this.extractImage(item),
      metadata: {
        guid: item.guid,
        categories: item.categories || [],
        enclosure: item.enclosure || null
      }
    };
  }

  generateId(item, feedConfig) {
    const baseId = item.guid || item.link || item.title;
    return `${feedConfig.name}-${baseId}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/[\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200);
  }

  cleanContent(content) {
    if (!content) return '';
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[\r\n\t]/g, ' ') // Replace newlines
      .replace(/\s+/g, ' ') // Collapse spaces
      .trim()
      .substring(0, 500);
  }

  parseDate(dateString) {
    if (!dateString) return new Date().toISOString();
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  extractTags(categories, feedConfig) {
    const tags = [];
    
    if (categories && Array.isArray(categories)) {
      tags.push(...categories.map(cat => cat._ || cat));
    }
    
    // Ajouter des tags basés sur la catégorie
    tags.push(feedConfig.category);
    
    // Tags basés sur la langue
    tags.push(feedConfig.language === 'fr' ? 'français' : 'english');
    
    return [...new Set(tags)]; // Remove duplicates
  }

  extractImage(item) {
    // Try enclosure first
    if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
      return item.enclosure.url;
    }
    
    // Try to extract from content
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) return imgMatch[1];
    }
    
    return null;
  }

  isValidArticle(article) {
    // Check minimum content length
    if (article.content.length < CONFIG.filtering.minContentLength) {
      return false;
    }
    
    // Check for excluded keywords
    const hasExcludedKeyword = CONFIG.filtering.excludeKeywords.some(keyword =>
      article.title.toLowerCase().includes(keyword.toLowerCase()) ||
      article.content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasExcludedKeyword) {
      return false;
    }
    
    // Check for required URL
    if (!article.url || article.url === '#') {
      return false;
    }
    
    return true;
  }

  groupByPriority(feeds) {
    return feeds.reduce((groups, feed) => {
      const priority = feed.priority <= 2 ? 'high' : feed.priority === 3 ? 'medium' : 'low';
      if (!groups[priority]) groups[priority] = [];
      groups[priority].push(feed);
      return groups;
    }, {});
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return this.stats;
  }

  resetStats() {
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }
}

module.exports = RSSParserService;
