import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';
import { Download } from 'lucide-react-native';

const AssignmentsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();

            console.log("AssignmentsScreen - StudentIID:", studentIID);

            const url = `${appSettings.schoolServiceUrl}/GetAssignments?studentID=${studentIID}`;
            console.log("AssignmentsScreen - Fetching:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const responseText = await response.text();
            console.log("AssignmentsScreen - Response:", responseText);

            if (responseText && responseText.length > 0) {
                const data = JSON.parse(responseText);
                console.log("Assignments -Found:", data.length, "assignment(s)");
                if (data.length > 0) {
                    console.log("First assignment:", JSON.stringify(data[0], null, 2));
                }
                setAssignments(data);
            } else {
                console.warn("Assignments - Empty response");
                setAssignments([]);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            Alert.alert("Error", "Failed to load assignments.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return '';

        // Handle .NET date format like "/Date(1234567890000)/"
        if (typeof dateValue === 'string' && dateValue.includes('Date(')) {
            const timestamp = parseInt(dateValue.replace(/\/Date\((\d+)\)\//, '$1'));
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
        }

        return dateValue;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('AssignmentDetail', { assignment: item })}
            activeOpacity={0.7}
        >
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.header}>
                    <Text style={[styles.subject, { color: colors.primary }]}>
                        {item.Subject?.Value || 'Subject'}
                    </Text>
                    <Text style={[styles.date, { color: colors.textSecondary }]}>
                        {formatDate(item.StartDate)}
                    </Text>
                </View>
                <Text style={[styles.title, { color: colors.text }]}>
                    {item.Title || 'Assignment'}
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.Description || 'No description'}
                </Text>

                {item.DaysLeft && (
                    <View style={styles.daysLeft}>
                        <Text style={[
                            styles.daysLeftText,
                            {
                                color: item.DaysLeftNum < 3 && item.DaysLeftNum >= 0 ? colors.error :
                                    item.DaysLeftNum >= 3 ? '#FFA500' : colors.textSecondary
                            }
                        ]}>
                            {item.DaysLeft}
                        </Text>
                    </View>
                )}

                {item.AssignmentAttachmentMaps && item.AssignmentAttachmentMaps.length > 0 && (
                    <View style={[styles.attachmentBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Download size={14} color={colors.primary} />
                        <Text style={[styles.attachmentText, { color: colors.primary }]}>
                            {item.AssignmentAttachmentMaps.length} attachment(s)
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper title="Assignments">
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={assignments}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.AssignmentID?.toString() || index.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No assignments found.</Text>
                    }
                />
            )}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: spacing.m,
        paddingBottom: spacing.l,
    },
    card: {
        borderRadius: spacing.s,
        padding: spacing.m,
        marginBottom: spacing.m,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.s,
    },
    subject: {
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
    },
    date: {
        fontSize: 12,
        marginLeft: spacing.s,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: 14,
        marginBottom: spacing.s,
    },
    daysLeft: {
        marginTop: spacing.xs,
        marginBottom: spacing.xs,
    },
    daysLeftText: {
        fontSize: 13,
        fontWeight: '600',
    },
    attachmentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xs,
        borderRadius: spacing.xs,
        alignSelf: 'flex-start',
        marginTop: spacing.xs,
    },
    attachmentText: {
        marginLeft: spacing.xs,
        fontSize: 12,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        fontSize: 16,
    },
});

export default AssignmentsScreen;
