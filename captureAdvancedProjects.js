const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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
  console.log('🚀 Lancement de la capture avancée des projets...\n');
  
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let totalSuccess = 0;
  let totalErrors = 0;

  for (const project of projects) {
    try {
      console.log(`📸 Traitement du projet: ${project.name}`);
      
      const dir = path.join(__dirname, 'assets/projects', project.name, 'screenshots');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const page = await browser.newPage();
      
      // Attend le chargement complet de la page
      await page.goto(project.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Attend un peu pour les animations
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 1. Cover de la Home
      await page.screenshot({
        path: path.join(dir, 'cover.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: false
      });
      console.log(`  ✅ Cover home capturé`);

      // 2. Récupère jusqu'à 3 ancres du menu
      const anchors = await page.evaluate(() => {
        // Cherche les liens dans nav, header ou tout le document
        const menuSelectors = ['nav', 'header', '.navbar', '.navigation', '.menu'];
        let menu = null;
        
        for (const selector of menuSelectors) {
          menu = document.querySelector(selector);
          if (menu) break;
        }
        
        if (!menu) menu = document;
        
        // Filtre les liens avec des ancres valides
        const links = Array.from(menu.querySelectorAll('a')).filter(a => {
          const hash = a.hash || a.getAttribute('href');
          return hash && hash.startsWith('#') && hash.length > 1;
        });
        
        // Extrait les ancres uniques
        const anchors = [...new Set(links.map(a => a.hash || a.getAttribute('href')))];
        
        // Si aucune ancre trouvée, fallback sur les sections avec id
        if (anchors.length === 0) {
          const sections = Array.from(document.querySelectorAll('section[id], main[id], .section[id]'))
            .map(s => '#' + s.id)
            .filter(id => id.length > 1);
          return sections.slice(0, 3);
        }
        
        return anchors.slice(0, 3);
      });

      console.log(`  🔍 Ancres trouvées: ${anchors.length > 0 ? anchors.join(', ') : 'aucune'}`);

      // 3. Capture chaque section
      let i = 1;
      for (const hash of anchors) {
        try {
          // Navigate directement vers l'ancre
          await page.goto(project.url + hash, { 
            waitUntil: 'networkidle2',
            timeout: 15000 
          });
          
          // Attend pour le scroll et les animations
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Screenshot de la section
          await page.screenshot({
            path: path.join(dir, `section${i}.png`),
            type: 'png',
            fullPage: false
          });
          console.log(`  ✅ Section ${i} capturée (${hash})`);
          i++;
          
        } catch (err) {
          console.warn(`  ⚠️ Erreur capture section ${i} pour ${project.name}: ${err.message}`);
        }
        
        // Limite à 3 sections maximum
        if (i > 3) break;
      }

      // Si aucune section n'a été capturée, essaie de capturer des parties de la page
      if (i === 1) {
        console.log(`  🔄 Aucune section capturée, tentative de capture de parties de la page...`);
        
        // Retour à la page principale
        await page.goto(project.url, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Capture 3 parties différentes en scrollant
        for (let j = 1; j <= 3; j++) {
          try {
            // Scroll à différentes positions
            await page.evaluate((scrollPercent) => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollTo(0, scrollHeight * scrollPercent);
            }, (j - 1) * 0.3);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await page.screenshot({
              path: path.join(dir, `section${j}.png`),
              type: 'png',
              fullPage: false
            });
            console.log(`  ✅ Section ${j} capturée (scroll ${j})`);
          } catch (err) {
            console.warn(`  ⚠️ Erreur capture scroll ${j} pour ${project.name}: ${err.message}`);
          }
        }
      }

      await page.close();
      totalSuccess++;
      console.log(`  🎉 Projet ${project.name} terminé avec succès\n`);
      
    } catch (error) {
      console.error(`❌ Erreur globale pour ${project.name}:`, error.message);
      totalErrors++;
    }
  }

  await browser.close();
  
  console.log('📊 Résumé final de la capture avancée:');
  console.log(`✅ Projets réussis: ${totalSuccess}`);
  console.log(`❌ Projets en erreur: ${totalErrors}`);
  console.log(`📁 Total projets traités: ${projects.length}`);
  
  if (totalSuccess === projects.length) {
    console.log('\n🎉 Toutes les captures avancées ont été générées avec succès!');
    console.log('📁 Chaque dossier contient maintenant: cover.jpg + section1.png, section2.png, section3.png');
  } else {
    console.log('\n⚠️ Certains projets ont rencontré des erreurs. Vérifiez les logs ci-dessus.');
  }
})();
