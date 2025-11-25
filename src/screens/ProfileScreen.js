import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { Moon, Sun } from 'lucide-react-native';

const ProfileScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            {isDark ? (
                                <Moon color={colors.text} size={24} />
                            ) : (
                                <Sun color={colors.text} size={24} />
                            )}
                            <Text style={[styles.settingLabel, { color: colors.text }]}>
                                {isDark ? 'Dark Mode' : 'Light Mode'}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: colors.primary }}
                            thumbColor={isDark ? colors.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    Toggle between light and dark mode for comfortable viewing
                </Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: spacing.l,
    },
    card: {
        borderRadius: spacing.m,
        padding: spacing.m,
        marginBottom: spacing.m,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default ProfileScreen;
