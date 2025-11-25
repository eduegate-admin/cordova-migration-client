import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';

const TimeTableScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();

            console.log('TimeTableScreen - StudentIID:', studentIID);

            const url = `${appSettings.schoolServiceUrl}/GetTimeTableByStudentID?studentID=${studentIID}`;
            console.log('TimeTableScreen - Fetching:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    'Content-type': 'application/json; charset=utf-8',
                    CallContext: JSON.stringify(context),
                },
            });

            const responseText = await response.text();
            console.log('TimeTableScreen - Response:', responseText);

            if (responseText && responseText.length > 0) {
                const data = JSON.parse(responseText);
                console.log('Timetable - Found:', data.length, 'period(s)');
                setTimetable(data);
            } else {
                console.warn('Timetable - Empty response');
                setTimetable([]);
            }
        } catch (error) {
            console.error('Error fetching timetable:', error);
            Alert.alert('Error', 'Failed to load timetable.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.header}>
                <Text style={[styles.day, { color: colors.primary }]}>{item.Day || 'Day'}</Text>
                <Text style={[styles.time, { color: colors.textSecondary }]}>{item.Time || 'Time'}</Text>
            </View>
            <Text style={[styles.subject, { color: colors.text }]}>{item.SubjectName || 'Subject'}</Text>
            {item.TeacherName && (
                <Text style={[styles.teacher, { color: colors.textSecondary }]}>{item.TeacherName}</Text>
            )}
        </View>
    );

    return (
        <ScreenWrapper title="Time Table">
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={timetable}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.TimeTableID?.toString() || index.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>No timetable found.</Text>}
                />
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
    day: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    time: {
        fontSize: 14,
    },
    subject: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    teacher: {
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        fontSize: 16,
    },
});

export default TimeTableScreen;
