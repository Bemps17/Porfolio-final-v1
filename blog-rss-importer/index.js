const RSSParserService = require('./services/rssParser');
const APIFetcherService = require('./services/apiFetcher');
const FormatterService = require('./services/formatter');
const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');

// Configuration
require('dotenv').config();
const { CONFIG } = require('./config/apis');

class BlogImporter {
  constructor() {
    this.rssParser = new RSSParserService();
    this.apiFetcher = new APIFetcherService();
    this.formatter = new FormatterService();
    this.isRunning = false;
    this.stats = {
      totalRuns: 0,
      lastRun: null,
      lastSuccess: null,
      totalArticles: 0
    };
  }

  async runImport() {
    if (this.isRunning) {
      console.log('⚠️ Import already running, skipping...');
      return;
    }

    this.isRunning = true;
    this.stats.totalRuns++;
    this.stats.lastRun = new Date().toISOString();

    console.log('🚀 Starting blog import process...');
    console.log(`📊 Run #${this.stats.totalRuns} at ${this.stats.lastRun}`);

    try {
      // 1. Parse RSS feeds
      console.log('\n📡 Step 1: Parsing RSS feeds...');
      const rssResult = await this.rssParser.parseAllFeeds();
      
      // 2. Fetch from APIs
      console.log('\n🌐 Step 2: Fetching from APIs...');
      const apiResult = await this.apiFetcher.fetchAllAPIs();
      
      // 3. Combine all articles
      console.log('\n🔄 Step 3: Combining articles...');
      const allArticles = [...rssResult.articles, ...apiResult.articles];
      
      // 4. Filter and validate
      console.log('\n🎯 Step 4: Filtering and validating...');
      const filteredArticles = this.filterArticles(allArticles);
      console.log(`📊 Filtered ${allArticles.length} → ${filteredArticles.length} articles`);
      
      // 5. Format and save
      console.log('\n💾 Step 5: Formatting and saving...');
      const formatResults = await this.formatter.formatAndSave(filteredArticles);
      
      // 6. Update stats
      this.stats.totalArticles = filteredArticles.length;
      this.stats.lastSuccess = new Date().toISOString();
      
      // 7. Save run stats
      await this.saveRunStats({
        rss: rssResult.stats,
        api: apiResult.stats,
        format: formatResults,
        total: filteredArticles.length
      });
      
      console.log('\n✅ Import completed successfully!');
      console.log(`📈 Total articles processed: ${filteredArticles.length}`);
      console.log(`💾 Files saved: ${formatResults.saved}`);
      console.log(`⏭️ Files skipped: ${formatResults.skipped}`);
      
      if (formatResults.errors.length > 0) {
        console.log(`⚠️ Errors: ${formatResults.errors.length}`);
      }

      return {
        success: true,
        articles: filteredArticles.length,
        saved: formatResults.saved,
        errors: formatResults.errors.length
      };
      
    } catch (error) {
      console.error('\n❌ Import failed:', error.message);
      
      // Save error stats
      await this.saveRunStats({
        error: error.message,
        success: false
      });
      
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  filterArticles(articles) {
    console.log(`🔍 Filtering ${articles.length} articles...`);
    
    let filtered = articles;
    
    // Remove duplicates
    filtered = this.removeDuplicates(filtered);
    console.log(`🔄 After deduplication: ${filtered.length}`);
    
    // Filter by content length
    filtered = filtered.filter(article => 
      article.content && article.content.length >= CONFIG.filtering.minContentLength
    );
    console.log(`📏 After content length filter: ${filtered.length}`);
    
    // Filter by keywords
    if (CONFIG.filtering.excludeKeywords.length > 0) {
      filtered = filtered.filter(article => {
        const text = `${article.title} ${article.content}`.toLowerCase();
        return !CONFIG.filtering.excludeKeywords.some(keyword =>
          text.includes(keyword.toLowerCase())
        );
      });
      console.log(`🚫 After keyword exclusion: ${filtered.length}`);
    }
    
    // Filter by language if enabled
    if (CONFIG.filtering.filterFrench) {
      filtered = filtered.filter(article => article.language === 'fr');
      console.log(`🇫🇷 After French filter: ${filtered.length}`);
    }
    
    // Sort by date (newest first) and limit
    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    const maxTotal = 500; // Maximum total articles
    if (filtered.length > maxTotal) {
      filtered = filtered.slice(0, maxTotal);
      console.log(`✂️ Limited to ${maxTotal} most recent articles`);
    }
    
    return filtered;
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

  async saveRunStats(stats) {
    try {
      const statsFile = path.join(CONFIG.output.folder, 'data', 'run-stats.json');
      const existingStats = await fs.pathExists(statsFile) 
        ? await fs.readJSON(statsFile) 
        : { runs: [] };
      
      const runData = {
        ...stats,
        timestamp: new Date().toISOString(),
        runNumber: this.stats.totalRuns
      };
      
      existingStats.runs.unshift(runData);
      
      // Keep only last 50 runs
      if (existingStats.runs.length > 50) {
        existingStats.runs = existingStats.runs.slice(0, 50);
      }
      
      existingStats.lastRun = runData;
      existingStats.totalRuns = this.stats.totalRuns;
      
      await fs.writeJSON(statsFile, existingStats, { spaces: 2 });
    } catch (error) {
      console.warn('⚠️ Failed to save run stats:', error.message);
    }
  }

  startScheduler() {
    if (!CONFIG.scheduling.enabled) {
      console.log('⏰ Scheduler is disabled');
      return;
    }

    console.log(`⏰ Starting scheduler with cron: ${CONFIG.scheduling.cron}`);
    
    cron.schedule(CONFIG.scheduling.cron, async () => {
      console.log('⏰ Scheduled import triggered...');
      
      try {
        await this.runImport();
      } catch (error) {
        console.error('❌ Scheduled import failed:', error.message);
      }
    });
    
    console.log('✅ Scheduler started successfully');
  }

  async getStats() {
    try {
      const statsFile = path.join(CONFIG.output.folder, 'data', 'run-stats.json');
      if (await fs.pathExists(statsFile)) {
        return await fs.readJSON(statsFile);
      }
    } catch (error) {
      console.warn('⚠️ Failed to read stats:', error.message);
    }
    
    return { runs: [], totalRuns: 0 };
  }

  async testFeeds() {
    console.log('🧪 Testing RSS feeds...');
    
    const testResults = [];
    const { ALL_FEEDS } = require('./config/feeds');
    
    for (const feed of ALL_FEEDS.slice(0, 5)) { // Test first 5 feeds
      try {
        console.log(`🔍 Testing ${feed.name}...`);
        const articles = await this.rssParser.parseFeed(feed);
        testResults.push({
          feed: feed.name,
          status: 'success',
          articles: articles.length
        });
      } catch (error) {
        testResults.push({
          feed: feed.name,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return testResults;
  }
}

// CLI interface
async function main() {
  const importer = new BlogImporter();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'test':
      console.log('🧪 Running feed tests...');
      const testResults = await importer.testFeeds();
      console.table(testResults);
      break;
      
    case 'stats':
      console.log('📊 Getting statistics...');
      const stats = await importer.getStats();
      console.log(`Total runs: ${stats.totalRuns}`);
      if (stats.lastRun) {
        console.log(`Last run: ${stats.lastRun.timestamp}`);
        console.log(`Last success: ${stats.lastRun.success ? '✅' : '❌'}`);
      }
      break;
      
    case 'schedule':
      console.log('⏰ Starting scheduled importer...');
      importer.startScheduler();
      console.log('🟢 Scheduler is running. Press Ctrl+C to stop.');
      
      // Keep process alive
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping scheduler...');
        process.exit(0);
      });
      
      // Run once immediately
      await importer.runImport();
      break;
      
    default:
      console.log('🚀 Running one-time import...');
      await importer.runImport();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = BlogImporter;
