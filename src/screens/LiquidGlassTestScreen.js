import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/colors';
import LiquidGlassCard from '../components/LiquidGlassCard';

/**
 * LiquidGlassTestScreen
 * Test component to verify @callstack/liquid-glass is working
 * Shows different glass effect intensities
 */
const LiquidGlassTestScreen = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>
          🎨 Liquid Glass Effects
        </Text>
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          @callstack/liquid-glass v0.4.1
        </Text>

        {/* Test 1: Intensity 0.5 */}
        <LiquidGlassCard
          title="Light Glass"
          subtitle="intensity: 0.5"
          intensity={0.5}
          blurRadius={15}
        >
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Light frosted glass effect with low blur radius
          </Text>
        </LiquidGlassCard>

        {/* Test 2: Intensity 0.7 (Default) */}
        <LiquidGlassCard
          title="Medium Glass"
          subtitle="intensity: 0.7 (default)"
          intensity={0.7}
          blurRadius={25}
        >
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Standard frosted glass effect with medium blur radius
          </Text>
        </LiquidGlassCard>

        {/* Test 3: Intensity 0.9 */}
        <LiquidGlassCard
          title="Strong Glass"
          subtitle="intensity: 0.9"
          intensity={0.9}
          blurRadius={35}
        >
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Strong frosted glass effect with high blur radius
          </Text>
        </LiquidGlassCard>

        {/* Test 4: Nested content */}
        <LiquidGlassCard
          title="Glass with Content"
          subtitle="intensity: 0.7, blurRadius: 25"
          intensity={0.7}
          blurRadius={25}
        >
          <View style={styles.nestedContent}>
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                Feature
              </Text>
            </View>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              This glass card contains nested components and styling
            </Text>
          </View>
        </LiquidGlassCard>

        <View style={styles.spacing} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 13,
    lineHeight: 18,
  },
  nestedContent: {
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  spacing: {
    height: 40,
  },
});

export default LiquidGlassTestScreen;
