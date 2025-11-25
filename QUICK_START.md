# 🚀 Expo Native Tabs - Quick Start Guide

Get up and running with native tab navigation in minutes!

## ⚡ 5-Minute Setup

### 1. Install Dependencies

```bash
npm install
expo install
```

### 2. Configure Your Medium Feed

Edit `src/services/MediumFeedService.js`:

```javascript
this.feedUrls = [
  'https://medium.com/feed/@your-username',
  'https://medium.com/feed/tag/your-topic',
  'https://medium.com/feed/tag/react-native',
];
```

### 3. Start Your App

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 What You Get

✅ **Native Tab Navigation** - Platform-optimized tab bar for iOS & Android  
✅ **Glass UI Effects** - Frosted glass effect using expo-blur  
✅ **Auto Scroll-to-Top** - Double-tap tabs to scroll to top  
✅ **RSS Feed Integration** - Dynamic content from Medium and other sources  
✅ **Platform Behaviors** - Different heights, scroll speeds for each platform  
✅ **Dark Mode Support** - Automatically adapts to theme  

## 🎯 Key Features

### 1. Native Tabs

The `NativeTabsNavigator` component provides:
- 3 main tabs: Home, Features (Demo), Profile
- Liquid glass background
- Icon-based navigation with Lucide React Native
- Platform-specific styling

### 2. Scroll-to-Top

Automatically scrolls to top when:
- Tab is focused/refocused
- Tab is tapped twice
- Smooth animated scrolls

### 3. Liquid Glass Cards

Use `LiquidGlassCard` to display content:

```javascript
<LiquidGlassCard
  title="Card Title"
  subtitle="Author • Date"
>
  <Text>Content goes here</Text>
</LiquidGlassCard>
```

### 4. RSS Feeds

Fetch and display Medium articles:

```javascript
import { mediumFeedService } from '../services/MediumFeedService';

const articles = await mediumFeedService.getAllFeeds();
```

## 🔧 Common Tasks

### Add a New Tab

1. Update `NativeTabsNavigator.js` - `tabConfig` array
2. Add screen component to `src/screens/`
3. Export from `src/screens/index.js`

### Customize Colors

Edit `src/theme/colors.js` and the hook uses theme automatically.

### Change Tab Bar Height

In `NativeTabsNavigator.js`:
```javascript
height: Platform.select({ ios: 100, android: 70 }),
```

### Disable Liquid Glass

In `NativeTabsNavigator.js`, comment out `<BlurView>` component.

## 📂 File Structure

```
src/
├── navigation/
│   ├── AppNavigator.js           ← Main navigator
│   └── NativeTabsNavigator.js    ← Tabs component
├── services/
│   ├── ScrollService.js          ← Scroll utilities
│   └── MediumFeedService.js      ← RSS feeds
├── components/
│   ├── LiquidGlassCard.js        ← Glass cards
│   └── LiquidGlassButton.js      ← Floating button
└── screens/
    ├── HomeScreen.js
    ├── DemoScreen.js
    ├── ProfileScreen.js
    └── FeaturedArticlesScreen.js ← Example with feeds
```

## 🎨 Customization Examples

### Custom Tab Icons

```javascript
import { Heart, Settings, Bell } from 'lucide-react-native';

const tabConfig = [
  { name: 'Favorites', icon: Heart },
  { name: 'Settings', icon: Settings },
  { name: 'Notifications', icon: Bell },
];
```

### Custom Feed Sources

```javascript
// Add Instagram, Twitter, or any RSS feed
mediumFeedService.addFeedUrl('https://example.com/feed.xml');
```

### Styling Cards

```javascript
<LiquidGlassCard
  intensity={0.5}        // 0-1, lower = less blur
  blurRadius={15}        // 0-100, higher = more blur
  style={{ marginBottom: 20 }}
>
  Content
</LiquidGlassCard>
```

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Scroll not working | Check `scrollEventThrottle` value |
| Blurry text on cards | Reduce `blurRadius` value |
| Tab bar too tall | Adjust height in `NativeTabsNavigator` |
| RSS feeds not loading | Verify feed URL is public + accessible |
| Wrong colors | Check theme in `useTheme()` hook |

## 📚 Learn More

- 📖 **Full Guide**: `NATIVE_TABS_IMPLEMENTATION.md`
- 🔗 **React Native**: https://reactnative.dev/
- 🔗 **Expo**: https://docs.expo.dev/
- 🔗 **Liquid Glass**: https://github.com/callstack/react-native-liquid-glass

## 💡 Pro Tips

1. **Performance**: Memoize expensive components with `React.memo()`
2. **Caching**: RSS feeds cache for 5 minutes by default
3. **Testing**: Test on real devices for best platform experience
4. **Accessibility**: Tab icons use proper color contrast ratios
5. **Offline**: Cached feeds work offline until cache expires

## 🎉 You're Ready!

Your app now has professional native tabs with liquid glass effects and dynamic content. Start exploring and customize to your needs!

---

**Need Help?** Check `NATIVE_TABS_IMPLEMENTATION.md` for detailed documentation.
