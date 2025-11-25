import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';

const BusRouteScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Bus Route</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    Coming soon - Bus route information will be displayed here.
                </Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    description: {
        fontSize: 16,
        marginBottom: spacing.m,
    },
});

export default BusRouteScreen;
