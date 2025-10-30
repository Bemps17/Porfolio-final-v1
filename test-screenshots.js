// Quick test script to verify all screenshots
const projects = ['coursfull', 'snippetbank', 'ahistory', 'pooltimer', 'pooltools', 'poolscore', 'mapointeuse', 'juriaide', 'vacanceslr', 'workfloow', 'chronorganizer', 'eisenhowermatrixv1', 'suivijardin', 'guidestream', 'flutterisation', 'seo-checking'];

projects.forEach(project => {
    console.log(`\n🔍 Checking ${project}:`);
    ['cover.jpg', 'section1.png', 'section2.png', 'section3.png'].forEach(file => {
        const img = new Image();
        img.onload = () => console.log(`  ✅ ${file}`);
        img.onerror = () => console.log(`  ❌ ${file}`);
        img.src = `assets/projects/${project}/screenshots/${file}`;
    });
});

console.log('\n📊 Test completed! Check the console above for results.');
