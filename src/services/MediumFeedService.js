/**
 * Medium RSS Feed Service
 * Fetches and parses Medium RSS feeds for dynamic content
 * Compatible with React Native / Expo
 * Features:
 * - Multiple feed support
 * - Caching with TTL
 * - Error handling and retry logic
 * - Feed filtering and sorting
 * - Native XML parsing
 */

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class MediumFeedService {
  constructor() {
    this.cache = new Map();
    this.feedUrls = [
      // Add your Medium feeds here
      // 'https://medium.com/feed/@your-username',
      // 'https://medium.com/feed/tag/react-native',
      // 'https://medium.com/feed/tag/expo',
    ];
  }

  /**
   * Parse XML string into JSON object
   * Compatible with React Native
   * @param {string} xml - XML string
   * @returns {object} Parsed object
   */
  parseXML(xml) {
    try {
      // Simple XML parser for RSS feeds (works in React Native)
      const rssMatch = xml.match(/<rss[^>]*>[\s\S]*?<\/rss>/);
      if (!rssMatch) {
        throw new Error('Invalid RSS format');
      }

      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let itemMatch;

      while ((itemMatch = itemRegex.exec(xml)) !== null) {
        const itemXml = itemMatch[1];
        const item = {
          title: this.extractTextFromXml(itemXml, 'title'),
          description: this.extractTextFromXml(itemXml, 'description'),
          content: this.extractTextFromXml(itemXml, 'content:encoded') ||
                   this.extractTextFromXml(itemXml, 'description'),
          link: this.extractTextFromXml(itemXml, 'link'),
          pubDate: this.extractTextFromXml(itemXml, 'pubDate'),
          author: this.extractTextFromXml(itemXml, 'creator') ||
                  this.extractTextFromXml(itemXml, 'author'),
          guid: this.extractTextFromXml(itemXml, 'guid') ||
                this.extractTextFromXml(itemXml, 'link'),
          categories: this.extractCategoriesFromXml(itemXml),
        };
        items.push(item);
      }

      return { items };
    } catch (error) {
      console.error('XML parsing error:', error);
      return { items: [] };
    }
  }

  /**
   * Extract text content from XML element
   * @param {string} xml - XML string
   * @param {string} tag - Tag name
   * @returns {string} Text content
   */
  extractTextFromXml(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    if (match && match[1]) {
      return this.decodeHtml(match[1].trim());
    }
    return '';
  }

  /**
   * Extract categories from XML
   * @param {string} xml - XML string
   * @returns {array} Categories
   */
  extractCategoriesFromXml(xml) {
    const categoryRegex = /<category[^>]*>([^<]*)<\/category>/gi;
    const categories = [];
    let match;
    while ((match = categoryRegex.exec(xml)) !== null) {
      if (match[1]) {
        categories.push(this.decodeHtml(match[1].trim()));
      }
    }
    return categories;
  }

  /**
   * Decode HTML entities
   * @param {string} text - Text with HTML entities
   * @returns {string} Decoded text
   */
  decodeHtml(text) {
    const htmlEntities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
    };
    let decoded = text;
    Object.entries(htmlEntities).forEach(([entity, char]) => {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    });
    return decoded;
  }

  /**
   * Get cached feed or fetch if expired
   * @param {string} feedUrl - URL of the RSS feed
   * @returns {Promise<array>} Array of feed items
   */
  async getFeed(feedUrl) {
    const cached = this.cache.get(feedUrl);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await fetch(feedUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const feed = this.parseXML(xmlText);
      const items = this.transformItems(feed.items || []);
      
      // Cache the results
      this.cache.set(feedUrl, {
        data: items,
        timestamp: Date.now(),
      });

      return items;
    } catch (error) {
      console.error('Error fetching Medium feed:', error);
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Returning expired cache due to fetch error');
        return cached.data;
      }
      return [];
    }
  }

  /**
   * Get all configured feeds
   * @returns {Promise<array>} Combined array of all feed items
   */
  async getAllFeeds() {
    try {
      const feedPromises = this.feedUrls.map(url => this.getFeed(url));
      const feeds = await Promise.all(feedPromises);
      
      // Flatten and sort by date
      const allItems = feeds.flat();
      return allItems.sort((a, b) => 
        new Date(b.pubDate) - new Date(a.pubDate)
      );
    } catch (error) {
      console.error('Error fetching all feeds:', error);
      return [];
    }
  }

  /**
   * Transform RSS items to app format
   * @param {array} items - Raw RSS items
   * @returns {array} Transformed items
   */
  transformItems(items) {
    return items.map(item => ({
      id: item.guid || item.link,
      title: item.title || 'Untitled',
      description: this.stripHtml(item.description || item.content || ''),
      content: item.content || item.description || '',
      link: item.link,
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      pubDateFormatted: this.formatDate(item.pubDate ? new Date(item.pubDate) : new Date()),
      author: item.author || 'Unknown',
      image: this.extractImage(item),
      categories: item.categories || [],
      source: item.source || {},
    }));
  }

  /**
   * Strip HTML tags from text
   * @param {string} html - HTML string
   * @returns {string} Plain text
   */
  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&[^;]+;/g, ' ') // Replace HTML entities
      .trim();
  }

  /**
   * Extract image from feed item
   * @param {object} item - RSS item
   * @returns {string} Image URL or null
   */
  extractImage(item) {
    // Try to extract image from content
    if (item.content) {
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const match = item.content.match(imgRegex);
      if (match && match[1]) return match[1];
    }
    
    // Try media content
    if (item.mediaContent && item.mediaContent.url) {
      return item.mediaContent.url;
    }
    
    return null;
  }

  /**
   * Format date for display
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  /**
   * Search articles by keyword
   * @param {string} keyword - Search keyword
   * @param {number} limit - Maximum results
   * @returns {Promise<array>} Matching articles
   */
  async searchArticles(keyword, limit = 10) {
    const allItems = await this.getAllFeeds();
    const searchLower = keyword.toLowerCase();
    
    return allItems
      .filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.categories.some(cat => 
          cat.toLowerCase().includes(searchLower)
        )
      )
      .slice(0, limit);
  }

  /**
   * Get articles by category
   * @param {string} category - Category name
   * @param {number} limit - Maximum results
   * @returns {Promise<array>} Articles in category
   */
  async getArticlesByCategory(category, limit = 10) {
    const allItems = await this.getAllFeeds();
    const categoryLower = category.toLowerCase();
    
    return allItems
      .filter(item =>
        item.categories.some(cat => 
          cat.toLowerCase().includes(categoryLower)
        )
      )
      .slice(0, limit);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Set custom feed URLs
   * @param {array} urls - Array of feed URLs
   */
  setFeedUrls(urls) {
    this.feedUrls = urls;
    this.clearCache();
  }

  /**
   * Add a feed URL
   * @param {string} url - Feed URL to add
   */
  addFeedUrl(url) {
    if (!this.feedUrls.includes(url)) {
      this.feedUrls.push(url);
    }
  }

  /**
   * Remove a feed URL
   * @param {string} url - Feed URL to remove
   */
  removeFeedUrl(url) {
    this.feedUrls = this.feedUrls.filter(u => u !== url);
    this.cache.delete(url);
  }
}

// Export singleton instance
export const mediumFeedService = new MediumFeedService();

export default MediumFeedService;
