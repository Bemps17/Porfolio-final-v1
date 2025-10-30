// Test simple pour vérifier les données et les compteurs
console.log('🧪 Test de chargement des articles...');

async function testArticlesLoading() {
    try {
        const response = await fetch('./data/articles.json');
        const data = await response.json();
        
        console.log('📊 Données chargées:', data);
        console.log('📝 Nombre d\'articles:', data.articles?.length || 0);
        
        if (data.articles && data.articles.length > 0) {
            console.log('🔍 Analyse des catégories:');
            const categories = {};
            const sources = {};
            
            data.articles.forEach(article => {
                // Compter les catégories
                if (article.category) {
                    categories[article.category] = (categories[article.category] || 0) + 1;
                }
                
                // Compter les sources
                if (article.source) {
                    sources[article.source] = (sources[article.source] || 0) + 1;
                }
            });
            
            console.log('📊 Catégories trouvées:', categories);
            console.log('📊 Sources trouvées:', sources);
            
            // Tester la mise à jour des compteurs
            console.log('🔄 Test mise à jour des compteurs...');
            
            Object.entries(categories).forEach(([category, count]) => {
                const button = document.querySelector(`[data-category="${category}"]`);
                const countElement = button?.querySelector('.category-count');
                
                if (countElement) {
                    countElement.textContent = count;
                    console.log(`✅ Catégorie ${category}: ${count} articles`);
                } else {
                    console.warn(`❌ Catégorie ${category}: bouton ou compteur non trouvé`);
                }
            });
            
            Object.entries(sources).forEach(([source, count]) => {
                // Convertir le nom de source en clé
                const sourceKey = source.toLowerCase().replace(/[^a-z0-9]/g, '-').replace('reddit-', '').replace('programming', 'reddit-programming');
                const button = document.querySelector(`[data-source="${sourceKey}"]`);
                const countElement = button?.querySelector('.source-count');
                
                if (countElement) {
                    countElement.textContent = count;
                    console.log(`✅ Source ${source} (${sourceKey}): ${count} articles`);
                } else {
                    console.warn(`❌ Source ${source} (${sourceKey}): bouton ou compteur non trouvé`);
                }
            });
            
        } else {
            console.warn('⚠️ Aucun article trouvé dans les données');
        }
        
    } catch (error) {
        console.error('❌ Erreur de chargement:', error);
    }
}

// Lancer le test quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM prêt, lancement du test...');
    testArticlesLoading();
});
