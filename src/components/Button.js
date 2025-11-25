import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, spacing } from '../theme/colors';

const Button = ({ title, onPress, loading, variant = 'primary', style }) => {
    const { colors } = useTheme();
    const isPrimary = variant === 'primary';

    if (isPrimary) {
        return (
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, style]}
            >
                <TouchableOpacity onPress={onPress} disabled={loading} style={styles.gradientButton}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={[styles.text, { color: '#fff' }]}>{title}</Text>
                    )}
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            style={[
                styles.buttonBase,
                { borderColor: colors.primary },
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.primary} />
            ) : (
                <Text style={[styles.text, { color: colors.primary }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: spacing.s,
        width: '100%',
        marginVertical: spacing.s,
    },
    gradientButton: {
        padding: spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonBase: {
        padding: spacing.m,
        borderRadius: spacing.s,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: spacing.s,
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Button;
