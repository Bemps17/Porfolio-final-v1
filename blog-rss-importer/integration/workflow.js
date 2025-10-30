const BlogImporter = require('../index');
const BlogIntegration = require('./blogSync');
const path = require('path');

class WorkflowManager {
  constructor() {
    this.importer = new BlogImporter();
    this.integration = new BlogIntegration();
  }

  async runCompleteWorkflow() {
    console.log('🚀 Starting complete RSS workflow...');
    console.log('=' .repeat(50));
    
    try {
      // Step 1: Import RSS data
      console.log('📡 Step 1: Importing RSS data...');
      const importResult = await this.importer.runImport();
      
      if (!importResult.success) {
        throw new Error('RSS import failed');
      }
      
      console.log(`✅ Import completed: ${importResult.articles} articles`);
      
      // Step 2: Sync to blog
      console.log('\n🔄 Step 2: Syncing to blog...');
      const syncResult = await this.integration.syncToBlog();
      
      console.log(`✅ Sync completed: ${syncResult.articles} articles synced`);
      
      // Step 3: Generate report
      console.log('\n📊 Step 3: Generating report...');
      const report = await this.generateReport(importResult, syncResult);
      
      console.log('\n🎉 Complete workflow finished successfully!');
      console.log('=' .repeat(50));
      console.log(report);
      
      return {
        success: true,
        import: importResult,
        sync: syncResult,
        report
      };
      
    } catch (error) {
      console.error('\n❌ Workflow failed:', error.message);
      throw error;
    }
  }

  async runScheduledWorkflow() {
    console.log('⏰ Scheduled workflow triggered...');
    
    try {
      const result = await this.runCompleteWorkflow();
      
      // Save workflow report
      await this.saveWorkflowReport(result);
      
      return result;
    } catch (error) {
      console.error('❌ Scheduled workflow failed:', error.message);
      
      // Save error report
      await this.saveErrorReport(error);
      
      throw error;
    }
  }

  async generateReport(importResult, syncResult) {
    const stats = await this.integration.getSyncStatus();
    
    return `
📊 RSS Workflow Report
=====================
🕐 Generated: ${new Date().toLocaleString()}

📡 Import Results:
   - Articles processed: ${importResult.articles}
   - Files saved: ${importResult.saved}
   - Errors: ${importResult.errors}

🔄 Sync Results:
   - Articles synced: ${syncResult.articles}
   - Sources: ${syncResult.sources}
   - Categories: ${syncResult.categories}

📈 Blog Status:
   - RSS data integrated: ${stats.hasRSSData ? '✅' : '❌'}
   - Last sync: ${stats.lastSync}
   - Total articles: ${stats.articlesCount}

🎯 Performance:
   - Total time: ${process.uptime().toFixed(2)}s
   - Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB

✅ Next scheduled run: In 6 hours
`;
  }

  async saveWorkflowReport(result) {
    const fs = require('fs-extra');
    const reportsPath = path.join(__dirname, '../reports');
    await fs.ensureDir(reportsPath);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(reportsPath, `workflow-${timestamp}.json`);
    
    await fs.writeJSON(reportFile, {
      ...result,
      timestamp: new Date().toISOString(),
      type: 'workflow-success'
    }, { spaces: 2 });
    
    console.log(`📝 Report saved: ${reportFile}`);
  }

  async saveErrorReport(error) {
    const fs = require('fs-extra');
    const reportsPath = path.join(__dirname, '../reports');
    await fs.ensureDir(reportsPath);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const errorFile = path.join(reportsPath, `error-${timestamp}.json`);
    
    await fs.writeJSON(errorFile, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      type: 'workflow-error'
    }, { spaces: 2 });
    
    console.log(`📝 Error report saved: ${errorFile}`);
  }

  async quickSync() {
    console.log('⚡ Quick sync - using existing RSS data...');
    
    try {
      const syncResult = await this.integration.syncToBlog();
      console.log(`✅ Quick sync completed: ${syncResult.articles} articles`);
      return syncResult;
    } catch (error) {
      console.error('❌ Quick sync failed:', error.message);
      throw error;
    }
  }

  async getStatus() {
    console.log('📊 Checking workflow status...');
    
    try {
      const syncStatus = await this.integration.getSyncStatus();
      const importerStats = await this.importer.getStats();
      
      console.log('\n📈 Workflow Status:');
      console.log('=' .repeat(30));
      console.log(`RSS Data in blog: ${syncStatus.hasRSSData ? '✅' : '❌'}`);
      console.log(`Last sync: ${syncStatus.lastSync || 'Never'}`);
      console.log(`Total articles: ${syncStatus.articlesCount || 0}`);
      console.log(`Active sources: ${syncStatus.sourcesCount || 0}`);
      console.log(`Categories: ${syncStatus.categoriesCount || 0}`);
      console.log(`Total imports: ${importerStats.totalRuns || 0}`);
      
      if (importerStats.lastRun) {
        const lastRun = new Date(importerStats.lastRun);
        const timeAgo = Math.round((Date.now() - lastRun) / 1000 / 60); // minutes ago
        console.log(`Last import: ${timeAgo} minutes ago`);
      }
      
      return {
        sync: syncStatus,
        importer: importerStats
      };
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const workflow = new WorkflowManager();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'complete':
      await workflow.runCompleteWorkflow();
      break;
      
    case 'schedule':
      console.log('⏰ Starting scheduled workflow...');
      const cron = require('node-cron');
      
      // Run immediately
      await workflow.runScheduledWorkflow();
      
      // Schedule every 6 hours
      cron.schedule('0 */6 * * *', async () => {
        console.log('⏰ Scheduled workflow triggered...');
        try {
          await workflow.runScheduledWorkflow();
        } catch (error) {
          console.error('❌ Scheduled workflow failed:', error.message);
        }
      });
      
      console.log('🟢 Scheduler started. Running every 6 hours.');
      console.log('Press Ctrl+C to stop.');
      
      // Keep process alive
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping scheduler...');
        process.exit(0);
      });
      
      break;
      
    case 'quick':
      await workflow.quickSync();
      break;
      
    case 'status':
      await workflow.getStatus();
      break;
      
    default:
      console.log('🚀 Running complete workflow...');
      await workflow.runCompleteWorkflow();
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Workflow failed:', error.message);
    process.exit(1);
  });
}

module.exports = WorkflowManager;
