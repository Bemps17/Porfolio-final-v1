const fs = require('fs-extra');
const path = require('path');

// Build script for Netlify deployment
async function buildForNetlify() {
  console.log('🏗️ Building RSS data for Netlify deployment...');
  
  try {
    // 1. Run RSS import
    console.log('📡 Step 1: Importing RSS data...');
    const BlogImporter = require('./index');
    const importer = new BlogImporter();
    
    const importResult = await importer.runImport();
    if (!importResult.success) {
      throw new Error('RSS import failed');
    }
    
    // 2. Copy data to parent directory for Netlify
    console.log('📁 Step 2: Copying data to Netlify publish directory...');
    const outputDir = path.join(__dirname, 'output');
    const targetDir = path.join(__dirname, '..', 'data');
    
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // Copy JSON files
    const dataFiles = ['articles.json', 'run-stats.json'];
    for (const file of dataFiles) {
      const sourceFile = path.join(outputDir, 'data', file);
      const targetFile = path.join(targetDir, file);
      
      if (await fs.pathExists(sourceFile)) {
        await fs.copy(sourceFile, targetFile);
        console.log(`✅ Copied ${file} to data/`);
      }
    }
    
    // Copy index.html
    const indexSource = path.join(outputDir, 'index.html');
    const indexTarget = path.join(__dirname, '..', 'rss-index.html');
    
    if (await fs.pathExists(indexSource)) {
      await fs.copy(indexSource, indexTarget);
      console.log('✅ Copied RSS index to rss-index.html');
    }
    
    // 3. Update blog.js with production data
    console.log('🔄 Step 3: Updating blog.js with production data...');
    await updateBlogJSForProduction();
    
    // 4. Create production summary
    console.log('📊 Step 4: Creating production summary...');
    await createProductionSummary(importResult);
    
    console.log('✅ Netlify build completed successfully!');
    
    return {
      success: true,
      articles: importResult.articles,
      files: dataFiles.length
    };
    
  } catch (error) {
    console.error('❌ Netlify build failed:', error.message);
    throw error;
  }
}

async function updateBlogJSForProduction() {
  const blogJSPath = path.join(__dirname, '..', 'js', 'blog.js');
  const dataPath = path.join(__dirname, 'output', 'data', 'articles.json');
  
  if (!await fs.pathExists(dataPath)) {
    console.warn('⚠️ No RSS data found, skipping blog.js update');
    return;
  }
  
  const rssData = await fs.readJSON(dataPath);
  const blogJS = await fs.readFile(blogJSPath, 'utf8');
  
  // Add production data loading
  const productionCode = `
// Production RSS Data - Auto-generated for Netlify
async loadProductionRSSData() {
    try {
        const response = await fetch('./data/articles.json');
        const data = await response.json();
        this.rssArticles = data.articles || [];
        this.rssMetadata = data.metadata || {};
        
        console.log('✅ Loaded', this.rssArticles.length, 'RSS articles');
        this.displayRSSArticles(this.rssArticles);
        this.updateRSSStats(this.rssMetadata);
    } catch (error) {
        console.error('❌ Failed to load RSS data:', error);
        // Fallback to manual loading
        this.loadAllFeeds();
    }
}

// Override initialization for production
async init() {
    this.setupEventListeners();
    this.showLoadingState();
    
    // Try production data first
    await this.loadProductionRSSData();
    
    this.hideLoadingState();
}
`;
  
  // Replace or append the init method
  const updatedBlogJS = blogJS.replace(
    /async init\(\) \{[\s\S]*?\n\s*\}/,
    productionCode.trim() + '\n'
  );
  
  await fs.writeFile(blogJSPath, updatedBlogJS, 'utf8');
  console.log('✅ Updated blog.js for production');
}

async function createProductionSummary(importResult) {
  const summary = {
    buildTime: new Date().toISOString(),
    articles: importResult.articles,
    sources: {
      rss: importResult.rss || 0,
      api: importResult.api || 0
    },
    deployment: {
      platform: 'Netlify',
      environment: 'production',
      cdn: true,
      https: true
    },
    features: [
      '✅ CORS-free operation',
      '✅ HTTPS API access',
      '✅ CDN acceleration',
      '✅ Auto-build on schedule',
      '✅ Global distribution'
    ]
  };
  
  const summaryPath = path.join(__dirname, '..', 'data', 'build-summary.json');
  await fs.writeJSON(summaryPath, summary, { spaces: 2 });
  
  console.log('✅ Created build summary');
}

// Run build if called directly
if (require.main === module) {
  buildForNetlify()
    .then(result => {
      console.log('🎉 Build completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Build failed:', error.message);
      process.exit(1);
    });
}

module.exports = { buildForNetlify };
