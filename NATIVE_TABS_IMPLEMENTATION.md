# Expo Native Tabs Implementation Guide

This guide explains how to use Expo Native Tabs with React Native for native tab navigation on iOS and Android, featuring liquid glass effects, automatic scroll-to-top, and platform-specific behaviors.

## 🛠 Technologies Used

- **React Native** (v0.81.5) - Fully compatible with iOS and Android
- **expo-blur** (v15.0.7) - Frosted-glass UI effects
- **expo-native-tabs** (v1.0.0) - Native tab navigation
- **react-native-bottom-tabs** (v1.0.2) - Enhanced bottom tab support
- Native XML Parser - Dynamic content from RSS feeds

## 📦 Project Structure

```
src/
├── components/
│   ├── LiquidGlassCard.js        # Reusable glassmorphism card
│   └── LiquidGlassButton.js      # Floating action button
├── navigation/
│   ├── AppNavigator.js            # Main navigation container
│   └── NativeTabsNavigator.js     # Native tabs implementation
├── screens/
│   ├── HomeScreen.js
│   ├── DemoScreen.js
│   ├── ProfileScreen.js
│   └── FeaturedArticlesScreen.js  # Example with RSS feeds
├── services/
│   ├── ScrollService.js           # Scroll utilities & hooks
│   ├── MediumFeedService.js       # RSS feed service
│   └── ContextService.js
└── theme/
    └── colors.js                  # Theme configuration
```

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install expo-native-tabs rss-parser @callstack/liquid-glass
```

Or with expo CLI:
```bash
expo install expo-native-tabs rss-parser @callstack/liquid-glass
```

### 2. Update Configuration

The `package.json` has been updated with all required dependencies. Run:

```bash
npm install
# or
expo install
```

## 📱 Core Components

### NativeTabsNavigator.js

The main tabs navigator component that handles:
- Platform-specific UI (iOS: 85px height, Android: 65px height)
- Liquid glass background using expo-blur
- Automatic scroll-to-top when tab is pressed twice
- Active tab state management

**Features:**
- **Scroll-to-Top**: Double-tap a tab to scroll to top
- **Smooth Animations**: Platform-optimized scroll animations
- **Liquid Glass**: Frosted glass effect on tab bar
- **Icon Support**: Uses Lucide React Native icons

### LiquidGlassCard.js

A reusable component for displaying content with glassmorphism effects.

```javascript
import LiquidGlassCard from '../components/LiquidGlassCard';

<LiquidGlassCard
  title="Article Title"
  subtitle="Author • Date"
  intensity={0.7}
  blurRadius={25}
>
  <Text>Card content goes here</Text>
</LiquidGlassCard>
```

## 🔄 Services

### ScrollService.js

Provides utilities for managing scroll behavior across tabs.

**Key Exports:**

- **useScrollToTop()** - Hook for scroll-to-top behavior
  ```javascript
  const { scrollRef, scrollToTop } = useScrollToTop();
  <ScrollView ref={scrollRef}>...</ScrollView>
  ```

- **ScrollManager** - Class for managing multiple scroll refs
  ```javascript
  const manager = new ScrollManager();
  manager.registerScroll('tabName', ref);
  manager.handleTabChange('tabName', true);
  manager.scrollToTop('tabName');
  ```

- **PlatformScrollBehavior** - Platform-specific scroll settings
  ```javascript
  const throttle = PlatformScrollBehavior.getScrollEventThrottle();
  const height = PlatformScrollBehavior.getTabBarHeight();
  const insets = PlatformScrollBehavior.getScrollIndicatorInsets();
  ```

### MediumFeedService.js

Manages RSS feed fetching and caching from Medium and other sources.

**Features:**
- 5-minute cache with automatic invalidation
- Multiple feed support
- Error handling with fallback to cache
- Article search and filtering
- Image extraction
- Relative date formatting

**Usage:**

```javascript
import { mediumFeedService } from '../services/MediumFeedService';

// Fetch all feeds
const articles = await mediumFeedService.getAllFeeds();

// Search articles
const results = await mediumFeedService.searchArticles('react-native', 10);

// Get by category
const category = await mediumFeedService.getArticlesByCategory('expo', 10);

