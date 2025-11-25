/**
 * NATIVE_TABS_CONFIG.js
 * 
 * Central configuration file for Expo Native Tabs setup
 * Customize settings here and they'll be used throughout the app
 */

import { Platform } from 'react-native';

// ============================================================================
// TAB CONFIGURATION
// ============================================================================

export const TAB_CONFIG = {
  // Tab bar styling
  BAR: {
    height: Platform.select({ ios: 85, android: 65 }),
    paddingBottom: Platform.select({ ios: 20, android: 8 }),
    borderTopWidth: 1,
  },

  // Blur effect settings
  BLUR: {
    intensity: 80, // 0-100
    effect: Platform.select({ ios: 'dark', android: 'dark' }),
  },

  // Animation settings
  ANIMATION: {
    scrollAnimated: true,
    duration: 300,
    scrollEventThrottle: Platform.select({ ios: 16, android: 32 }),
  },
};

// ============================================================================
// LIQUID GLASS CARD CONFIGURATION
// ============================================================================

export const LIQUID_GLASS_CONFIG = {
  // Default card settings
  CARD: {
    intensity: 0.7,      // 0-1 (lower = less blur)
    blurRadius: 25,      // 0-100 (higher = more blur)
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },

  // Font sizes
  FONT: {
    title: 18,
    subtitle: 14,
    body: 13,
  },
};

// ============================================================================
// SCROLL BEHAVIOR CONFIGURATION
// ============================================================================

export const SCROLL_CONFIG = {
  // Scroll-to-top behavior
  SCROLL_TO_TOP: {
    animated: true,
    animationDuration: 300,
  },

  // Content insets for tab bar
  CONTENT_INSETS: Platform.select({
    ios: { bottom: 85 + 16 },  // tab bar + padding
    android: { bottom: 65 + 16 },
  }),

  // Indicator insets
  SCROLL_INDICATOR_INSETS: Platform.select({
    ios: { bottom: 85 },
    android: { bottom: 65 },
  }),
};

// ============================================================================
// RSS FEED CONFIGURATION
// ============================================================================

export const FEED_CONFIG = {
  // Feed URLs - CUSTOMIZE THIS
  FEED_URLS: [
    // Add your Medium feeds here
    // 'https://medium.com/feed/@your-username',
    // 'https://medium.com/feed/tag/react-native',
    // 'https://medium.com/feed/tag/expo',
  ],

  // Cache settings
  CACHE: {
    TTL: 5 * 60 * 1000,  // 5 minutes
    maxItems: 100,
  },

  // Parser settings
  PARSER: {
    timeout: 10000,  // 10 seconds
    customFields: {
      item: [
        ['media:content', 'mediaContent'],
        ['content:encoded', 'content'],
      ],
    },
  },

  // Fetch limits
  LIMITS: {
    maxArticles: 50,
    searchLimit: 20,
    categoryLimit: 15,
  },
};

// ============================================================================
// THEME INTEGRATION
// ============================================================================

export const THEME_CONFIG = {
  // Colors are applied from your theme system
  // See src/theme/colors.js
  
  DARK_MODE: {
    enabled: true,
    autoDetect: true,  // Use device settings
  },

  // Color fallbacks (if theme unavailable)
  FALLBACK_COLORS: {
    primary: '#007AFF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#A1A1A6',
    border: '#38383A',
  },
};

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

export const ANIMATION_CONFIG = {
  // Reanimated settings
  REANIMATED: {
    useNativeDriver: true,
  },

  // Gesture settings
  GESTURE: {
    enabled: true,
    minDist: 10,  // minimum distance to trigger swipe
  },
};

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

export const LOG_CONFIG = {
  // Enable/disable logging
  DEBUG: {
    scrollEvents: false,
    feedFetches: true,
    navigation: true,
    errors: true,
  },

  // Log prefixes
  PREFIX: {
    scroll: '[ScrollService]',
    feed: '[MediumFeed]',
    nav: '[Navigation]',
  },
};

// ============================================================================
// PLATFORM-SPECIFIC SETTINGS
// ============================================================================

export const PLATFORM_SETTINGS = {
  IOS: {
    // iOS specific settings
    USE_SAFE_AREA: true,
    BLUR_INTENSITY: 80,
    SCROLL_THROTTLE: 16,
    TAB_BAR_HEIGHT: 85,
  },

  ANDROID: {
    // Android specific settings
    USE_MATERIAL_DESIGN: true,
    BLUR_INTENSITY: 70,
    SCROLL_THROTTLE: 32,
    TAB_BAR_HEIGHT: 65,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get platform-specific value
 * @param {any} iosValue - Value for iOS
 * @param {any} androidValue - Value for Android
 * @returns {any} Platform-specific value
 */
export const getPlatformValue = (iosValue, androidValue) => {
  return Platform.select({
    ios: iosValue,
    android: androidValue,
    default: androidValue,
  });
};

/**
 * Get current tab bar height
 * @returns {number} Tab bar height in pixels
 */
export const getTabBarHeight = () => {
  return Platform.select({ ios: 85, android: 65 });
};

/**
 * Get scroll event throttle based on platform
 * @returns {number} Throttle value in milliseconds
 */
export const getScrollEventThrottle = () => {
  return Platform.select({ ios: 16, android: 32 });
};

/**
 * Get content padding bottom for tab bar
 * @returns {object} Object with bottom padding
 */
export const getContentPadding = () => {
  return {
    paddingBottom: getTabBarHeight() + 16,
  };
};

/**
 * Merge default config with custom config
 * @param {object} customConfig - Custom configuration
 * @returns {object} Merged configuration
 */
export const mergeConfig = (customConfig) => {
  return {
    TAB_CONFIG: { ...TAB_CONFIG, ...customConfig.TAB_CONFIG },
    LIQUID_GLASS_CONFIG: { ...LIQUID_GLASS_CONFIG, ...customConfig.LIQUID_GLASS_CONFIG },
    SCROLL_CONFIG: { ...SCROLL_CONFIG, ...customConfig.SCROLL_CONFIG },
    FEED_CONFIG: { ...FEED_CONFIG, ...customConfig.FEED_CONFIG },
    THEME_CONFIG: { ...THEME_CONFIG, ...customConfig.THEME_CONFIG },
  };
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  TAB_CONFIG,
  LIQUID_GLASS_CONFIG,
  SCROLL_CONFIG,
  FEED_CONFIG,
  THEME_CONFIG,
  ANIMATION_CONFIG,
  LOG_CONFIG,
  PLATFORM_SETTINGS,
  getPlatformValue,
  getTabBarHeight,
  getScrollEventThrottle,
  getContentPadding,
  mergeConfig,
};
