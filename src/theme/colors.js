import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Light theme colors
export const lightColors = {
    // Background colors
    background: '#F5F5F5',
    surface: '#FFFFFF',

    // Text colors
    text: '#1A1A1A',
    textSecondary: '#666666',

    // Brand colors
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // UI elements
    border: '#E5E7EB',
    divider: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Additional
    cardBackground: '#FFFFFF',
    inputBackground: '#F9FAFB',

    // FAB colors
    fabGradientStart: '#6366F1',
    fabGradientEnd: '#8B5CF6',
};

// Dark theme colors
export const darkColors = {
    // Background colors
    background: '#0F172A',
    surface: '#1E293B',

    // Text colors
    text: '#F1F5F9',
    textSecondary: '#94A3B8',

    // Brand colors
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // UI elements
    border: '#334155',
    divider: '#334155',
    shadow: 'rgba(0, 0, 0, 0.5)',

    // Additional
    cardBackground: '#1E293B',
    inputBackground: '#334155',

    // FAB colors
    fabGradientStart: '#6366F1',
    fabGradientEnd: '#8B5CF6',
};

// Spacing constants
export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

const ThemeContext = createContext({
    isDark: true,
    colors: darkColors,
    toggleTheme: () => { },
    setTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            } else {
                // Default to dark mode or system preference
                setIsDark(true);
            }
        } catch (e) {
            console.error('Failed to load theme', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (e) {
            console.error('Failed to save theme', e);
        }
    };

    const theme = {
        isDark,
        colors: isDark ? darkColors : lightColors,
        toggleTheme,
    };

    if (!isLoaded) {
        return null; // Or a splash screen
    }

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

// Default export for backwards compatibility (though usage should be updated)
export const colors = darkColors;
