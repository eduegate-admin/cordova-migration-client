import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import { StudentService } from '../services/StudentService';
import { appSettings } from '../config/settings';

const ClassTeachersScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const studentIID = await StudentService.getStudentIID();
            const context = await ContextService.getContext();

            console.log("ClassTeachersScreen - StudentIID:", studentIID);

            const url = `${appSettings.schoolServiceUrl}/GetTeacherDetails?studentID=${studentIID}`;
            console.log("ClassTeachersScreen - Fetching:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const responseText = await response.text();
            console.log("ClassTeachersScreen - Response:", responseText);

            if (responseText && responseText.length > 0) {
                const data = JSON.parse(responseText);
                console.log("Teachers - Found:", data.length, "teacher(s)");
                if (data.length > 0) {
                    console.log("First teacher:", JSON.stringify(data[0], null, 2));
                }
                setTeachers(data);
            } else {
                console.warn("Teachers - Empty response");
                setTeachers([]);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            Alert.alert("Error", "Failed to load teachers.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.name, { color: colors.text }]}>
                {item.HeadTeacherName || 'Teacher Name'}
            </Text>
            <View style={styles.infoRow}>
                <View style={[styles.infoBadge, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Subject</Text>
                    <Text style={[styles.infoValue, { color: colors.primary }]}>
                        {item.SubjectName || 'N/A'}
                    </Text>
                </View>
                {item.GenderDescription && (
                    <View style={[styles.infoBadge, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Gender</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {item.GenderDescription}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <ScreenWrapper title="Class Teachers">
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={teachers}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.TeacherID?.toString() || index.toString()}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No teachers found.</Text>
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
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    infoRow: {
        flexDirection: 'row',
        gap: spacing.s,
    },
    infoBadge: {
        borderRadius: spacing.xs,
        padding: spacing.s,
        minWidth: 100,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: spacing.xs / 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        fontSize: 16,
    },
});

export default ClassTeachersScreen;
