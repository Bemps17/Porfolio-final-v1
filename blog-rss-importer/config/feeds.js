// Configuration des flux RSS organisés par catégorie
const RSS_FEEDS = {
  tech: [
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      language: 'en',
      category: 'tech',
      priority: 1
    },
    {
      name: 'Wired',
      url: 'https://www.wired.com/feed/',
      language: 'en',
      category: 'tech',
      priority: 1
    },
    {
      name: 'The Verge',
      url: 'https://www.theverge.com/rss/index.xml',
      language: 'en',
      category: 'tech',
      priority: 1
    },
    {
      name: 'Ars Technica',
      url: 'https://feeds.arstechnica.com/arstechnica/index',
      language: 'en',
      category: 'tech',
      priority: 1
    },
    {
      name: 'Numerama',
      url: 'https://www.numerama.com/feed/',
      language: 'fr',
      category: 'tech',
      priority: 2
    },
    {
      name: 'ZDNet',
      url: 'https://www.zdnet.com/news/rss.xml',
      language: 'en',
      category: 'tech',
      priority: 2
    },
    {
      name: 'Le Journal du Geek',
      url: 'https://www.journaldugeek.com/feed/',
      language: 'fr',
      category: 'tech',
      priority: 2
    },
    {
      name: 'Clubic',
      url: 'https://www.clubic.com/rss.xml',
      language: 'fr',
      category: 'tech',
      priority: 3
    },
    {
      name: "Tom's Hardware",
      url: 'https://www.tomshardware.com/feeds/all',
      language: 'en',
      category: 'tech',
      priority: 3
    },
    {
      name: 'Gizmodo',
      url: 'https://gizmodo.com/rss',
      language: 'en',
      category: 'tech',
      priority: 3
    },
    {
      name: 'Engadget',
      url: 'https://www.engadget.com/rss.xml',
      language: 'en',
      category: 'tech',
      priority: 3
    },
    {
      name: 'VentureBeat',
      url: 'https://venturebeat.com/feed/',
      language: 'en',
      category: 'tech',
      priority: 3
    },
    {
      name: 'Les Numériques',
      url: 'https://www.lesnumeriques.com/rss.xml',
      language: 'fr',
      category: 'tech',
      priority: 3
    },
    // Sources alternatives fiables
    {
      name: 'Reddit Technology',
      url: 'https://www.reddit.com/r/technology/.rss',
      language: 'en',
      category: 'tech',
      priority: 4
    },
    {
      name: 'Hacker News',
      url: 'https://hnrss.org/frontpage',
      language: 'en',
      category: 'tech',
      priority: 4
    },
    {
      name: 'Dev.to',
      url: 'https://dev.to/feed',
      language: 'en',
      category: 'tech',
      priority: 4
    }
  ],
  
  design: [
    {
      name: 'Smashing Magazine',
      url: 'https://www.smashingmagazine.com/feed/',
      language: 'en',
      category: 'design',
      priority: 1
    },
    {
      name: 'A List Apart',
      url: 'https://alistapart.com/main/feed/',
      language: 'en',
      category: 'design',
      priority: 1
    },
    {
      name: 'CSS-Tricks',
      url: 'https://css-tricks.com/feed/',
      language: 'en',
      category: 'design',
      priority: 1
    },
    {
      name: 'UX Design.cc',
      url: 'https://uxdesign.cc/feed',
      language: 'en',
      category: 'design',
      priority: 2
    },
    {
      name: 'Abduzeedo',
      url: 'https://abduzeedo.com/feed',
      language: 'en',
      category: 'design',
      priority: 2
    },
    {
      name: 'Creative Bloq',
      url: 'https://www.creativebloq.com/rss.xml',
      language: 'en',
      category: 'design',
      priority: 3
    },
    {
      name: 'Graphiste.com',
      url: 'https://graphiste.com/blog/feed/',
      language: 'fr',
      category: 'design',
      priority: 3
    },
    {
      name: 'Designmodo',
      url: 'https://feeds.feedburner.com/designmodo',
      language: 'en',
      category: 'design',
      priority: 3
    },
    {
      name: 'Webdesigner Depot',
      url: 'https://webdesignerdepot.com/feed',
      language: 'en',
      category: 'design',
      priority: 3
    },
    // Alternatives
    {
      name: 'Dribbble Shots',
      url: 'https://dribbble.com/shots/popular.rss',
      language: 'en',
      category: 'design',
      priority: 4
    },
    {
      name: 'Reddit Design',
      url: 'https://www.reddit.com/r/Design/.rss',
      language: 'en',
      category: 'design',
      priority: 4
    }
  ],
  
  dev: [
    {
      name: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/news/rss/',
      language: 'en',
      category: 'dev',
      priority: 1
    },
    {
      name: 'Stack Overflow Blog',
      url: 'https://stackoverflow.blog/feed/',
      language: 'en',
      category: 'dev',
      priority: 1
    },
    {
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/XML/RSS.atom',
      language: 'en',
      category: 'dev',
      priority: 2
    },
    {
      name: 'Developpez.com',
      url: 'https://www.developpez.com/index/rss',
      language: 'fr',
      category: 'dev',
      priority: 2
    },
    // Newsletters et alternatives
    {
      name: 'JavaScript Weekly',
      url: 'https://javascriptweekly.com/rss/',
      language: 'en',
      category: 'dev',
      priority: 3
    },
    {
      name: 'Node Weekly',
      url: 'https://nodeweekly.com/rss/',
      language: 'en',
      category: 'dev',
      priority: 3
    },
    {
      name: 'Frontend Focus',
      url: 'https://frontendfoc.us/rss',
      language: 'en',
      category: 'dev',
      priority: 3
    },
    {
      name: 'Reddit Programming',
      url: 'https://www.reddit.com/r/programming/.rss',
      language: 'en',
      category: 'dev',
      priority: 4
    }
  ],
  
  social: [
    {
      name: 'Product Hunt',
      url: 'https://www.producthunt.com/feed',
      language: 'en',
      category: 'social',
      priority: 1
    },
    {
      name: 'Hacker News',
      url: 'https://hnrss.org/frontpage',
      language: 'en',
      category: 'social',
      priority: 2
    },
    {
      name: 'Reddit WebDev',
      url: 'https://www.reddit.com/r/webdev/.rss',
      language: 'en',
      category: 'social',
      priority: 3
    },
    {
      name: 'GitHub Trending',
      url: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
      language: 'en',
      category: 'social',
      priority: 3
    }
  ],
  
  podcasts: [
    {
      name: 'Syntax FM',
      url: 'https://syntax.fm/rss',
      language: 'en',
      category: 'podcasts',
      priority: 1
    },
    {
      name: 'ShopTalk Show',
      url: 'https://shoptalkshow.com/feed/',
      language: 'en',
      category: 'podcasts',
      priority: 2
    },
    {
      name: 'CSS Tricks Podcast',
      url: 'https://css-tricks.com/podcasts/the-css-podcast/feed/',
      language: 'en',
      category: 'podcasts',
      priority: 3
    }
  ]
};

// Exporter tous les flux dans un tableau plat
const ALL_FEEDS = Object.values(RSS_FEEDS).flat();

// Exporter par priorité (pour charger d'abord les plus importants)
const FEEDS_BY_PRIORITY = {
  high: ALL_FEEDS.filter(feed => feed.priority <= 2),
  medium: ALL_FEEDS.filter(feed => feed.priority === 3),
  low: ALL_FEEDS.filter(feed => feed.priority >= 4)
};

module.exports = {
  RSS_FEEDS,
  ALL_FEEDS,
  FEEDS_BY_PRIORITY
};
