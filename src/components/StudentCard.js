import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { spacing } from '../theme/colors';

const StudentCard = ({ student, onViewProfile }) => {
    // Default values if student data is missing
    const name = student?.FirstName ? `${student.FirstName} ${student.LastName || ''}` : 'Student Name';
    const id = student?.AdmissionNo || 'ID: P0118'; // Fallback or actual field
    const className = student?.ClassName || 'Class';
    const schoolName = student?.SchoolName || 'Podar Pearl School';
    const avatarUrl = student?.PhotoUrl || 'https://via.placeholder.com/100'; // Replace with actual default

    return (
        <LinearGradient
            colors={['#6366F1', '#8B5CF6']} // Primary to Secondary gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <View style={styles.contentContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.detailText}>{className}</Text>
                    <Text style={styles.detailText}>{schoolName}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.viewProfileButton} onPress={onViewProfile}>
                <Text style={styles.viewProfileText}>View Profile</Text>
                <ChevronRight size={12} color="#FFFFFF" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: spacing.m,
        marginBottom: spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 160, // Approximate height from design
        position: 'relative',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        marginRight: spacing.m,
        // Optional: add border or shadow to avatar if needed
    },
    avatar: {
        width: 80, // Slightly smaller than 100 to fit better
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: spacing.xs,
    },
    name: {
        fontSize: 18, // Bumped up from 13px for readability
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        fontFamily: 'System', // Use system font or custom if available
    },
    idText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 2,
        fontWeight: 'bold',
    },
    detailText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 2,
    },
    viewProfileButton: {
        position: 'absolute',
        bottom: spacing.m,
        right: spacing.m,
        backgroundColor: '#3a62b0', // From Figma
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewProfileText: {
        color: '#FFFFFF',
        fontSize: 10, // Close to Figma's 8px
        fontWeight: '600',
        marginRight: 4,
    },
});

export default StudentCard;
