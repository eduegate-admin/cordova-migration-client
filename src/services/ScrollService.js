import { useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Custom hook for managing scroll-to-top behavior in native tabs
 * Automatically scrolls to top when tab is refocused
 * Features:
 * - Platform-specific scroll handling for iOS and Android
 * - Smooth animated scrolls
 * - Automatic scroll on tab focus
 */
export const useScrollToTop = () => {
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);

  // Handle smooth scroll to top with animation
  const scrollToTop = useCallback((animated = true) => {
    if (!scrollRef.current || isScrolling.current) return;

    isScrolling.current = true;
    scrollRef.current.scrollTo({
      y: 0,
      animated,
    });

    // Reset scroll flag after animation completes
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, []);

  // Focus effect for navigation
  useFocusEffect(
    useCallback(() => {
      scrollToTop(true);
    }, [scrollToTop])
  );

  return { scrollRef, scrollToTop };
};

/**
 * Scroll manager for multiple scroll views in tab navigation
 * Handles switching between tabs and scrolling appropriately
 */
export class ScrollManager {
  constructor() {
    this.scrollRefs = {};
    this.activeTab = null;
  }

  /**
   * Register a scroll view for a specific tab
   * @param {string} tabName - Name of the tab
   * @param {object} ref - Reference to ScrollView
   */
  registerScroll(tabName, ref) {
    this.scrollRefs[tabName] = ref;
  }

  /**
   * Handle tab change with optional scroll-to-top
   * @param {string} tabName - Name of the tab to activate
   * @param {boolean} scrollToTop - Whether to scroll to top
   */
  handleTabChange(tabName, scrollToTop = false) {
    if (this.activeTab === tabName && scrollToTop) {
      this.scrollToTop(tabName);
    } else {
      this.activeTab = tabName;
    }
  }

  /**
   * Scroll to top of specific tab
   * @param {string} tabName - Name of the tab
   * @param {boolean} animated - Whether to animate the scroll
   */
  scrollToTop(tabName, animated = true) {
    const ref = this.scrollRefs[tabName];
    if (ref) {
      ref.scrollTo({
        y: 0,
        animated,
      });
    }
  }

  /**
   * Scroll all tabs to top
   * @param {boolean} animated - Whether to animate the scroll
   */
  scrollAllToTop(animated = true) {
    Object.values(this.scrollRefs).forEach((ref) => {
      if (ref) {
        ref.scrollTo({
          y: 0,
          animated,
        });
      }
    });
  }

  /**
   * Get scroll ref for a specific tab
   * @param {string} tabName - Name of the tab
   * @returns {object} ScrollView reference
   */
  getScrollRef(tabName) {
    return this.scrollRefs[tabName];
  }

  /**
   * Clear all registered scroll refs
   */
  clear() {
    this.scrollRefs = {};
    this.activeTab = null;
  }
}

/**
 * Platform-specific scroll behavior
 * Handles differences between iOS and Android
 */
export const PlatformScrollBehavior = {
  /**
   * Get scroll event throttle value based on platform
   * iOS: 16ms (60fps), Android: 32ms (30fps)
   */
  getScrollEventThrottle() {
    return Platform.select({
      ios: 16,
      android: 32,
      default: 16,
    });
  },

  /**
   * Get tab bar height based on platform
   * iOS: 85px (with safe area), Android: 65px
   */
  getTabBarHeight() {
    return Platform.select({
      ios: 85,
      android: 65,
      default: 65,
    });
  },

  /**
   * Get scroll indicator inset based on platform
   */
  getScrollIndicatorInsets() {
    return Platform.select({
      ios: { bottom: 85 },
      android: { bottom: 65 },
      default: { bottom: 65 },
    });
  },
};

export default {
  useScrollToTop,
  ScrollManager,
  PlatformScrollBehavior,
};
