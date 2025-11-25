# 📊 Expo Native Tabs - Architecture & Visual Guide

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                              │
│                    (Root Component)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼──────────────┐        ┌────────▼─────────┐
   │  ThemeProvider    │        │ SafeAreaProvider │
   └────┬──────────────┘        └────────┬─────────┘
        │                                 │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │    AppNavigator.js              │
        │  (NavigationContainer)          │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼──────────────────┐    ┌────────▼──────────────┐
   │  AuthNavigator        │    │ TabNavigator         │
   │  (Stack Navigator)    │    │ (View Container)     │
   │                       │    │                      │
   │  • LoginScreen        │    │ NativeTabsNavigator  │
   │  • RegisterScreen     │    │ └──┬────────┬────┬─┐ │
   │                       │    │    │        │    │ │ │
   └───────────────────────┘    │  ┌─▼┐     ┌▼─┐ ┌▼─▼┐│
                                │  │H │     │D │ │P ││
                                │  │o │     │e │ │r ││
                                │  │m │     │m │ │o ││
                                │  │e │     │o │ │f ││
                                │  └─┘     └─┘ └──┘│
                                │  (Tab Selection)  │
                                │                   │
                                │  ┌───────────┐   │
                                │  │ Tab Bar   │   │
                                │  │ Blur View │   │
                                │  │ Glass FX  │   │
                                │  └───────────┘   │
                                └───────────────────┘
```

## 🎨 Component Tree

```
AppNavigator
├── AuthNavigator
│   ├── LoginScreen
│   └── RegisterScreen
│
└── TabNavigator
    └── NativeTabsNavigator
        ├── Content Area (ScrollView/FlatList)
        │   ├── HomeScreen
        │   │   └── ScrollView (useScrollToTop hook)
        │   ├── DemoScreen
        │   │   └── ScrollView (useScrollToTop hook)
        │   └── ProfileScreen
        │       └── ScrollView (useScrollToTop hook)
        │
        └── Tab Bar
            ├── BlurView (Liquid Glass)
            ├── Tab Button (Home) + Icon
            ├── Tab Button (Features) + Icon
            └── Tab Button (Profile) + Icon
```

## 📱 UI Layout

### iOS Layout (Portrait)
```
┌────────────────────────┐
│    Status Bar (20px)   │ Dark style
├────────────────────────┤
│                        │
│                        │
│   Main Content Area    │ ScrollView
│   (Tab Content)        │ useScrollToTop
│                        │
│                        │
│                        │
├────────────────────────┤
│  [🏠]  [⚡]  [👤]      │ Tab Bar
│ Home Features Profile  │ Height: 85px (iOS)
│                   (SA) │ With Safe Area
└────────────────────────┘
```

### Android Layout (Portrait)
```
┌────────────────────────┐
│    Status Bar          │
├────────────────────────┤
│                        │
│                        │
│   Main Content Area    │ ScrollView
│   (Tab Content)        │ useScrollToTop
│                        │
│                        │
│                        │
│                        │
├────────────────────────┤
│  [🏠]  [⚡]  [👤]      │ Tab Bar
│ Home Features Profile  │ Height: 65px
├────────────────────────┤
│ Navigation Bar Area    │ Android Nav
└────────────────────────┘
```

## 🔄 Data Flow

```
┌─────────────────────────────┐
│  MediumFeedService          │
│  (RSS Parser)               │
└────────────┬────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  Feed URLs      │
    │  • Medium.com   │
    │  • RSS Feeds    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Cache Layer    │
    │  (5min TTL)     │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Parsed Articles        │
    │  • Title                │
    │  • Author               │
    │  • Date                 │
    │  • Image                │
    │  • Categories           │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  FlatList Component     │
    │  (Render Articles)      │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  LiquidGlassCard        │
    │  (Display Article)      │
    └─────────────────────────┘
```

## 🎯 Scroll-to-Top Flow

```
User Action                Implementation              Result
───────────────────────────────────────────────────────────────

Tab is Focused      ──►  useFocusEffect hook  ──►  Scroll to top
                        (useScrollToTop)          (animated)

Tab is Pressed      ──►  Check if same tab    ──►  If yes: scroll to top
Twice                    (activeTab === tabName)   If no: switch tab

Double Tap          ──►  ScrollManager detects ──►  scrollToTop()
Action                   double tap                called with animation
```

## 🛠️ Service Architecture

```
┌─────────────────────────────────────┐
│        ScrollService                │
├─────────────────────────────────────┤
│ Exports:                            │
│ • useScrollToTop()        (hook)    │
│ • ScrollManager           (class)   │
│ • PlatformScrollBehavior (object)   │
└──────────┬────────────────┬─────────┘
           │                │
      iOS  │      Android   │
   ┌──────▼─┐          ┌────▼──────┐
   │ 60fps  │          │ 30fps     │
   │ 85px   │          │ 65px      │
   │ Safe   │          │ Material  │
   │ Area   │          │ Design    │
   └────────┘          └───────────┘
