import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme, spacing } from '../theme/colors';
import { appSettings } from '../config/settings';
import { ContextService } from '../services/ContextService';

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting login to:", `${appSettings.securityServiceUrl}/StudentLogin`);

            // 1. Authenticate (Validate Credentials)
            const loginResponse = await fetch(`${appSettings.securityServiceUrl}/StudentLogin`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    'LoginEmailID': email,
                    'Password': password
                })
            });

            const loginResultText = await loginResponse.text();
            console.log("Login Result:", loginResultText);
            const loginResult = JSON.parse(loginResultText);

            if (loginResult.operationResult === 1) { // Success
                console.log("Credentials valid. Fetching user details...");

                // 2. Prepare Temporary Context for fetching details
                let tempContext = await ContextService.getContext();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    tempContext.EmailID = email;
                    tempContext.UserId = null;
                } else {
                    tempContext.UserId = email;
                }

                // 3. Get User Details
                const userDetailsResponse = await fetch(`${appSettings.rootUrl}/GetUserDetails`, {
                    method: 'GET',
                    headers: {
                        "Accept": "application/json;charset=UTF-8",
                        "Content-type": "application/json; charset=utf-8",
                        "CallContext": JSON.stringify(tempContext)
                    }
                });

                const userDetailsText = await userDetailsResponse.text();
                console.log("User Details Response:", userDetailsText);
                const userDetails = JSON.parse(userDetailsText);

                if (userDetails && (userDetails.LoginEmailID || userDetails.LoginUserID)) {
                    // 4. Get API Key
                    // Update context with retrieved IDs before asking for API Key
                    tempContext.EmailID = userDetails.LoginEmailID;
                    tempContext.LoginID = userDetails.UserID;
                    tempContext.UserId = userDetails.LoginUserID;

                    const apiKeyResult = await ContextService.getApiKey(tempContext);
                    console.log("API Key Result:", apiKeyResult);

                    // 5. Save Final Context
                    await ContextService.setContext({
                        ...tempContext,
                        ApiKey: apiKeyResult.data || apiKeyResult,
                        // Store other user info if needed
                        FirstName: userDetails.FirstName,
                        LastName: userDetails.LastName
                    });

                    // 6. Navigate
                    navigation.replace('Main');
                } else {
                    throw new Error("Could not retrieve user details.");
                }
            } else {
                Alert.alert("Login Failed", loginResult.Message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Flow Error:", error);
            Alert.alert("Error", error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Eduegate Login</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your account</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email / User ID"
                        placeholder="Enter your email or ID"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Button
                        title="Login"
                        onPress={handleLogin}
                        loading={loading}
                    />

                    <Button
                        title="Create Account"
                        onPress={() => navigation.navigate('Register')}
                        variant="secondary"
                    />
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    subtitle: {
        fontSize: 16,
    },
    form: {
        width: '100%',
    },
});

export default LoginScreen;
