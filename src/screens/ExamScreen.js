import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';

const ExamScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();

            console.log("ExamScreen - StudentIID:", studentIID);

            const url = `${appSettings.schoolServiceUrl}/GetExamLists?studentID=${studentIID}`;
            console.log("ExamScreen - Fetching:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const responseText = await response.text();
            console.log("ExamScreen - Response:", responseText);

            if (responseText && responseText.length > 0) {
                const data = JSON.parse(responseText);
                console.log("Exams - Found:", data.length, "exam(s)");
                setExams(data);
            } else {
                console.warn("Exams - Empty response");
                setExams([]);
            }
        } catch (error) {
            console.error("Error fetching exams:", error);
            Alert.alert("Error", "Failed to load exams.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.header}>
                <Text style={[styles.name, { color: colors.primary }]}>{item.ExamName || 'Exam'}</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{item.ExamDate || 'Date'}</Text>
            </View>
            <Text style={[styles.subject, { color: colors.text }]}>{item.SubjectName || 'Subject'}</Text>
            {item.Time && <Text style={[styles.time, { color: colors.textSecondary }]}>Time: {item.Time}</Text>}
            {item.Duration && <Text style={[styles.duration, { color: colors.textSecondary }]}>Duration: {item.Duration}</Text>}
        </View>
    );

    return (
        <ScreenWrapper title="Exams">
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={exams}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.ExamID?.toString() || index.toString()}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No exams found.</Text>
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
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.m,
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
        marginBottom: spacing.s,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    date: {
        fontSize: 14,
    },
    subject: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    time: {
        fontSize: 14,
        marginBottom: spacing.xs,
    },
    duration: {
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        fontSize: 16,
    },
});

export default ExamScreen;
