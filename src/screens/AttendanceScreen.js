import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';

const AttendanceScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    const [summaryData, setSummaryData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Legend Data - matches legacy colors
    const legendItems = [
        { code: 'P', label: 'Present', color: '#0ead1f' },
        { code: 'A', label: 'Absent', color: '#f37d1a' },
        { code: 'AE', label: 'Absences Excused', color: '#f54213' },
        { code: 'L', label: 'Late', color: '#fa06e0' },
        { code: 'H', label: 'Holiday', color: '#ea2b15' },
        { code: 'T', label: 'Tardy', color: '#855649' },
        { code: 'TE', label: 'Tardy Excused', color: '#b38f86' },
        { code: 'W', label: 'Weekend', color: '#95b3d7' },
        { code: 'NA', label: 'Not Available', color: '#8e0d0d' },
        { code: 'UM', label: 'Unmarked', color: '#4c4646' },
        { code: 'LE', label: 'Late Excused', color: '#0eaec7' },
    ];

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();
            const month = selectedDate.getMonth();
            const year = selectedDate.getFullYear();

            console.log("AttendanceScreen - StudentIID:", studentIID);
            console.log("AttendanceScreen - Month/Year:", month, year);

            // 1. Fetch Monthly Attendance
            const attendanceUrl = `${appSettings.schoolServiceUrl}/GetStudentAttendenceByYearMonthStudentId?month=${month}&year=${year}&studentId=${studentIID}`;
            console.log("Fetching Attendance:", attendanceUrl);

            const attendanceResponse = await fetch(attendanceUrl, {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const attendanceText = await attendanceResponse.text();
            console.log("Attendance Response:", attendanceText);

            let attendanceResult = [];
            if (attendanceText && attendanceText.length > 0) {
                attendanceResult = JSON.parse(attendanceText);
                if (attendanceResult.length > 0) {
                    console.log("First attendance record:", JSON.stringify(attendanceResult[0], null, 2));
                }
            }

            // 2. Process Data for Calendar
            const marks = {};
            if (Array.isArray(attendanceResult)) {
                attendanceResult.forEach(item => {
                    // Handle .NET date format
                    let dateStr = '';
                    if (item.AttendenceDate) {
                        if (item.AttendenceDate.includes('Date(')) {
                            const timestamp = parseInt(item.AttendenceDate.replace(/\/Date\((\d+)\)\//, '$1'));
                            const date = new Date(timestamp);
                            dateStr = date.toISOString().split('T')[0];
                        } else if (item.AttendenceDate.includes('T')) {
                            dateStr = item.AttendenceDate.split('T')[0];
                        }
                    }

                    if (dateStr) {
                        const statusColor = getStatusColor(item.PresentStatusTitle);
                        marks[dateStr] = {
                            selected: true,
                            selectedColor: statusColor,
                            disableTouchEvent: true
                        };
                    }
                });
            }
            setMarkedDates(marks);

            // 3. Fetch Summary Data (Class Wise)
            const summaryUrl = `${appSettings.schoolServiceUrl}/GetStudentClassWiseAttendance?studentID=${studentIID}&schoolID=30`;
            console.log("Fetching Summary:", summaryUrl);

            const summaryResponse = await fetch(summaryUrl, {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const summaryText = await summaryResponse.text();
            console.log("Summary Response:", summaryText);

            if (summaryText && summaryText.length > 0) {
                const summaryResult = JSON.parse(summaryText);
                if (summaryResult && summaryResult.length > 0) {
                    console.log("First summary record:", JSON.stringify(summaryResult[0], null, 2));
                }
                setSummaryData(Array.isArray(summaryResult) ? summaryResult : []);
            }

        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (statusTitle) => {
        const status = legendItems.find(item => item.code === statusTitle);
        return status ? status.color : '#4c4646';
    };

    const onMonthChange = (month) => {
        setSelectedDate(new Date(month.year, month.month - 1, 1));
    };

    return (
        <ScreenWrapper title="Attendance">
            <ScrollView style={styles.container}>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {/* Calendar */}
                        <View style={[styles.calendarCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Calendar
                                markedDates={markedDates}
                                onMonthChange={onMonthChange}
                                theme={{
                                    backgroundColor: colors.surface,
                                    calendarBackground: colors.surface,
                                    textSectionTitleColor: colors.textSecondary,
                                    selectedDayBackgroundColor: colors.primary,
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: colors.primary,
                                    dayTextColor: colors.text,
                                    textDisabledColor: colors.textSecondary,
                                    monthTextColor: colors.text,
                                    arrowColor: colors.primary,
                                }}
                            />
                        </View>

                        {/* Legend */}
                        <View style={[styles.legendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.legendTitle, { color: colors.text }]}>Legend</Text>
                            <View style={styles.legendGrid}>
                                {legendItems.map((item) => (
                                    <View key={item.code} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Text style={[styles.legendLabel, { color: colors.text }]}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Summary Cards */}
                        {summaryData && summaryData.length > 0 && (
                            <View>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendance Summary</Text>
                                {summaryData.map((entry, index) => (
                                    <View key={index} style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <View style={styles.summaryHeader}>
                                            <Text style={[styles.summaryTitle, { color: colors.text }]}>
                                                {entry.ClassName || 'Class'}
                                                {entry.SectionName && ` - ${entry.SectionName}`}
                                            </Text>
                                            {entry.AcademicYear && (
                                                <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
                                                    AY: {entry.AcademicYear}
                                                </Text>
                                            )}
                                        </View>

                                        {/* Percentage */}
                                        <View style={styles.percentageContainer}>
                                            <Text style={[
                                                styles.percentage,
                                                {
                                                    color: entry.AttendancePercentage >= 90 ? '#0ead1f' :
                                                        entry.AttendancePercentage >= 75 ? '#FFA500' : '#f37d1a'
                                                }
                                            ]}>
                                                {entry.AttendancePercentage?.toFixed(2) || 0}%
                                            </Text>
                                            <Text style={[styles.percentageLabel, { color: colors.textSecondary }]}>Overall</Text>
                                        </View>

                                        {/* Progress Bar */}
                                        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    {
                                                        width: `${entry.AttendancePercentage || 0}%`,
                                                        backgroundColor: entry.AttendancePercentage >= 90 ? '#0ead1f' :
                                                            entry.AttendancePercentage >= 75 ? '#FFA500' : '#f37d1a'
                                                    }
                                                ]}
                                            />
                                        </View>

                                        <View style={styles.divider} />

                                        {/* Stats */}
                                        <View style={styles.statsRow}>
                                            <View style={styles.statItem}>
                                                <Text style={[styles.statValue, { color: '#0ead1f' }]}>
                                                    {entry.StudentPresentCount || 0}
                                                </Text>
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Present</Text>
                                            </View>
                                            <View style={styles.statItem}>
                                                <Text style={[styles.statValue, { color: '#f37d1a' }]}>
                                                    {entry.StudentAbsentCount || 0}
                                                </Text>
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Absent</Text>
                                            </View>
                                            <View style={styles.statItem}>
                                                <Text style={[styles.statValue, { color: colors.text }]}>
                                                    {entry.TotalMarkedDays || 0}
                                                </Text>
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Marked</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },
    calendarCard: {
        borderRadius: spacing.s,
        padding: spacing.s,
        marginBottom: spacing.m,
        borderWidth: 1,
    },
    legendCard: {
        borderRadius: spacing.s,
        padding: spacing.m,
        marginBottom: spacing.m,
        borderWidth: 1,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.s,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: spacing.xs,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.xs,
    },
    legendLabel: {
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    summaryCard: {
        borderRadius: spacing.s,
        padding: spacing.m,
        marginBottom: spacing.m,
        borderWidth: 1,
    },
    summaryHeader: {
        marginBottom: spacing.m,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    summarySubtitle: {
        fontSize: 12,
        marginTop: spacing.xs / 2,
    },
    percentageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    percentage: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    percentageLabel: {
        fontSize: 14,
    },
    progressBar: {
        height: 20,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: spacing.m,
    },
    progressFill: {
        height: '100%',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: spacing.m,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.xs / 2,
    },
    statLabel: {
        fontSize: 12,
    },
});

export default AttendanceScreen;
