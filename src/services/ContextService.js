import AsyncStorage from '@react-native-async-storage/async-storage';
import { appSettings } from '../config/settings';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const CONTEXT_KEY = 'context';

export const ContextService = {
    getContext: async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(CONTEXT_KEY);
            if (jsonValue != null) {
                return JSON.parse(jsonValue);
            }

            // Default Context
            const defaultContext = {
                CompanyID: "",
                EmailID: "",
                IPAddress: "1.1.1.1", // TODO: Get real IP
                LoginID: "",
                GUID: "",
                CurrencyCode: "",
                UserId: "0",
                ApiKey: "",
                UserRole: "",
                UserClaims: "",
                LanguageCode: "en",
                SiteID: ""
            };

            await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(defaultContext));
            return defaultContext;
        } catch (e) {
            console.error("Error reading context", e);
            return null;
        }
    },

    setContext: async (newContext) => {
        try {
            const current = await ContextService.getContext();
            const updated = { ...current, ...newContext };
            await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(updated));
            return updated;
        } catch (e) {
            console.error("Error saving context", e);
        }
    },

    clearContext: async () => {
        await AsyncStorage.removeItem(CONTEXT_KEY);
    },

    getApiKey: async (context) => {
        try {
            let deviceId = 'web-uuid-12345'; // Default for web
            if (Platform.OS === 'android') {
                deviceId = Application.androidId || 'android-mock-id';
            } else if (Platform.OS === 'ios') {
                deviceId = await Application.getIosIdForVendorAsync() || 'ios-mock-id';
            }

            const version = Application.nativeApplicationVersion || '1.0.0';

            console.log(`Generating API Key for UUID: ${deviceId}, Version: ${version}`);

            const response = await fetch(`${appSettings.rootUrl}/GenerateApiKey?uuid=${deviceId}&version=${version}`, {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const responseText = await response.text();
            // console.log("Raw API Key Response:", responseText); // Uncomment if needed

            try {
                const result = JSON.parse(responseText);
                return result;
            } catch (e) {
                console.log("API Key is plain text:", responseText);
                return responseText.replace(/^"|"$/g, ''); // Remove quotes if present
            }
        } catch (e) {
            console.error("Error generating API Key", e);
            return "";
        }
    }
};
