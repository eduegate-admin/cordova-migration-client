import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme, spacing, colors } from '../theme/colors';
import { Bell, TrendingUp, Users, Activity, FileText, ClipboardList, BookOpen, GraduationCap, StickyNote, Calendar, PenTool, Bus, Car, UserCircle } from 'lucide-react-native';
import { ContextService } from '../services/ContextService';
import { appSettings } from '../config/settings';

const MenuCard = ({ title, value, icon: Icon, color, themeColors, onPress }) => (
    <TouchableOpacity style={[styles.menuCardWrapper]} onPress={onPress}>
        <View style={[styles.menuCard, { backgroundColor: themeColors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon color={color} size={28} />
            </View>
            <View style={styles.menuContent}>
                {value && <Text style={[styles.menuValue, { color: themeColors.text }]}>{value}</Text>}
                <Text style={[styles.menuTitle, { color: themeColors.textSecondary }]}>{title}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const context = await ContextService.getContext();
            if (context && context.ApiKey) {
                // Fetch full user details if needed, or just use context
                // For now, we'll try to fetch user details using the legacy endpoint
                console.log("Fetching user data from:", `${appSettings.rootUrl}/GetUserDetails`);
                const response = await fetch(`${appSettings.rootUrl}/GetUserDetails`, {
                    method: 'GET',
                    headers: {
                        "Accept": "application/json;charset=UTF-8",
                        "Content-type": "application/json; charset=utf-8",
                        "CallContext": JSON.stringify(context)
                    }
                });
                // Student card styles


                const responseText = await response.text();
                console.log("Raw User Data Response:", responseText);

                try {
                    const result = JSON.parse(responseText);
                    setUser(result);
                } catch (e) {
                    console.error("Failed to parse user data JSON:", responseText);
                }
            }
        } catch (e) {
            console.error("Error loading user data", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ScreenWrapper style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Student Details Card */}
                <View style={styles.studentCard}>
                    <View style={styles.avatarPlaceholder} />
                    <View style={styles.studentInfoContainer}>
                        <Text style={[styles.studentName, { color: colors.text }]}>{user?.FirstName || ''} {user?.LastName || ''}</Text>
                        <Text style={[styles.studentClass, { color: colors.textSecondary }]}>{user?.ClassName || ''}</Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.text }]}>Hello, {user?.FirstName || 'Student'}</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Welcome back to Eduegate</Text>
                    </View>
                    <View style={[styles.notificationButton, { backgroundColor: colors.surface }]}>
                        <Bell color={colors.text} size={24} />
                    </View>
                </View>

                <View style={styles.menuGrid}>
                    <MenuCard title="Attendance" icon={Users} color="#4CAF50" themeColors={colors} onPress={() => navigation.navigate('Attendance')} />
                    <MenuCard title="Report Card" icon={FileText} color="#FF5722" themeColors={colors} onPress={() => navigation.navigate('ReportCard')} />
                    <MenuCard title="Assignments" icon={ClipboardList} color="#2196F3" themeColors={colors} onPress={() => navigation.navigate('Assignments')} />
                    <MenuCard title="Lesson Plan" icon={BookOpen} color="#9C27B0" themeColors={colors} onPress={() => navigation.navigate('Lesson')} />
                    <MenuCard title="Teachers" icon={GraduationCap} color="#E91E63" themeColors={colors} onPress={() => navigation.navigate('ClassTeachers')} />
                    <MenuCard title="Notes" icon={StickyNote} color="#FF9800" themeColors={colors} onPress={() => navigation.navigate('Notes')} />
                    <MenuCard title="Time Table" icon={Calendar} color="#00BCD4" themeColors={colors} onPress={() => navigation.navigate('TimeTable')} />
                    <MenuCard title="Exams" icon={PenTool} color="#673AB7" themeColors={colors} onPress={() => navigation.navigate('Exam')} />
                    <MenuCard title="Bus Route" icon={Bus} color="#FFC107" themeColors={colors} onPress={() => navigation.navigate('BusRoute')} />
                    <MenuCard title="Driver" icon={Car} color="#795548" themeColors={colors} onPress={() => navigation.navigate('DriverDetails')} />
                    <MenuCard title="Profile" icon={UserCircle} color="#607D8B" themeColors={colors} onPress={() => navigation.navigate('ViewProfile')} />
                    <MenuCard title="Fees Due" value="AED 0" icon={Activity} color="#F44336" themeColors={colors} />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Updates</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.cardText, { color: colors.text }]}>New circular: Exam Schedule</Text>
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>2 hours ago</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.cardText, { color: colors.text }]}>Assignment "Physics Lab" added</Text>
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>Yesterday</Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: spacing.m,
        marginBottom: spacing.l,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc', // fallback color; actual color applied inline if needed
        marginRight: spacing.m,
    },
    studentInfoContainer: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: '600',
    },
    studentClass: {
        fontSize: 14,
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
    notificationButton: {
        padding: spacing.s,
        borderRadius: spacing.s,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.l,
    },
    menuCardWrapper: {
        width: '31%', // 3 columns
        marginBottom: spacing.m,
    },
    menuCard: {
        width: '100%',
        padding: spacing.s,
        borderRadius: spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    iconContainer: {
        padding: spacing.s,
        borderRadius: spacing.s,
        marginBottom: spacing.s,
    },
    menuContent: {
        alignItems: 'center',
    },
    menuValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    menuTitle: {
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        marginBottom: spacing.l,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    card: {
        padding: spacing.m,
        borderRadius: spacing.s,
        marginBottom: spacing.s,
    },
    cardText: {
        fontSize: 16,
        marginBottom: spacing.xs,
    },
    timeText: {
        fontSize: 12,
    },
});

export default HomeScreen;
