import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/colors';
import { ContextService } from '../services/ContextService';
import * as screens from '../screens';
import { Home, User, Zap } from 'lucide-react-native';
import LiquidGlassButton from '../components/LiquidGlassButton';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { colors, isDark } = useTheme();

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarStyle: {
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        elevation: 0,
                        height: 85,
                    },
                    tabBarBackground: () => (
                        <BlurView
                            tint={isDark ? 'dark' : 'light'}
                            intensity={80}
                            style={StyleSheet.absoluteFill}
                        />
                    ),
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={screens.HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Demo"
                    component={screens.DemoScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Zap color={color} size={size} />,
                        title: 'Features'
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={screens.ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>

            <LiquidGlassButton />
        </View>
    );
};

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={screens.LoginScreen} />
            <Stack.Screen name="Register" component={screens.RegisterScreen} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const context = await ContextService.getContext();
            console.log("Checking auth status. Context:", context);

            // Check if user has a valid API key and Login ID
            if (context && context.ApiKey && context.LoginID) {
                console.log("Valid session found, auto-logging in");
                setIsLoggedIn(true);
            } else {
                console.log("No valid session found");
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={isLoggedIn ? "Main" : "Auth"}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Attendance" component={screens.AttendanceScreen} />
                <Stack.Screen name="ReportCard" component={screens.ReportCardScreen} />
                <Stack.Screen name="Assignments" component={screens.AssignmentsScreen} />
                <Stack.Screen name="AssignmentDetail" component={screens.AssignmentDetailScreen} />
                <Stack.Screen name="Lesson" component={screens.LessonScreen} />
                <Stack.Screen name="ClassTeachers" component={screens.ClassTeachersScreen} />
                <Stack.Screen name="Notes" component={screens.NotesScreen} />
                <Stack.Screen name="TimeTable" component={screens.TimeTableScreen} />
                <Stack.Screen name="DriverDetails" component={screens.DriverDetailsScreen} />
                <Stack.Screen name="BusRoute" component={screens.BusRouteScreen} />
                <Stack.Screen name="Exam" component={screens.ExamScreen} />
                <Stack.Screen name="ViewProfile" component={screens.ViewProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
