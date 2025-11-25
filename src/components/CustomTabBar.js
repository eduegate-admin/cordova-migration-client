import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <BlurView
                intensity={isDark ? 80 : 60}
                tint={isDark ? 'dark' : 'light'}
                style={styles.blurContainer}
            >
                <View style={[styles.tabBar, { backgroundColor: colors.tabBarBackground }]}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TabButton
                                key={route.key}
                                isFocused={isFocused}
                                options={options}
                                onPress={onPress}
                                colors={colors}
                            />
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
};

const TabButton = ({ isFocused, options, onPress, colors }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(isFocused ? 1 : 0.6);

    React.useEffect(() => {
        opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
        <AnimatedTouchable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.tabButton, animatedStyle]}
        >
            <View style={styles.iconContainer}>
                {options.tabBarIcon?.({
                    color: isFocused ? colors.primary : colors.textSecondary,
                    size: 24,
                })}
            </View>
            {isFocused && (
                <Animated.View
                    style={[
                        styles.activeIndicator,
                        { backgroundColor: colors.primary },
                    ]}
                />
            )}
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    blurContainer: {
        borderRadius: 28,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    tabBar: {
        flexDirection: 'row',
        height: 64,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 8,
        width: 32,
        height: 4,
        borderRadius: 2,
    },
});

export default CustomTabBar;
