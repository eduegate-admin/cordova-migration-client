/**
 * EXAMPLES.js
 * 
 * This file demonstrates common usage patterns for:
 * - Native Tabs Navigation
 * - Liquid Glass Components
 * - Scroll-to-Top Behavior
 * - RSS Feed Integration
 * 
 * Copy and adapt these examples to your own screens.
 */

// ============================================================================
// EXAMPLE 1: Basic Tab Screen with Scroll-to-Top
// ============================================================================

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useScrollToTop, PlatformScrollBehavior } from '../services/ScrollService';
import { useTheme } from '../theme/colors';

export const BasicTabScreen = () => {
  const { colors } = useTheme();
  const { scrollRef, scrollToTop } = useScrollToTop();

  return (
    <ScrollView
      ref={scrollRef}
      scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
      scrollIndicatorInsets={PlatformScrollBehavior.getScrollIndicatorInsets()}
      style={{ backgroundColor: colors.background }}
    >
      <View style={styles.container}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>
          Tab Screen Title
        </Text>
        {/* Your content here */}
      </View>
    </ScrollView>
  );
};

// ============================================================================
// EXAMPLE 2: FlatList with Liquid Glass Cards
// ============================================================================

import { FlatList } from 'react-native';
import LiquidGlassCard from '../components/LiquidGlassCard';

export const ArticlesListScreen = () => {
  const { colors } = useTheme();
  const { scrollRef } = useScrollToTop();

  const DATA = [
    {
      id: '1',
      title: 'Getting Started with React Native',
      author: 'Jane Doe',
      date: '2h ago',
      excerpt: 'Learn the basics of React Native development...',
    },
    {
      id: '2',
      title: 'Building Scalable Apps',
      author: 'John Smith',
      date: '4h ago',
      excerpt: 'Tips and tricks for building production-ready apps...',
    },
  ];

  const renderItem = ({ item }) => (
    <LiquidGlassCard
      title={item.title}
      subtitle={`${item.author} • ${item.date}`}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
        {item.excerpt}
      </Text>
    </LiquidGlassCard>
  );

  return (
    <FlatList
      ref={scrollRef}
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
      contentContainerStyle={{
        paddingBottom: PlatformScrollBehavior.getTabBarHeight() + 16,
      }}
      style={{ backgroundColor: colors.background }}
    />
  );
};

// ============================================================================
// EXAMPLE 3: Using Scroll Manager for Multiple Screens
// ============================================================================

import { ScrollManager } from '../services/ScrollService';

const scrollManager = new ScrollManager();

export const MultiTabScrollManager = () => {
  const handleTabChange = (tabName) => {
    // Automatically scrolls to top when switching to same tab
    scrollManager.handleTabChange(tabName, true);
  };

  const registerTabScroll = (tabName, ref) => {
    scrollManager.registerScroll(tabName, ref);
  };

  // Usage in screen:
  return (
    <ScrollView
      ref={(ref) => registerTabScroll('HomeTab', ref)}
      onContentSizeChange={() => {}}
    >
      {/* Content */}
    </ScrollView>
  );
};

// ============================================================================
// EXAMPLE 4: RSS Feed Integration - Medium Articles
// ============================================================================

import { mediumFeedService } from '../services/MediumFeedService';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export const MediumArticlesScreen = () => {
  const { colors } = useTheme();
  const { scrollRef } = useScrollToTop();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure feeds (do this once in your app)
    mediumFeedService.setFeedUrls([
      'https://medium.com/feed/@react-native-community',
      'https://medium.com/feed/tag/react-native',
      'https://medium.com/feed/tag/expo',
    ]);

    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const result = await mediumFeedService.getAllFeeds();
      setArticles(result.slice(0, 15));
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      ref={scrollRef}
      data={articles}
      renderItem={({ item }) => (
        <LiquidGlassCard
          title={item.title}
          subtitle={`${item.author} • ${item.pubDateFormatted}`}
        >
          <Text
            numberOfLines={2}
            style={{ color: colors.textSecondary, fontSize: 13 }}
          >
            {item.description}
          </Text>
        </LiquidGlassCard>
      )}
      keyExtractor={(item) => item.id}
      onRefresh={loadArticles}
      refreshing={loading}
      scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
      contentContainerStyle={{
        paddingBottom: PlatformScrollBehavior.getTabBarHeight() + 16,
      }}
      style={{ backgroundColor: colors.background }}
    />
  );
};

// ============================================================================
// EXAMPLE 5: Search and Filter RSS Content
// ============================================================================

