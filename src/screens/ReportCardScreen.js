import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { FileText, Download } from 'lucide-react-native';
import { ContextService } from '../services/ContextService';
import { appSettings } from '../config/settings';

const ReportCardScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [reportCards, setReportCards] = useState([]);
    const [studentDetails, setStudentDetails] = useState(null);

    useEffect(() => {
        fetchReportCards();
    }, []);

    const fetchReportCards = async () => {
        setLoading(true);
        try {
            const context = await ContextService.getContext();

            // Step 1: Get student details by admission number (like legacy init())
            const admissionNumber = context.UserId; // This is the LoginUserID
            const studentDetailsUrl = `${appSettings.schoolServiceUrl}/GetStudentDetailsByAdmissionNumber?admissionNumber=${admissionNumber}`;
            console.log("Fetching Student Details:", studentDetailsUrl);

            const studentResponse = await fetch(studentDetailsUrl, {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const studentText = await studentResponse.text();
            console.log("Student Details Response:", studentText);

            let details = null;
            if (studentText && studentText.length > 0) {
                try {
                    details = JSON.parse(studentText);
                    console.log("Parsed Student Details:", details);
                    setStudentDetails(details);
                } catch (e) {
                    console.error("JSON Parse Error for Student Details:", e);
                    Alert.alert("Error", "Failed to parse student details.");
                    setLoading(false);
                    return;
                }
            }

            if (!details || !details.StudentIID) {
                console.error("No student details found");
                Alert.alert("Error", "Could not find student information.");
                setLoading(false);
                return;
            }

            // Step 2: Fetch academic years with report cards using StudentIID
            const studentId = details.StudentIID;
            const url = `${appSettings.schoolServiceUrl}/GetReportcardByStudentID?studentID=${studentId}`;
            console.log("Fetching Report Cards:", url);

            const response = await fetch(url, {
                headers: { "CallContext": JSON.stringify(context) }
            });

            const responseText = await response.text();
            console.log("Report Card Response:", responseText);

            if (responseText && responseText.length > 0) {
                try {
                    const result = JSON.parse(responseText);
                    console.log("Parsed Report Cards:", result);
                    if (Array.isArray(result) && result.length > 0) {
                        setAcademicYears(result);
                        // Auto-select first academic year
                        setSelectedYear(result[0]);
                        await fetchReportCardDetails(result[0], details, context);
                    } else {
                        console.warn("No academic years found in response");
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                }
            }
        } catch (error) {
            console.error("Error fetching report cards:", error);
            Alert.alert("Error", "Failed to load report cards. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReportCardDetails = async (year, details, context) => {
        if (!year || !details) {
            console.warn("Missing year or student details");
            return;
        }

        try {
            const studentId = details.StudentIID;
            const classId = details.ClassID || 0;
            const sectionId = details.SectionID || 0;
            const academicYearId = year.Key;

            const url = `${appSettings.schoolServiceUrl}/GetReportCardList?studentID=${studentId}&classID=${classId}&sectionID=${sectionId}&academicYearID=${academicYearId}`;
            console.log("Fetching Report Card Details:", url);

            const response = await fetch(url, {
                headers: { "CallContext": JSON.stringify(context) }
            });

            const responseText = await response.text();
            console.log("Report Card Details Response:", responseText);

            if (responseText && responseText.length > 0) {
                try {
                    const result = JSON.parse(responseText);
                    console.log("Parsed Report Card Details:", result);
                    if (result && !result.IsError) {
                        setReportCards(Array.isArray(result) ? result : [result]);
                    } else {
                        console.warn("Report card result has error or is null");
                        setReportCards([]);
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    setReportCards([]);
                }
            } else {
                console.warn("Empty response for report card details");
                setReportCards([]);
            }
        } catch (error) {
            console.error("Error fetching report card details:", error);
            setReportCards([]);
        }
    };

    const handleDownload = async (contentId) => {
        try {
            const context = await ContextService.getContext();
            const url = `${appSettings.contentServiceUrl}/ReadContentsByIDForMobile?contentID=${contentId}`;
            console.log("Download URL:", url);

            // For web, open in new tab. For native, we'd need additional handling
            Linking.openURL(url);
        } catch (error) {
            console.error("Error downloading report:", error);
            Alert.alert("Error", "Failed to download report card.");
        }
    };

    const handleYearChange = async (year) => {
        setSelectedYear(year);
        try {
            const context = await ContextService.getContext();
            await fetchReportCardDetails(year, studentDetails, context);
        } catch (error) {
            console.error("Error in handleYearChange:", error);
        }
    };

    if (loading) {
        return (
            <ScreenWrapper style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </ScreenWrapper>
        );
    }

    if (academicYears.length === 0) {
        return (
            <ScreenWrapper style={styles.center}>
                <FileText color={colors.textSecondary} size={48} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No report cards available</Text>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Report Cards</Text>

                {/* Student Profile Section */}
                {studentDetails && (
                    <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
                        <Image
                            source={{
                                uri: `${appSettings.contentServiceUrl}/ReadImageContentsByID?contentID=${studentDetails.StudentProfile}`
                            }}
                            style={[styles.profileImage, { backgroundColor: colors.background }]}
                            defaultSource={require('../../assets/icon.png')}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={[styles.studentName, { color: colors.text }]}>
                                {studentDetails.FirstName} {studentDetails.MiddleName} {studentDetails.LastName}
                            </Text>
                            <Text style={[styles.admissionNumber, { color: colors.textSecondary }]}>
                                {studentDetails.AdmissionNumber}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Academic Year Selector */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Academic Year</Text>
                    <View style={styles.yearSelector}>
                        {academicYears.map((year, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.yearButton,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: selectedYear?.Key === year.Key ? colors.primary : colors.surface
                                    },
                                    selectedYear?.Key === year.Key && { backgroundColor: colors.primary }
                                ]}
                                onPress={() => handleYearChange(year)}
                            >
                                <Text style={[
                                    styles.yearButtonText,
                                    { color: selectedYear?.Key === year.Key ? '#fff' : colors.textSecondary },
                                    selectedYear?.Key === year.Key && styles.yearButtonTextActive
                                ]}>
                                    {year.Value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Report Cards List */}
                {reportCards.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Reports</Text>
                        {reportCards.map((report, index) => (
                            <View key={index} style={[styles.reportCard, { backgroundColor: colors.surface }]}>
                                <View style={styles.reportInfo}>
                                    <FileText color={colors.primary} size={24} />
                                    <View style={styles.reportText}>
                                        <Text style={[styles.reportTitle, { color: colors.text }]}>
                                            {report.ReportCardTitle || `Report Card ${index + 1}`}
                                        </Text>
                                        <Text style={[styles.reportSubtitle, { color: colors.textSecondary }]}>
                                            {selectedYear?.Value}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.downloadButton, { backgroundColor: colors.primary }]}
                                    onPress={() => handleDownload(report.ReportContentID)}
                                >
                                    <Download color="#fff" size={20} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.emptyCardText, { color: colors.textSecondary }]}>
                            No reports available for {selectedYear?.Value}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: spacing.m,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    profileCard: {
        borderRadius: spacing.m,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    admissionNumber: {
        fontSize: 14,
    },
    card: {
        borderRadius: spacing.m,
        padding: spacing.m,
        marginBottom: spacing.m,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.s,
    },
    yearSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.s,
    },
    yearButton: {
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: spacing.s,
        borderWidth: 1,
    },
    yearButtonActive: {
        // Active state handled dynamically or via specific class if needed, but color is dynamic
    },
    yearButtonText: {
        fontSize: 14,
    },
    yearButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    section: {
        marginBottom: spacing.l,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    reportCard: {
        padding: spacing.m,
        borderRadius: spacing.s,
        marginBottom: spacing.s,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reportInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacing.m,
    },
    reportText: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    reportSubtitle: {
        fontSize: 12,
    },
    downloadButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        marginTop: spacing.m,
    },
    emptyCard: {
        padding: spacing.xl,
        borderRadius: spacing.m,
        alignItems: 'center',
    },
    emptyCardText: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default ReportCardScreen;
