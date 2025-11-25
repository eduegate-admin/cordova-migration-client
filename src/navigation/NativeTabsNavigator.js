import React, { useRef, useCallback } from 'react';
import { View, Platform, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/colors';
import { BlurView } from 'expo-blur';
import { Home, User, Zap } from 'lucide-react-native';
import * as screens from '../screens';

/**
 * Native Tabs Navigator using platform-specific implementations
 * Provides liquid glass effects, automatic scroll-to-top, and platform behaviors
 */
const NativeTabsNavigator = () => {
  const { colors, isDark } = useTheme();
  const scrollViewRefs = useRef({});
  const [activeTab, setActiveTab] = React.useState('Home');

  // Handle scroll-to-top on tab press
  const handleTabPress = useCallback((tabName) => {
    if (activeTab === tabName && scrollViewRefs.current[tabName]) {
      scrollViewRefs.current[tabName].scrollTo({ y: 0, animated: true });
    } else {
      setActiveTab(tabName);
    }
  }, [activeTab]);

  const tabConfig = [
    {
      name: 'Home',
      label: 'Home',
      icon: Home,
      component: screens.HomeScreen,
    },
    {
      name: 'Demo',
      label: 'Features',
      icon: Zap,
      component: screens.DemoScreen,
    },
    {
      name: 'Profile',
      label: 'Profile',
      icon: User,
      component: screens.ProfileScreen,
    },
  ];

  const renderTabContent = () => {
    const activeTabConfig = tabConfig.find(tab => tab.name === activeTab);
    if (!activeTabConfig) return null;

    const Component = activeTabConfig.component;
    return (
      <ScrollView
        ref={(ref) => {
          if (ref) scrollViewRefs.current[activeTab] = ref;
        }}
        scrollEventThrottle={16}
        style={styles.content}
      >
        <Component />
      </ScrollView>
    );
  };

  const renderTabBar = () => {
    return (
      <View
        style={[
          styles.tabBar,
          {
            borderTopColor: isDark ? colors.border : '#e0e0e0',
          },
        ]}
      >
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={80}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tabBarContent}>
          {tabConfig.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.name;
            
            return (
              <View
                key={tab.name}
                style={styles.tabButton}
                onTouchEnd={() => handleTabPress(tab.name)}
              >
                <IconComponent
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderTabContent()}
      {renderTabBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    height: Platform.select({ ios: 85, android: 65 }),
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.select({ ios: 20, android: 8 }),
  },
  tabButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NativeTabsNavigator;
