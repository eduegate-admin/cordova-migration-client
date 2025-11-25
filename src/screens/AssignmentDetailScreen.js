import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { Calendar, FileText } from 'lucide-react-native';

const AssignmentDetailScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { assignment } = route.params;

    const formatDate = (dateValue) => {
        if (!dateValue) return 'Not specified';

        if (typeof dateValue === 'string' && dateValue.includes('Date(')) {
            const timestamp = parseInt(dateValue.replace(/\/Date\((\d+)\)\//, '$1'));
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-GB');
        }

        return dateValue;
    };

    return (
        <ScreenWrapper>
            <ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={[styles.header, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.subject, { color: colors.primary }]}>
                        {assignment.Subject?.Value || 'Subject'}
                    </Text>
                    <Text style={[styles.topic, { color: colors.text }]}>
                        {assignment.Title || 'Assignment'}
                    </Text>
                </View>

                {/* Date and Status Section */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.infoRow}>
                        <Calendar size={20} color={colors.textSecondary} />
                        <View style={styles.infoContent}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date</Text>
                            <Text style={[styles.value, { color: colors.text }]}>
                                {formatDate(assignment.StartDate)}
                            </Text>
                        </View>
                    </View>

                    {assignment.DateOfSubmission && (
                        <View style={styles.infoRow}>
                            <Calendar size={20} color={colors.error} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Due Date</Text>
                                <Text style={[styles.value, { color: colors.error }]}>
                                    {formatDate(assignment.DateOfSubmission)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {assignment.DaysLeft && (
                        <View style={styles.infoRow}>
                            <FileText size={20} color={colors.textSecondary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Status</Text>
                                <Text style={[
                                    styles.value,
                                    {
                                        color: assignment.DaysLeftNum < 3 && assignment.DaysLeftNum >= 0 ? colors.error :
                                            assignment.DaysLeftNum >= 3 ? '#FFA500' : colors.textSecondary
                                    }
                                ]}>
                                    {assignment.DaysLeft}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Description Section */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {assignment.Description || 'No description provided'}
                    </Text>
                </View>

                {/* Assignment Type */}
                {assignment.AssignmentType?.Value && (
                    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Assignment Type</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {assignment.AssignmentType.Value}
                        </Text>
                    </View>
                )}

                {/* Attachments Section */}
                {assignment.AssignmentAttachmentMaps && assignment.AssignmentAttachmentMaps.length > 0 && (
                    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Attachments</Text>
                        {assignment.AssignmentAttachmentMaps.map((attachment, index) => (
                            attachment.AttachmentReferenceID && (
                                <View key={index} style={[styles.attachmentItem, { borderColor: colors.border }]}>
                                    <Text style={[styles.attachmentName, { color: colors.text }]}>
                                        {attachment.AttachmentName || `Attachment ${index + 1}`}
                                    </Text>
                                </View>
                            )
                        ))}
                    </View>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.l,
        borderRadius: spacing.m,
        margin: spacing.m,
    },
    subject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    topic: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginHorizontal: spacing.m,
        marginBottom: spacing.m,
        padding: spacing.m,
        borderRadius: spacing.s,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.m,
    },
    infoContent: {
        marginLeft: spacing.m,
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
    },
    attachmentItem: {
        padding: spacing.s,
        borderWidth: 1,
        borderRadius: spacing.xs,
        marginBottom: spacing.xs,
    },
    attachmentName: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AssignmentDetailScreen;
