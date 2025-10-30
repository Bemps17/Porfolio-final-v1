const BlogImporter = require('./index');

async function runTests() {
  console.log('🧪 Running Blog RSS Importer Tests...\n');
  
  const importer = new BlogImporter();
  
  try {
    // Test 1: RSS Parser
    console.log('📡 Test 1: RSS Parser');
    console.log('=' .repeat(40));
    
    const rssTest = await importer.testFeeds();
    console.table(rssTest);
    
    const rssSuccess = rssTest.filter(r => r.status === 'success').length;
    const rssTotal = rssTest.length;
    console.log(`RSS Test Results: ${rssSuccess}/${rssTotal} feeds working\n`);
    
    // Test 2: API Fetcher
    console.log('🌐 Test 2: API Fetcher');
    console.log('=' .repeat(40));
    
    const apiResult = await importer.apiFetcher.fetchAllAPIs();
    console.log(`API Test Results: ${apiResult.stats.successful}/${apiResult.stats.total} APIs working`);
    console.log(`Articles from APIs: ${apiResult.articles.length}\n`);
    
    // Test 3: Formatter
    console.log('💾 Test 3: Formatter');
    console.log('=' .repeat(40));
    
    const testArticles = [
      {
        id: 'test-1',
        title: 'Test Article 1',
        url: 'https://example.com/1',
        content: 'This is a test article content.',
        summary: 'Test summary',
        author: 'Test Author',
        source: 'Test Source',
        sourceUrl: 'example.com',
        category: 'tech',
        language: 'en',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        tags: ['test', 'tech'],
        image: null,
        metadata: {}
      }
    ];
    
    const formatResult = await importer.formatter.formatAndSave(testArticles);
    console.log(`Format Test Results: ${formatResult.saved} files saved\n`);
    
    // Test 4: Full Import (limited)
    console.log('🚀 Test 4: Limited Full Import');
    console.log('=' .repeat(40));
    
    // Run with limited feeds for testing
    const originalFeeds = require('./config/feeds').ALL_FEEDS;
    require('./config/feeds').ALL_FEEDS = originalFeeds.slice(0, 3); // Limit to 3 feeds
    
    const importResult = await importer.runImport();
    
    // Restore original feeds
    require('./config/feeds').ALL_FEEDS = originalFeeds;
    
    console.log(`Full Import Test Results:`);
    console.log(`- Success: ${importResult.success ? '✅' : '❌'}`);
    console.log(`- Articles: ${importResult.articles}`);
    console.log(`- Saved: ${importResult.saved}`);
    console.log(`- Errors: ${importResult.errors}\n`);
    
    // Summary
    console.log('📊 Test Summary');
    console.log('=' .repeat(40));
    console.log(`✅ RSS Parser: ${rssSuccess}/${rssTotal} feeds working`);
    console.log(`✅ API Fetcher: ${apiResult.stats.successful}/${apiResult.stats.total} APIs working`);
    console.log(`✅ Formatter: ${formatResult.saved} files saved`);
    console.log(`✅ Full Import: ${importResult.success ? 'Success' : 'Failed'}`);
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
