const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ta liste de projets avec URL et nom du dossier
const projects = [
  { name: 'coursfull', url: 'https://coursfull.netlify.app/' },
  { name: 'snippetbank', url: 'https://snippetbank.netlify.app/' },
  { name: 'ahistory', url: 'https://ahistory.netlify.app/' },
  { name: 'pooltimer', url: 'https://pooltimer.netlify.app/' },
  { name: 'pooltools', url: 'https://pooltools.netlify.app/' },
  { name: 'poolscore', url: 'https://poolscore.netlify.app/' },
  { name: 'mapointeuse', url: 'https://mapointeuse.netlify.app/' },
  { name: 'juriaide', url: 'https://juriaide.netlify.app/' },
  { name: 'vacanceslr', url: 'https://vacanceslr.netlify.app/' },
  { name: 'workfloow', url: 'https://workfloow.netlify.app/' },
  { name: 'chronorganizer', url: 'https://chronorganizer.netlify.app/' },
  { name: 'eisenhowermatrixv1', url: 'https://eisenhowermatrixv1.netlify.app/' },
  { name: 'suivijardin', url: 'https://suivijardin.netlify.app/' },
  { name: 'guidestream', url: 'https://guidestream.netlify.app/' },
  { name: 'flutterisation', url: 'https://flutterisation.netlify.app/' },
  { name: 'seo-checking', url: 'https://seo-checking.netlify.app/' }
];

(async () => {
  console.log('🚀 Lancement de la capture des screenshots...\n');
  
  // Crée le navigateur
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let successCount = 0;
  let errorCount = 0;

  for (const project of projects) {
    try {
      console.log(`📸 Capture en cours pour ${project.name}...`);
      
      // Crée le dossier si nécessaire
      const dir = path.join(__dirname, 'assets/projects', project.name, 'screenshots');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Dossier créé: ${dir}`);
      }
      
      const filePath = path.join(dir, 'cover.jpg');

      // Nouvelle page
      const page = await browser.newPage();
      
      // Attend un peu avant de charger pour éviter les erreurs
      await page.goto(project.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Attend un peu supplémentaire pour que les animations se chargent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prend la capture d'écran
      await page.screenshot({
        path: filePath,
        type: 'jpeg',
        quality: 90,
        fullPage: false,
      });
      
      console.log(`✅ Screenshot pris pour ${project.name} -> ${filePath}`);
      successCount++;
      
      await page.close();
      
      // Petite pause entre chaque projet pour ne pas surcharger les serveurs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Erreur pour ${project.name}:`, error.message);
      errorCount++;
    }
  }

  await browser.close();
  
  console.log('\n📊 Résumé de la capture:');
  console.log(`✅ Réussies: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📁 Total: ${projects.length} projets`);
  
  if (successCount === projects.length) {
    console.log('\n🎉 Toutes les captures ont été générées avec succès!');
  } else {
    console.log('\n⚠️  Certaines captures ont échoué. Vérifiez les erreurs ci-dessus.');
  }
})();
