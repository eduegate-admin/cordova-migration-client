import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LiquidGlass } from '@callstack/liquid-glass';
import { useTheme } from '../theme/colors';

/**
 * LiquidGlassCard Component
 * Provides frosted-glass UI effects using @callstack/liquid-glass (v0.4.1)
 * Perfect for tab screen content with modern glassmorphism design
 */
const LiquidGlassCard = ({
  children,
  title,
  subtitle,
  intensity = 0.7,
  blurRadius = 25,
  style,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <LiquidGlass
      intensity={intensity}
      blurRadius={blurRadius}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        {title && (
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </View>
    </LiquidGlass>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
});

export default LiquidGlassCard;
