import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing } from '../theme/colors';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    error
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: error ? colors.error : colors.border
                    }
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
            {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
        width: '100%',
    },
    label: {
        marginBottom: spacing.xs,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        borderRadius: spacing.s,
        padding: spacing.m,
        borderWidth: 1,
    },
    errorText: {
        fontSize: 12,
        marginTop: spacing.xs,
    },
});

export default Input;