```

## 📦 Dependency Graph

```
cordova-migration-client
│
├── expo ~54.0.25
│   ├── expo-blur ~15.0.7
│   ├── expo-linear-gradient ~15.0.7
│   ├── expo-status-bar ~3.0.8
│   └── expo-application ~7.0.7
│
├── react-native 0.81.5
│   ├── react-native-gesture-handler ~2.28.0
│   ├── react-native-reanimated ~4.1.1
│   ├── react-native-screens ~4.16.0
│   ├── react-native-safe-area-context ~5.6.0
│   ├── react-native-worklets 0.5.1
│   └── react-native-web ^0.21.0
│
├── @react-navigation
│   ├── @react-navigation/native ^7.1.21
│   ├── @react-navigation/bottom-tabs ^7.8.6
│   └── @react-navigation/native-stack ^7.7.0
│
├── NEW: @callstack/liquid-glass ^0.4.1 ⭐
├── NEW: expo-native-tabs ^1.0.0 ⭐
├── NEW: rss-parser ^3.13.0 ⭐
│
├── react 19.1.0
├── react-dom 19.1.0
├── lucide-react-native ^0.554.0
├── date-fns ^4.1.0
├── firebase ^12.6.0
└── @react-native-async-storage/async-storage 2.2.0
```

## 🎨 State Management Flow

```
┌─────────────────────────────────┐
│  NativeTabsNavigator State      │
├─────────────────────────────────┤
│ activeTab: string               │ Current tab
│ scrollViewRefs: object          │ Tab scroll refs
└────────┬──────────────┬─────────┘
         │              │
    ┌────▼──┐      ┌────▼──────┐
    │ Tab   │      │ Scroll    │
    │ Switch│      │ to Top    │
    └────┬──┘      └────┬──────┘
         │               │
    ┌────▼───────────────▼──┐
    │ handleTabPress()      │
    ├───────────────────────┤
    │ if same tab & focused │
    │ → scroll to top       │
    │ else                  │
    │ → switch tab          │
    └───────────────────────┘
```

## 🔌 Integration Points

```
Your App Structure         Integration Points
────────────────────────────────────────────────────

src/
├── navigation/
│   ├── AppNavigator.js ◄──────── Uses NativeTabsNavigator
│   └── NativeTabsNavigator.js ◄─ Core implementation
│
├── services/
│   ├── ScrollService.js ◄─────── Provides hooks & utils
│   └── MediumFeedService.js ◄─── Feeds to screens
│
├── components/
│   ├── LiquidGlassCard.js ◄───── UI component
│   └── LiquidGlassButton.js ◄─── FAB component
│
├── screens/
│   ├── HomeScreen.js ◄─────────── Tab content
│   ├── DemoScreen.js ◄─────────── Tab content
│   ├── ProfileScreen.js ◄─────── Tab content
│   └── FeaturedArticlesScreen.js ◄ Uses feeds & cards
│
└── theme/
    └── colors.js ◄───────────── Used everywhere
```

## 📊 Performance Metrics

```
Metric                  iOS         Android         Notes
─────────────────────────────────────────────────
Tab Bar Height          85px        65px           Platform defaults
Scroll Throttle         16ms        32ms           FPS optimization
Blur Intensity          80%         70%            Visual quality
Animation Duration      300ms       300ms          Consistent
Cache TTL               5min        5min           Feed refresh
Feed Timeout            10s         10s            Network limit
```

## 🔐 Data Security

```
User Data Flow
──────────────

RSS URLs     ─┐
             ├─► Cache Check ─┐
             │                ├─► Parse RSS ─► Filter ─► Display
Credentials  ─┘                │
                               └─► Cached Data (5min TTL)

Sensitive Data:
• No user credentials stored in feeds
• Cache is local only (AsyncStorage)
• Feed content public by nature
• Images served from public URLs
```

## 🚀 Launch Sequence

```
1. App.js
   │
   ├─► ThemeProvider loads
   ├─► SafeAreaProvider loads
   │
2. AppNavigator
   │
   ├─► Check authentication
   ├─► Load AuthNavigator or TabNavigator
   │
3. TabNavigator
   │
   ├─► NativeTabsNavigator mounts
   ├─► Tab refs initialized
   ├─► ScrollService hooks active
   │
4. First Screen Loads
   │
   ├─► useScrollToTop activates
   ├─► Content renders
   ├─► MediumFeedService (if enabled)
   │
5. User Interactions
   │
   ├─► Tab press ──► handleTabPress()
   ├─► Scroll      ──► ScrollView events
   ├─► Refresh     ──► Fetch new feeds
```

## 🎯 Key Interaction Flows

### Tab Navigation
```
User taps tab icon
      │
      ▼
Is it the active tab?
      │
      ├─► YES: Check scroll position
      │        └─► Is at top? Do nothing
      │        └─► Not at top? Scroll to top
      │
      └─► NO: Switch to new tab
```

### Scroll Behavior
```
User scrolls content
      │
      ▼
ScrollView scrollEventThrottle fires
      │
      ├─► iOS: Every 16ms (60fps)
      └─► Android: Every 32ms (30fps)
```

### Content Fetching
```
Screen mounts
      │
      ▼
useScrollToTop hook triggers
      │
      ▼
MediumFeedService.getAllFeeds()
      │
      ├─► Check cache (5min TTL)
      │   ├─► Valid? Use cached
      │   └─► Expired? Fetch new
      │
      └─► Parse RSS
          │
          ├─► Extract articles
          ├─► Extract images
          ├─► Format dates
          │
          └─► Display in FlatList
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: November 25, 2025  
**Diagrams**: ASCII Art (for email/text compatibility)

For visual diagrams, refer to:
- QUICK_START.md (quick reference)
- NATIVE_TABS_IMPLEMENTATION.md (detailed docs)
- EXAMPLES.js (code patterns)
