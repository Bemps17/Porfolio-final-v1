# Blog RSS Importer

Solution Node.js complète pour importer automatiquement des articles via flux RSS et API vers votre blog de veille technologique.

## 🚀 Installation Rapide

```bash
cd blog-rss-importer
npm install
cp .env.example .env
```

## ⚙️ Configuration

Éditez le fichier `.env` avec vos configurations :

```env
# Product Hunt API (optionnel)
PRODUCT_HUNT_TOKEN=votre_token_ici

# GitHub API (optionnel) 
GITHUB_TOKEN=votre_token_github

# Sortie
OUTPUT_FORMAT=both          # json, markdown, both
OUTPUT_FOLDER=../blog-data  # Dossier de sortie
MAX_ARTICLES_PER_FEED=10    # Articles max par flux

# Automatisation
CRON_SCHEDULE=0 */6 * * *   # Toutes les 6 heures
```

## 🎯 Utilisation

### Import Manuel
```bash
npm start
```

### Test des Flux
```bash
npm run test
```

### Développement (auto-reload)
```bash
npm run dev
```

### Démarrer l'Automatisation
```bash
node index.js schedule
```

## 📊 Fonctionnalités

### 🔄 Sources Multiples
- **50+ flux RSS** : TechCrunch, Wired, Smashing Magazine, etc.
- **APIs externes** : Product Hunt, GitHub, Dev.to, Reddit, Hacker News
- **Priorités** : chargement optimisé par importance

### 🎯 Filtrage Intelligent
- **Dédoublonnage** : suppression automatique des doublons
- **Qualité** : filtrage par longueur de contenu et mots-clés
- **Langues** : support FR/EN avec filtrage optionnel

### 💾 Formats de Sortie
- **JSON** : données structurées avec métadonnées
- **Markdown** : fichiers prêts pour Hugo, Jekyll, etc.
- **Index HTML** : visualisation rapide des articles

### ⏰ Automatisation
- **Cron intégré** : import automatique programmé
- **Retry logic** : nouvelle tentative en cas d'échec
- **Logging** : traces complètes des opérations

## 📁 Structure des Fichiers

```
blog-rss-importer/
├── index.js              # Script principal
├── test.js               # Tests des flux
├── package.json          # Dépendances
├── .env.example          # Configuration exemple
├── config/
│   ├── feeds.js          # Configuration RSS (50+ sources)
│   └── apis.js           # Configuration APIs
├── services/
│   ├── rssParser.js      # Service RSS parser
│   ├── apiFetcher.js     # Service API fetcher  
│   └── formatter.js      # Service formatage
└── output/               # Fichiers générés
    ├── articles/         # Articles .md
    ├── data/            # Fichiers .json
    └── index.html       # Index visuel
```

## 📈 Résultats Attendus

Après exécution, vous obtenez :

### 📁 Fichiers JSON
```json
{
  "articles": [...],
  "metadata": {
    "total": 150,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "categories": [...],
    "sources": [...]
  }
}
```

### 📝 Fichiers Markdown
```markdown
---
title: "Article Title"
date: "2024-01-15"
source: "TechCrunch"
category: "tech"
tags: ["ai", "startup"]
---

# Article Title

**Source:** [TechCrunch](url)  
**Published:** Jan 15, 2024

Content...
```

### 🌐 Index HTML
- Page web de visualisation
- Articles par catégorie
- Statistiques détaillées

## 🔧 Intégration avec Blog

### Option 1: Fichiers Statiques
Copiez les fichiers générés vers votre blog :
```bash
cp -r output/articles/* ../blog/content/
cp output/data/articles.json ../blog/data/
```

### Option 2: API Endpoint
Utilisez le JSON généré comme API :
```javascript
// Dans votre blog
fetch('./blog-data/articles.json')
  .then(res => res.json())
  .then(data => {
    // Afficher les articles
  });
```

### Option 3: CMS Headless
Adaptez le service `formatter.js` pour poster vers :
- Strapi API
- Ghost API  
- Directus API
- Votre propre API

## 📊 Monitoring

### Statistiques en Temps Réel
```bash
node index.js stats
```

### Logs Détaillés
```bash
tail -f logs/import.log
```

### État des Sources
```bash
npm run test
```

## 🚀 Production

### Docker (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js", "schedule"]
```

### Service Systemd
```ini
[Unit]
Description=Blog RSS Importer
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/blog-importer
ExecStart=/usr/bin/node index.js schedule
Restart=always

[Install]
WantedBy=multi-user.target
```

## 🛠️ Personnalisation

### Ajouter des Flux RSS
Éditez `config/feeds.js` :
```javascript
{
  name: 'Nouveau Flux',
  url: 'https://example.com/feed.xml',
  language: 'fr',
  category: 'tech',
  priority: 2
}
```

### Ajouter une API
Éditez `services/apiFetcher.js` et `config/apis.js`.

### Personnaliser le Format
Éditez `services/formatter.js` pour modifier :
- Le format Markdown
- Les métadonnées JSON
- Le template HTML

## 🐛 Dépannage

### Problèmes Communs
- **CORS** : Utilisé en Node.js, plus de problème CORS
- **Rate Limits** : Attentes intégrées entre les requêtes
- **Flux HS** : Logging détaillé et fallbacks

### Debug
```bash
DEBUG=* npm start
```

## 📞 Support

- **Logs** : `logs/` pour le diagnostic
- **Tests** : `npm run test` pour vérifier les flux
- **Stats** : `node index.js stats` pour les performances

---

🎉 **Votre blog de veille est maintenant automatisé avec 50+ sources RSS et APIs !**
