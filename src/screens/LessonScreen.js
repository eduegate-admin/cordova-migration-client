import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';
import { Download } from 'lucide-react-native';

const LessonScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();

            console.log("LessonScreen - StudentIID:", studentIID);

            const url = `${appSettings.schoolServiceUrl}/GetLessonPlanListByStudentID?studentID=${studentIID}`;
            console.log("LessonScreen - Fetching:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const responseText = await response.text();
            console.log("LessonScreen - Response:", responseText);

            if (responseText && responseText.length > 0) {
                const data = JSON.parse(responseText);
                console.log("Lessons - Found:", data.length, "lesson(s)");
                if (data.length > 0) {
                    console.log("First lesson:", JSON.stringify(data[0], null, 2));
                }
                setLessons(data);
            } else {
                console.warn("Lessons - Empty response");
                setLessons([]);
            }
        } catch (error) {
            console.error("Error fetching lessons:", error);
            Alert.alert("Error", "Failed to load lessons.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return '';

        if (typeof dateValue === 'string' && dateValue.includes('Date(')) {
            const timestamp = parseInt(dateValue.replace(/\/Date\((\d+)\)\//, '$1'));
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-GB');
        }

        return dateValue;
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.header}>
                <Text style={[styles.subject, { color: colors.primary }]}>
                    {item.Subject?.Value || 'Subject'}
                </Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                    {formatDate(item.CreatedDate)}
                </Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
                {item.Title || 'Lesson Plan'}
            </Text>

            {item.Activity && (
                <Text style={[styles.detail, { color: colors.textSecondary }]} numberOfLines={2}>
                    <Text style={{ fontWeight: '600' }}>Activity: </Text>
                    {item.Activity}
                </Text>
            )}

            {item.LessonPlanAttachmentMap && item.LessonPlanAttachmentMap.length > 0 && (
                <View style={[styles.attachmentBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Download size={14} color={colors.primary} />
                    <Text style={[styles.attachmentText, { color: colors.primary }]}>
                        {item.LessonPlanAttachmentMap.length} attachment(s)
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <ScreenWrapper title="Lesson Plans">
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={lessons}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.LessonPlanID?.toString() || index.toString()}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No lesson plans found.</Text>
                        }
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },

    listContent: {
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
        marginBottom: spacing.s,
    },
    detail: {
        fontSize: 14,
        marginBottom: spacing.xs,
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

export default LessonScreen;
