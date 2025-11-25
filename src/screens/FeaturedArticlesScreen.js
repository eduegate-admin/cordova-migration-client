import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Platform, FlatList, Text } from 'react-native';
import { useTheme } from '../theme/colors';
import { useScrollToTop, ScrollManager, PlatformScrollBehavior } from '../services/ScrollService';
import { mediumFeedService } from '../services/MediumFeedService';
import LiquidGlassCard from '../components/LiquidGlassCard';

/**
 * FeaturedArticlesScreen
 * Demonstrates native tabs with:
 * - Liquid glass cards
 * - Dynamic Medium RSS feed content
 * - Automatic scroll-to-top on tab focus
 * - Platform-specific behaviors for iOS/Android
 */
const FeaturedArticlesScreen = () => {
  const { colors } = useTheme();
  const scrollManager = new ScrollManager();
  const { scrollRef, scrollToTop } = useScrollToTop();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await mediumFeedService.getAllFeeds();
      setArticles(result.slice(0, 20)); // Limit to 20 articles
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const renderArticleCard = ({ item }) => (
    <LiquidGlassCard
      title={item.title}
      subtitle={`${item.author} • ${item.pubDateFormatted}`}
      key={item.id}
    >
      <View style={styles.cardContent}>
        {item.image && (
          <View style={[styles.cardImage, { backgroundColor: colors.border }]} />
        )}
        <View style={styles.cardText}>
          <Text
            numberOfLines={2}
            style={[styles.description, { color: colors.textSecondary }]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </LiquidGlassCard>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Featured Articles
      </Text>
      <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
        Latest from Medium
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={scrollRef}
      scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
      scrollIndicatorInsets={PlatformScrollBehavior.getScrollIndicatorInsets()}
      data={articles}
      renderItem={renderArticleCard}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContent}
      style={{ backgroundColor: colors.background }}
      scrollEnabled={true}
      onRefresh={fetchArticles}
      refreshing={loading}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: PlatformScrollBehavior.getTabBarHeight() + 16,
  },
  cardContent: {
    gap: 12,
  },
  cardImage: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardText: {
    gap: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default FeaturedArticlesScreen;
