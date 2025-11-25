import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';

const DriverDetailsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [driverDetails, setDriverDetails] = useState(null);

    useEffect(() => {
        fetchDriverDetails();
    }, []);

    const fetchDriverDetails = async () => {
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();

            console.log('DriverDetailsScreen - StudentIID:', studentIID);

            const url = `${appSettings.schoolServiceUrl}/GetDriverDetailsByStudent?studentID=${studentIID}`;
            console.log('DriverDetailsScreen - Fetching:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    'Content-type': 'application/json; charset=utf-8',
                    CallContext: JSON.stringify(context),
                },
            });

            const responseText = await response.text();
            console.log('DriverDetailsScreen - Response:', responseText);

            if (responseText && responseText.length > 0) {
                const data = JSON.parse(responseText);
                console.log('Driver Details - Found:', data);
                setDriverDetails(data);
            } else {
                console.warn('Driver Details - Empty response');
                setDriverDetails(null);
            }
        } catch (error) {
            console.error('Error fetching driver details:', error);
            Alert.alert('Error', 'Failed to load driver details.');
        } finally {
            setLoading(false);
        }
    };

    const renderDetail = (label, value) => (
        <View style={{ marginBottom: spacing.xs }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        </View>
    );

    return (
        <ScreenWrapper title="Driver Details">
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : driverDetails ? (
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {renderDetail('Driver Name', driverDetails.DriverName || 'N/A')}
                    {renderDetail('Phone Number', driverDetails.PhoneNumber || 'N/A')}
                    {renderDetail('Bus Number', driverDetails.BusNumber || 'N/A')}
                    {driverDetails.RouteNumber && renderDetail('Route Number', driverDetails.RouteNumber)}
                </ScrollView>
            ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No driver details found.</Text>
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    contentContainer: {
        paddingBottom: spacing.l,
        padding: spacing.m,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: spacing.s,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 16,
        marginBottom: spacing.xs,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        fontSize: 16,
    },
});

export default DriverDetailsScreen;
