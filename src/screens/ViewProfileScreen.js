import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing } from '../theme/colors';
import { StudentService } from '../services/StudentService';

const ViewProfileScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const studentDetails = await StudentService.getStudentDetails();
            console.log("ViewProfileScreen - Student Details:", studentDetails);
            setProfile(studentDetails);
        } catch (error) {
            console.error("Error fetching profile:", error);
            Alert.alert("Error", "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={[styles.screenTitle, { color: colors.text }]}>My Profile</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : profile ? (
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {profile.PhotoPath && (
                                <Image
                                    source={{ uri: profile.PhotoPath }}
                                    style={styles.photo}
                                    resizeMode="cover"
                                />
                            )}

                            <Text style={[styles.label, { color: colors.textSecondary }]}>Student Name</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{profile.StudentName || 'N/A'}</Text>

                            <Text style={[styles.label, { color: colors.textSecondary }]}>Admission Number</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{profile.AdmissionNumber || 'N/A'}</Text>

                            <Text style={[styles.label, { color: colors.textSecondary }]}>Class</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{profile.ClassName || 'N/A'}</Text>

                            <Text style={[styles.label, { color: colors.textSecondary }]}>Section</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{profile.SectionName || 'N/A'}</Text>

                            {profile.Email && (
                                <>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                                    <Text style={[styles.value, { color: colors.text }]}>{profile.Email}</Text>
                                </>
                            )}

                            {profile.Phone && (
                                <>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
                                    <Text style={[styles.value, { color: colors.text }]}>{profile.Phone}</Text>
                                </>
                            )}

                            {profile.DateOfBirth && (
                                <>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>Date of Birth</Text>
                                    <Text style={[styles.value, { color: colors.text }]}>{profile.DateOfBirth}</Text>
                                </>
                            )}
                        </View>
                    </ScrollView>
                ) : (
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No profile data found.</Text>
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
    contentContainer: {
        paddingBottom: spacing.l,
    },
    card: {
        borderRadius: spacing.s,
        padding: spacing.m,
        borderWidth: 1,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: spacing.m,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: spacing.m,
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

export default ViewProfileScreen;
