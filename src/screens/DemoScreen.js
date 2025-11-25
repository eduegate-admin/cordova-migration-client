import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { MessageSquare, Map, ShoppingBag, Utensils } from 'lucide-react-native';

const FeatureCard = ({ title, description, icon: Icon, colors }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <Icon color={colors.primary} size={32} />
        </View>
        <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
    </View>
);

const DemoScreen = () => {
    const { colors } = useTheme();

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>App Features</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    This template supports various app types as mentioned in the gig.
                </Text>

                <FeatureCard
                    title="Chat Application"
                    description="Real-time messaging with Firebase Firestore and Cloud Messaging."
                    icon={MessageSquare}
                    colors={colors}
                />
                <FeatureCard
                    title="Maps & Navigation"
                    description="Integration with Google Maps API for location-based services."
                    icon={Map}
                    colors={colors}
                />
                <FeatureCard
                    title="E-Commerce"
                    description="Product listings, cart management, and payment gateway integration."
                    icon={ShoppingBag}
                    colors={colors}
                />
                <FeatureCard
                    title="Restaurant Booking"
                    description="Table reservation system and menu management."
                    icon={Utensils}
                    colors={colors}
                />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: 16,
        marginBottom: spacing.l,
    },
    card: {
        borderRadius: spacing.m,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default DemoScreen;