export const SearchArticlesScreen = () => {
  const { colors } = useTheme();
  const { scrollRef } = useScrollToTop();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const found = await mediumFeedService.searchArticles(query, 20);
      setResults(found);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Input */}
      {/* <SearchInput value={searchQuery} onChange={handleSearch} /> */}

      {/* Results List */}
      <FlatList
        ref={scrollRef}
        data={results}
        renderItem={({ item }) => (
          <LiquidGlassCard title={item.title} subtitle={item.author}>
            <Text style={{ color: colors.textSecondary }}>
              {item.description}
            </Text>
          </LiquidGlassCard>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 50 }}>
            No articles found
          </Text>
        }
        scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
      />
    </View>
  );
};

// ============================================================================
// EXAMPLE 6: Custom Tab Navigator Configuration
// ============================================================================

/**
 * To add custom tabs, modify NativeTabsNavigator.js:
 * 
 * const tabConfig = [
 *   {
 *     name: 'Home',
 *     label: 'Home',
 *     icon: Home,
 *     component: screens.HomeScreen,
 *   },
 *   {
 *     name: 'Articles',
 *     label: 'Articles',
 *     icon: BookOpen,
 *     component: screens.FeaturedArticlesScreen,
 *   },
 *   {
 *     name: 'Favorites',
 *     label: 'Favorites',
 *     icon: Heart,
 *     component: screens.FavoritesScreen,
 *   },
 *   {
 *     name: 'Settings',
 *     label: 'Settings',
 *     icon: Settings,
 *     component: screens.SettingsScreen,
 *   },
 * ];
 */

// ============================================================================
// EXAMPLE 7: Platform-Specific Behavior
// ============================================================================

import { Platform } from 'react-native';

export const PlatformAwareScreen = () => {
  const { colors } = useTheme();

  const tabBarStyle = {
    height: Platform.select({
      ios: 85,    // Includes safe area
      android: 65, // Material Design
    }),
    paddingBottom: Platform.select({
      ios: 20,
      android: 8,
    }),
  };

  const scrollBehavior = {
    scrollEventThrottle: Platform.select({
      ios: 16,   // 60fps
      android: 32, // 30fps
    }),
  };

  return (
    <ScrollView
      scrollEventThrottle={scrollBehavior.scrollEventThrottle}
      style={{ backgroundColor: colors.background }}
    >
      <Text>{Platform.OS === 'ios' ? 'Running on iOS' : 'Running on Android'}</Text>
    </ScrollView>
  );
};

// ============================================================================
// EXAMPLE 8: Styled Cards with Images
// ============================================================================

export const ArticleCardWithImage = ({ article }) => {
  const { colors } = useTheme();

  return (
    <LiquidGlassCard
      title={article.title}
      subtitle={`${article.author} • ${article.pubDateFormatted}`}
      intensity={0.7}
      blurRadius={25}
    >
      <View style={{ gap: 12 }}>
        {article.image && (
          <View
            style={{
              height: 180,
              backgroundColor: colors.border,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {/* Image component would go here */}
          </View>
        )}
        <Text
          numberOfLines={3}
          style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}
        >
          {article.description}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 8,
          }}
        >
          {article.categories.map((cat, idx) => (
            <View
              key={idx}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: colors.border,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 11 }}>
                {cat}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </LiquidGlassCard>
  );
};

// ============================================================================
// EXAMPLE 9: Infinite Scroll / Pagination
// ============================================================================

export const InfiniteScrollScreen = () => {
  const { colors } = useTheme();
  const { scrollRef } = useScrollToTop();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 10;

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const allArticles = await mediumFeedService.getAllFeeds();
      const newArticles = allArticles.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
      );
      setArticles((prev) => [...prev, ...newArticles]);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      ref={scrollRef}
      data={articles}
      renderItem={({ item }) => (
        <LiquidGlassCard title={item.title}>
          <Text style={{ color: colors.textSecondary }}>
            {item.description}
          </Text>
        </LiquidGlassCard>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading && <ActivityIndicator color={colors.primary} size="large" />
      }
      scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
    />
  );
};

// ============================================================================
// EXAMPLE 10: Using Custom Themes with Tabs
// ============================================================================

/**
 * Your theme colors are automatically applied:
 * 
 * const { colors, isDark } = useTheme();
 * 
 * Available colors:
 * - colors.primary      - Main brand color
 * - colors.secondary    - Secondary color
 * - colors.background   - Background color
 * - colors.surface      - Surface color
 * - colors.text         - Primary text color
 * - colors.textSecondary - Secondary text color
 * - colors.border       - Border color
 * - colors.error        - Error color
 * - colors.success      - Success color
 * 
 * isDark - Boolean indicating dark mode
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default {
  BasicTabScreen,
  ArticlesListScreen,
  MediumArticlesScreen,
  SearchArticlesScreen,
  PlatformAwareScreen,
  ArticleCardWithImage,
  InfiniteScrollScreen,
};