// Add custom feed
mediumFeedService.addFeedUrl('https://medium.com/feed/@username');
```

## 🎨 Theme Integration

The implementation respects your existing theme system:

```javascript
import { useTheme } from '../theme/colors';

const { colors, isDark } = useTheme();
```

Available theme colors:
- `colors.primary` - Primary action color
- `colors.background` - Background color
- `colors.text` - Primary text
- `colors.textSecondary` - Secondary text
- `colors.border` - Border color

## 📋 Implementation Examples

### Basic Tab Screen with Scroll-to-Top

```javascript
import React from 'react';
import { ScrollView } from 'react-native';
import { useScrollToTop } from '../services/ScrollService';

const MyScreen = () => {
  const { scrollRef, scrollToTop } = useScrollToTop();

  return (
    <ScrollView ref={scrollRef}>
      {/* Your content */}
    </ScrollView>
  );
};
```

### RSS Feed Integration

```javascript
import { mediumFeedService } from '../services/MediumFeedService';

// Configure custom Medium feed
mediumFeedService.setFeedUrls([
  'https://medium.com/feed/@your-username',
  'https://medium.com/feed/tag/react-native',
]);

// Fetch articles
const articles = await mediumFeedService.getAllFeeds();

// Use in FlatList
<FlatList
  data={articles}
  renderItem={({ item }) => (
    <LiquidGlassCard title={item.title}>
      <Text>{item.description}</Text>
    </LiquidGlassCard>
  )}
/>
```

## 🎯 Platform-Specific Behaviors

### iOS

- Tab bar height: 85px (includes safe area bottom)
- Scroll throttle: 16ms (60fps)
- Liquid glass with dark/light blur tint
- Smooth animated scrolls

### Android

- Tab bar height: 65px
- Scroll throttle: 32ms (30fps)
- Material Design principles
- Platform-native scroll behavior

## ⚙️ Configuration

### Customize Tab Height

In `NativeTabsNavigator.js`:

```javascript
tabBar: {
  height: Platform.select({ ios: 85, android: 65 }),
  // ...
}
```

### Customize Blur Intensity

In `NativeTabsNavigator.js`:

```javascript
<BlurView
  tint={isDark ? 'dark' : 'light'}
  intensity={80} // 0-100
  style={StyleSheet.absoluteFill}
/>
```

### Configure RSS Feeds

In your screen component:

```javascript
mediumFeedService.setFeedUrls([
  'https://medium.com/feed/@your-username',
  'https://medium.com/feed/tag/your-topic',
  'https://medium.com/feed/publication-name',
]);
```

## 🐛 Troubleshooting

### Scroll not working on Android

Ensure `scrollEventThrottle` is set appropriately:
```javascript
scrollEventThrottle={PlatformScrollBehavior.getScrollEventThrottle()}
```

### Liquid glass not appearing

Verify `expo-blur` is properly installed:
```bash
expo install expo-blur
```

### RSS feeds not loading

- Check feed URL is publicly accessible
- Verify CORS is allowed (use a proxy if needed)
- Check cache TTL (default: 5 minutes)

### Tab bar overlapping content

Add bottom padding to scrollable content:
```javascript
contentContainerStyle={{
  paddingBottom: PlatformScrollBehavior.getTabBarHeight() + 16,
}}
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [@callstack/liquid-glass](https://github.com/callstack/react-native-liquid-glass)
- [React Navigation](https://reactnavigation.org/)
- [rss-parser](https://www.npmjs.com/package/rss-parser)

## 🔗 Related Files

- `src/navigation/AppNavigator.js` - Main entry point
- `src/navigation/NativeTabsNavigator.js` - Tab navigator
- `src/services/ScrollService.js` - Scroll utilities
- `src/services/MediumFeedService.js` - Feed service
- `src/components/LiquidGlassCard.js` - Glass card component

## 📝 Next Steps

1. Update Medium feed URLs in `MediumFeedService.js`
2. Customize tab icons in `NativeTabsNavigator.js`
3. Add more tab screens as needed
4. Style components to match your brand
5. Test on iOS and Android devices

---

**Version:** 1.0.0  
**Last Updated:** November 25, 2025
