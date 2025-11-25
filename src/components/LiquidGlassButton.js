import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../theme/colors';

// Note: LiquidGlassView from @callstack/liquid-glass requires native setup
// For now, using LinearGradient with semi-transparency for glass effect
// After native build, you can import: import { LiquidGlassView } from '@callstack/liquid-glass';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const LiquidGlassButton = ({ onPress, icon: Icon = Plus }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    const handlePress = () => {
        console.log('FAB pressed!');
        onPress?.();
    };

    return (
        <AnimatedTouchable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.fab,
                animatedStyle,
                { bottom: 80 + insets.bottom },
            ]}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={[
                    colors.fabGradientStart + 'F0', // 94% opacity for glass effect
                    colors.fabGradientEnd + 'F0',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Icon color="#FFFFFF" size={28} strokeWidth={2.5} />
            </LinearGradient>
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        // Backdrop blur will be applied when using LiquidGlassView
        backgroundColor: 'transparent',
    },
});

export default LiquidGlassButton;
