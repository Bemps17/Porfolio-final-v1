const axios = require('axios');
const { APIS, CONFIG } = require('../config/apis');

class APIFetcherService {
  constructor() {
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  async fetchAllAPIs() {
    console.log('🌐 Starting API fetching...');
    
    const results = [];
    
    // Product Hunt
    if (APIS.productHunt.enabled) {
      try {
        const phArticles = await this.fetchProductHunt();
        results.push(...phArticles);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'Product Hunt', error: error.message });
        console.error('❌ Product Hunt failed:', error.message);
      }
      this.stats.total++;
    }
    
    // NewsAPI
    if (APIS.newsApi.enabled) {
      try {
        const newsArticles = await this.fetchNewsAPI();
        results.push(...newsArticles);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'NewsAPI', error: error.message });
        console.error('❌ NewsAPI failed:', error.message);
      }
      this.stats.total++;
    }
    
    // Guardian
    if (APIS.guardian.enabled) {
      try {
        const guardianArticles = await this.fetchGuardian();
        results.push(...guardianArticles);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'Guardian', error: error.message });
        console.error('❌ Guardian failed:', error.message);
      }
      this.stats.total++;
    }
    
    // New York Times
    if (APIS.nyt.enabled) {
      try {
        const nytArticles = await this.fetchNYT();
        results.push(...nytArticles);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'NYT', error: error.message });
        console.error('❌ NYT failed:', error.message);
      }
      this.stats.total++;
    }
    
    // GitHub Trending
    if (APIS.github.enabled) {
      try {
        const githubRepos = await this.fetchGitHubTrending();
        results.push(...githubRepos);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'GitHub', error: error.message });
        console.error('❌ GitHub failed:', error.message);
      }
      this.stats.total++;
    }
    
    // Dev.to
    if (APIS.devTo.enabled) {
      try {
        const devArticles = await this.fetchDevTo();
        results.push(...devArticles);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'Dev.to', error: error.message });
        console.error('❌ Dev.to failed:', error.message);
      }
      this.stats.total++;
    }
    
    // Reddit
    if (APIS.reddit.enabled) {
      try {
        const redditPosts = await this.fetchReddit();
        results.push(...redditPosts);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'Reddit', error: error.message });
        console.error('❌ Reddit failed:', error.message);
      }
      this.stats.total++;
    }
    
    // Hacker News
    if (APIS.hackerNews.enabled) {
      try {
        const hnPosts = await this.fetchHackerNews();
        results.push(...hnPosts);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'Hacker News', error: error.message });
        console.error('❌ Hacker News failed:', error.message);
      }
      this.stats.total++;
    }
    
    // Behance
    if (APIS.behance.enabled) {
      try {
        const behanceProjects = await this.fetchBehance();
        results.push(...behanceProjects);
        this.stats.successful++;
      } catch (error) {
        this.stats.failed++;
        this.stats.errors.push({ api: 'Behance', error: error.message });
        console.error('❌ Behance failed:', error.message);
      }
      this.stats.total++;
    }
    
    console.log(`✅ API fetching completed: ${this.stats.successful}/${this.stats.total} successful`);
    
    return {
      articles: results,
      stats: this.stats
    };
  }

  async fetchProductHunt() {
    console.log('🚀 Fetching Product Hunt posts...');
    
    const response = await axios.post(
      APIS.productHunt.url,
      { query: APIS.productHunt.query },
      {
        headers: {
          ...APIS.productHunt.headers,
          'Authorization': `Bearer ${APIS.productHunt.token}`
        },
        timeout: 10000
      }
    );
    
    const posts = response.data.data.posts.edges;
    
    return posts.map(({ node }) => ({
      id: `product-hunt-${node.id}`,
      title: node.name,
      url: node.url,
      content: node.description || node.tagline,
      summary: node.tagline,
      author: 'Product Hunt Community',
      source: 'Product Hunt',
      sourceUrl: 'producthunt.com',
      category: 'social',
      language: 'en',
      publishedAt: node.createdAt,
      createdAt: new Date().toISOString(),
      tags: this.extractProductHuntTags(node),
      image: null,
      metadata: {
        votesCount: node.votesCount,
        website: node.website,
        topics: node.topics.edges.map(edge => edge.node.name),
        featuredAt: node.featuredAt
      }
    }));
  }

  async fetchNewsAPI() {
    console.log('📰 Fetching NewsAPI articles...');
    
    const results = [];
    
    for (const [queryName, query] of Object.entries(APIS.newsApi.queries)) {
      try {
        const response = await axios.get(`${APIS.newsApi.url}${APIS.newsApi.endpoints.everything}`, {
          headers: APIS.newsApi.headers,
          params: {
            q: query,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 10,
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
          },
          timeout: 10000
        });
        
        const articles = response.data.articles.map(article => ({
          id: `newsapi-${queryName}-${article.url}`,
          title: article.title,
          url: article.url,
          content: article.content || article.description || '',
          summary: article.description || '',
          author: article.author || 'NewsAPI',
          source: article.source.name,
          sourceUrl: article.source.id ? `https://${article.source.id}.com` : 'newsapi.org',
          category: this.mapNewsAPICategory(queryName),
          language: 'en',
          publishedAt: article.publishedAt,
          createdAt: new Date().toISOString(),
          tags: [queryName, 'news', 'api'],
          image: article.urlToImage,
          metadata: {
            query: queryName,
            sourceId: article.source.id
          }
        }));
        
        results.push(...articles);
        console.log(`✅ NewsAPI ${queryName}: ${articles.length} articles`);
        
      } catch (error) {
        console.warn(`⚠️ NewsAPI ${queryName} failed:`, error.message);
      }
    }
    
    return results;
  }

  async fetchGuardian() {
    console.log('🇬🇧 Fetching Guardian articles...');
    
    const results = [];
    
    for (const section of APIS.guardian.sections) {
      try {
        const response = await axios.get(`${APIS.guardian.url}/${section}`, {
          headers: APIS.guardian.headers,
          params: {
            'api-key': APIS.guardian.token,
            'page-size': 5,
            'order-by': 'newest',
            'show-fields': 'headline,shortUrl,trailText,byline,thumbnail,body'
          },
          timeout: 10000
        });
        
        const articles = response.data.response.results.map(article => ({
          id: `guardian-${section}-${article.id}`,
          title: article.fields.headline,
          url: article.fields.shortUrl,
          content: article.fields.body || article.fields.trailText || '',
          summary: article.fields.trailText || '',
          author: article.fields.byline || 'Guardian',
          source: 'The Guardian',
          sourceUrl: 'theguardian.com',
          category: this.mapGuardianCategory(section),
          language: 'en',
          publishedAt: article.webPublicationDate,
          createdAt: new Date().toISOString(),
          tags: [section, 'guardian', 'news'],
          image: article.fields.thumbnail,
          metadata: {
            section: section,
            sectionId: article.sectionId
          }
        }));
        
        results.push(...articles);
        console.log(`✅ Guardian ${section}: ${articles.length} articles`);
        
      } catch (error) {
        console.warn(`⚠️ Guardian ${section} failed:`, error.message);
      }
    }
    
    return results;
  }

  async fetchNYT() {
    console.log('🗽 Fetching New York Times articles...');
    
    const results = [];
    
    for (const section of APIS.nyt.sections) {
      try {
        const response = await axios.get(`${APIS.nyt.url}/${section}.json`, {
          headers: APIS.nyt.headers,
          params: {
            'api-key': APIS.nyt.token
          },
          timeout: 10000
        });
        
        const articles = response.data.results.map(article => ({
          id: `nyt-${section}-${article.url}`,
          title: article.title,
          url: article.url,
          content: article.abstract || '',
          summary: article.abstract || '',
          author: article.byline || 'New York Times',
          source: 'New York Times',
          sourceUrl: 'nytimes.com',
          category: this.mapNYTCategory(section),
          language: 'en',
          publishedAt: article.published_date,
          createdAt: new Date().toISOString(),
          tags: [section, 'nyt', 'news'],
          image: article.multimedia && article.multimedia.length > 0 
            ? `https://www.nytimes.com/${article.multimedia[0].url}` 
            : null,
          metadata: {
            section: section,
            subsection: article.subsection,
            item_type: article.item_type
          }
        }));
        
        results.push(...articles);
        console.log(`✅ NYT ${section}: ${articles.length} articles`);
        
      } catch (error) {
        console.warn(`⚠️ NYT ${section} failed:`, error.message);
      }
    }
    
    return results;
  }

  async fetchGitHubTrending() {
    console.log('💻 Fetching GitHub trending repositories...');
    
    const response = await axios.get(`${APIS.github.url}/search/repositories`, {
      headers: APIS.github.headers,
      params: {
        q: 'created:>2024-01-01 stars:>100',
        sort: 'stars',
        order: 'desc',
        per_page: 20
      },
      timeout: 10000
    });
    
    return response.data.items.map(repo => ({
      id: `github-${repo.id}`,
      title: repo.full_name,
      url: repo.html_url,
      content: repo.description || '',
      summary: repo.description || '',
      author: repo.owner.login,
      source: 'GitHub',
      sourceUrl: 'github.com',
      category: 'dev',
      language: repo.language ? 'en' : 'en',
      publishedAt: repo.created_at,
      createdAt: new Date().toISOString(),
      tags: this.extractGitHubTags(repo),
      image: repo.owner.avatar_url,
      metadata: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        homepage: repo.homepage
      }
    }));
  }

  async fetchDevTo() {
    console.log('📝 Fetching Dev.to articles...');
    
    const response = await axios.get(`${APIS.devTo.url}/articles/latest`, {
      headers: APIS.devTo.headers,
      params: {
        per_page: 20
      },
      timeout: 10000
    });
    
    return response.data.map(article => ({
      id: `devto-${article.id}`,
      title: article.title,
      url: article.url,
      content: this.stripHTML(article.body_html || ''),
      summary: article.description || '',
      author: article.user.name,
      source: 'Dev.to',
      sourceUrl: 'dev.to',
      category: 'dev',
      language: 'en',
      publishedAt: article.published_at,
      createdAt: new Date().toISOString(),
      tags: article.tag_list || [],
      image: article.cover_image || article.social_image,
      metadata: {
        reactions: article.public_reactions_count,
        comments: article.comments_count,
        readingTime: article.reading_time_minutes
      }
    }));
  }

  async fetchReddit() {
    console.log('🤖 Fetching Reddit posts...');
    
    const results = [];
    
    for (const subreddit of APIS.reddit.subreddits.slice(0, 5)) { // Limiter à 5 subreddits
      try {
        const response = await axios.get(`${APIS.reddit.url}/r/${subreddit}/hot.json`, {
          headers: APIS.reddit.headers,
          params: {
            limit: 10
          },
          timeout: 5000
        });
        
        const posts = response.data.data.children.map(child => child.data);
        
        results.push(...posts.map(post => ({
          id: `reddit-${post.id}`,
          title: post.title,
          url: `https://reddit.com${post.permalink}`,
          content: this.stripHTML(post.selftext || ''),
          summary: post.selftext ? post.selftext.substring(0, 200) : '',
          author: post.author,
          source: `Reddit r/${subreddit}`,
          sourceUrl: 'reddit.com',
          category: this.mapRedditCategory(subreddit),
          language: 'en',
          publishedAt: new Date(post.created_utc * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          tags: [subreddit, 'reddit'],
          image: post.url && post.url.match(/\.(jpg|jpeg|png|gif)$/i) ? post.url : null,
          metadata: {
            score: post.score,
            comments: post.num_comments,
            subreddit: subreddit,
            upvoteRatio: post.upvote_ratio
          }
        })));
        
      } catch (error) {
        console.warn(`⚠️ Failed to fetch r/${subreddit}:`, error.message);
      }
    }
    
    return results;
  }

  async fetchHackerNews() {
    console.log('🍊 Fetching Hacker News stories...');
    
    const response = await axios.get(`${APIS.hackerNews.url}/topstories.json`, {
      timeout: 5000
    });
    
    const storyIds = response.data.slice(0, 20); // Top 20 stories
    const stories = [];
    
    for (const id of storyIds.slice(0, 10)) { // Limiter à 10 pour la performance
      try {
        const storyResponse = await axios.get(`${APIS.hackerNews.url}/item/${id}.json`, {
          timeout: 3000
        });
        
        const story = storyResponse.data;
        
        if (story && story.title && story.url) {
          stories.push({
            id: `hackernews-${story.id}`,
            title: story.title,
            url: story.url,
            content: story.text ? this.stripHTML(story.text) : '',
            summary: story.text ? story.text.substring(0, 200) : '',
            author: story.by,
            source: 'Hacker News',
            sourceUrl: 'news.ycombinator.com',
            category: 'tech',
            language: 'en',
            publishedAt: new Date(story.time * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            tags: ['hackernews', 'tech'],
            image: null,
            metadata: {
              score: story.score,
              comments: story.descendants || 0,
              type: story.type
            }
          });
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch HN story ${id}:`, error.message);
      }
    }
    
    return stories;
  }

  async fetchBehance() {
    console.log('🎨 Fetching Behance projects...');
    
    const response = await axios.get(`${APIS.behance.url}${APIS.behance.endpoints.featured}`, {
      headers: {
        ...APIS.behance.headers,
        'X-API-KEY': APIS.behance.token
      },
      params: {
        per_page: 15
      },
      timeout: 10000
    });
    
    return response.data.projects.map(project => ({
      id: `behance-${project.id}`,
      title: project.name,
      url: project.url,
      content: project.description || '',
      summary: project.description ? project.description.substring(0, 200) : '',
      author: project.owners[0]?.display_name || 'Behance User',
      source: 'Behance',
      sourceUrl: 'behance.net',
      category: 'design',
      language: 'en',
      publishedAt: project.published_on ? new Date(project.published_on * 1000).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: project.tags || [],
      image: project.covers?.original || project.covers?.['404'] || null,
      metadata: {
        likes: project.stats?.appreciations || 0,
        views: project.stats?.views || 0,
        comments: project.stats?.comments || 0,
        fields: project.fields || []
      }
    }));
  }

  // Helper methods
  extractProductHuntTags(node) {
    const tags = ['product-hunt', 'startup', 'tech'];
    if (node.topics && node.topics.edges) {
      tags.push(...node.topics.edges.map(edge => edge.node.name.toLowerCase()));
    }
    return [...new Set(tags)];
  }

  extractGitHubTags(repo) {
    const tags = ['github', 'open-source'];
    if (repo.language) {
      tags.push(repo.language.toLowerCase());
    }
    if (repo.topics && repo.topics.length > 0) {
      tags.push(...repo.topics.slice(0, 5));
    }
    return [...new Set(tags)];
  }

  mapNewsAPICategory(queryName) {
    const categoryMap = {
      'tech': 'tech',
      'design': 'design',
      'webdev': 'dev'
    };
    return categoryMap[queryName] || 'tech';
  }

  mapGuardianCategory(section) {
    const categoryMap = {
      'technology': 'tech',
      'games': 'tech',
      'artanddesign': 'design'
    };
    return categoryMap[section] || 'tech';
  }

  mapNYTCategory(section) {
    const categoryMap = {
      'technology': 'tech',
      'science': 'tech'
    };
    return categoryMap[section] || 'tech';
  }

  mapRedditCategory(subreddit) {
    const categoryMap = {
      'technology': 'tech',
      'programming': 'dev',
      'webdev': 'dev',
      'design': 'design',
      'javascript': 'dev',
      'reactjs': 'dev',
      'node': 'dev',
      'css': 'design',
      'UserExperience': 'design',
      'Futurology': 'tech',
      'tech': 'tech'
    };
    return categoryMap[subreddit] || 'social';
  }

  stripHTML(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  getStats() {
    return this.stats;
  }

  resetStats() {
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }
}

module.exports = APIFetcherService;
