# Blog RSS Importer - Guide de Démarrage Rapide

## 🚀 Installation et Configuration (5 minutes)

### 1. Installation
```bash
cd blog-rss-importer
npm install
```

### 2. Configuration
```bash
cp .env.example .env
```

Éditez `.env` avec vos préférences :
```env
OUTPUT_FORMAT=both
OUTPUT_FOLDER=../blog-data
MAX_ARTICLES_PER_FEED=10
CRON_SCHEDULE=0 */6 * * *
```

## 🎯 Utilisation Immédiate

### Option A: Script Complet (Recommandé)
```bash
# Windows
.\run-workflow.bat complete

# Linux/Mac  
./run-workflow.sh complete
```

### Option B: Commandes NPM
```bash
# Workflow complet
npm run workflow

# Import RSS seulement
npm start

# Synchronisation blog seulement
npm run sync

# Test des flux
npm run test
```

## 📊 Ce que fait le workflow

1. **📡 Import RSS** : Récupère 200+ articles de 50+ sources
2. **🔄 Sync Blog** : Intègre les données dans votre blog
3. **📈 Rapport** : Affiche les statistiques et résultats

## 🔧 Intégration avec Blog Existant

Le système intègre automatiquement les données dans :
- `../js/blog.js` : Ajoute les articles RSS
- `../blog.html` : Met à jour les statistiques
- `../data/rss-articles.json` : Fichier de données

## 📈 Résultats Attendus

Après exécution :
```
✅ Import completed: 150 articles
✅ Sync completed: 150 articles synced
📊 RSS Workflow Report:
📡 Import Results: 150 articles, 0 errors
🔄 Sync Results: 150 articles, 45 sources, 6 categories
📈 Blog Status: RSS data integrated ✅
```

## ⚡ Commandes Utiles

```bash
# Statut actuel
npm run workflow:status

# Quick sync (données existantes)
npm run workflow:quick

# Démarrer l'automatisation
npm run workflow:schedule

# Développement avec auto-reload
npm run dev
```

## 🔄 Automatisation

Pour l'import automatique toutes les 6 heures :
```bash
npm run workflow:schedule
```

Ou via script :
```bash
./run-workflow.sh schedule
```

## 📁 Fichiers Créés

```
blog-rss-importer/
├── output/
│   ├── articles/         # Articles .md
│   ├── data/            # Données JSON
│   └── index.html       # Index visuel
├── backups/             # Sauvegardes
├── reports/             # Rapports
└── logs/                # Logs détaillés
```

## 🐛 Problèmes Communs

### "Node.js non trouvé"
Install Node.js depuis [nodejs.org](https://nodejs.org)

### "Erreur de permissions"
```bash
# Linux/Mac
chmod +x run-workflow.sh

# Windows
Exécuter en tant qu'administrateur
```

### "Flux RSS ne répondent pas"
```bash
npm run test
# Affiche les flux qui fonctionnent
```

## 🎉 Prochaines Étapes

1. **Test rapide** : `npm run test`
2. **Premier import** : `npm run workflow`  
3. **Vérifier blog** : Ouvrir `blog.html`
4. **Automatiser** : `npm run workflow:schedule`

---

**Votre blog de veille est maintenant prêt !** 🚀📰✨
