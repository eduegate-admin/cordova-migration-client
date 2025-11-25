import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, spacing } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

const ScreenWrapper = ({ children, style, showBackButton = true, title }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const canGoBack = navigation.canGoBack();

    return (
        <SafeAreaView style={[styles.container, style, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Apple Store Style Header - Back Button & Title in Same Row */}
            {showBackButton && canGoBack && (
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    {/* Circular Back Button */}
                    <TouchableOpacity
                        style={[styles.backButtonCircle, { backgroundColor: colors.surface }]}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <ChevronLeft size={24} color={colors.text} strokeWidth={2.5} />
                    </TouchableOpacity>

                    {/* Screen Title - Same Row */}
                    {title && (
                        <Text style={[styles.titleText, { color: colors.text }]} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                </View>
            )}

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.m,
        gap: spacing.m,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    titleText: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.3,
        flex: 1,
    },
});

export default ScreenWrapper;
