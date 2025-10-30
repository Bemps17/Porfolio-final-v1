// Configuration des APIs externes
require('dotenv').config();

const APIS = {
  productHunt: {
    enabled: process.env.PRODUCT_HUNT_TOKEN && process.env.PRODUCT_HUNT_TOKEN !== 'YOUR_TOKEN_HERE',
    token: process.env.PRODUCT_HUNT_TOKEN,
    url: 'https://api.producthunt.com/v2/api/graphql',
    query: `
      {
        posts(first: 20, order: VOTES, postedAfter: "2024-01-01T00:00:00Z") {
          edges {
            node {
              id
              name
              tagline
              url
              createdAt
              votesCount
              website
              description
              featuredAt
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  newsApi: {
    enabled: process.env.NEWS_API_TOKEN && process.env.NEWS_API_TOKEN !== 'YOUR_TOKEN_HERE',
    token: process.env.NEWS_API_TOKEN,
    url: 'https://newsapi.org/v2',
    endpoints: {
      everything: '/everything',
      topHeadlines: '/top-headlines'
    },
    queries: {
      tech: 'technology OR programming OR software OR startup',
      design: 'design OR UX OR UI OR web design',
      webdev: 'web development OR javascript OR react OR node'
    },
    headers: {
      'Authorization': `Bearer ${process.env.NEWS_API_TOKEN}`
    }
  },
  
  guardian: {
    enabled: process.env.GUARDIAN_TOKEN && process.env.GUARDIAN_TOKEN !== 'YOUR_TOKEN_HERE',
    token: process.env.GUARDIAN_TOKEN,
    url: 'https://content.guardianapis.com',
    sections: ['technology', 'games', 'artanddesign'],
    headers: {
      'Accept': 'application/json'
    }
  },
  
  nyt: {
    enabled: process.env.NYT_TOKEN && process.env.NYT_TOKEN !== 'YOUR_TOKEN_HERE',
    token: process.env.NYT_TOKEN,
    url: 'https://api.nytimes.com/svc/topstories/v2',
    sections: ['technology', 'science'],
    headers: {
      'Accept': 'application/json'
    }
  },
  
  github: {
    enabled: true, // Public API, no token needed for trending
    url: 'https://api.github.com',
    endpoints: {
      search: '/search/repositories',
      trending: '/search/repositories'
    },
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Blog-RSS-Importer'
    }
  },
  
  reddit: {
    enabled: true,
    url: 'https://www.reddit.com',
    subreddits: [
      'technology',
      'programming',
      'webdev',
      'design',
      'javascript',
      'reactjs',
      'node',
      'css',
      'UserExperience',
      'Futurology',
      'tech'
    ],
    headers: {
      'User-Agent': 'Blog-RSS-Importer/1.0'
    }
  },
  
  hackerNews: {
    enabled: true,
    url: 'https://hacker-news.firebaseio.com/v0',
    endpoints: {
      top: '/topstories.json',
      new: '/newstories.json',
      best: '/beststories.json',
      item: '/item/{id}.json'
    }
  },
  
  devTo: {
    enabled: true,
    url: 'https://dev.to/api',
    endpoints: {
      articles: '/articles',
      latest: '/articles/latest',
      top: '/articles/top'
    },
    headers: {
      'Accept': 'application/json'
    }
  },
  
  behance: {
    enabled: process.env.BEHANCE_TOKEN && process.env.BEHANCE_TOKEN !== 'YOUR_TOKEN_HERE',
    token: process.env.BEHANCE_TOKEN,
    url: 'https://api.behance.net/v2',
    endpoints: {
      projects: '/projects',
      featured: '/projects/featured'
    },
    headers: {
      'Accept': 'application/json'
    }
  }
};

// Configuration générale
const CONFIG = {
  // Options de sortie
  output: {
    format: process.env.OUTPUT_FORMAT || 'json', // 'json', 'markdown', 'both'
    folder: process.env.OUTPUT_FOLDER || './output',
    maxArticles: parseInt(process.env.MAX_ARTICLES_PER_FEED) || 15,
    includeImages: true,
    generateIndex: true
  },
  
  // Options de filtrage
  filtering: {
    enableDeduplication: process.env.ENABLE_DEDUPLICATION === 'true',
    filterFrench: process.env.FILTER_FRENCH === 'true',
    minContentLength: parseInt(process.env.MIN_CONTENT_LENGTH) || 100,
    excludeKeywords: ['spam', 'advertisement', 'sponsored', 'promoted'],
    includeKeywords: []
  },
  
  // Options de planification
  scheduling: {
    enabled: true,
    cron: process.env.CRON_SCHEDULE || '0 */6 * * *', // Toutes les 6 heures
    retryFailed: true,
    maxRetries: 3,
    retryDelay: 5000 // 5 secondes
  },
  
  // Options de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
    saveToFile: true,
    logFolder: './logs',
    maxLogFiles: 10
  }
};

module.exports = {
  APIS,
  CONFIG
};
