import { ContextService } from './ContextService';
import { appSettings } from '../config/settings';

/**
 * StudentService - Centralized service for fetching student details
 * 
 * This service follows the pattern used in ReportCardScreen:
 * 1. Gets context (containing UserId/admission number)
 * 2. Fetches full student details using admission number
 * 3. Caches and returns StudentIID for use in other API calls
 */

let cachedStudentDetails = null;

export const StudentService = {
    /**
     * Fetches student details by admission number and caches the result
     * @returns {Promise<Object>} Student details including StudentIID
     */
    getStudentDetails: async () => {
        // Return cached details if available
        if (cachedStudentDetails) {
            return cachedStudentDetails;
        }

        try {
            const context = await ContextService.getContext();

            // Use UserId as admission number (same as ReportCardScreen)
            const admissionNumber = context.UserId;

            if (!admissionNumber) {
                throw new Error('Admission number not found in context');
            }

            const url = `${appSettings.schoolServiceUrl}/GetStudentDetailsByAdmissionNumber?admissionNumber=${admissionNumber}`;
            console.log('StudentService - Fetching student details:', url);

            const response = await fetch(url, {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-type": "application/json; charset=utf-8",
                    "CallContext": JSON.stringify(context)
                }
            });

            const responseText = await response.text();
            console.log('StudentService - Response:', responseText);

            if (responseText && responseText.length > 0) {
                const details = JSON.parse(responseText);
                console.log('StudentService - Parsed student details:', details);

                if (!details || !details.StudentIID) {
                    throw new Error('Student details not found or missing StudentIID');
                }

                // Cache the student details
                cachedStudentDetails = details;
                return details;
            } else {
                throw new Error('Empty response from server');
            }
        } catch (error) {
            console.error('StudentService - Error fetching student details:', error);
            throw error;
        }
    },

    /**
     * Gets cached Student IID (internal ID used by most APIs)
     * @returns {Promise<number>} StudentIID
     */
    getStudentIID: async () => {
        const details = await StudentService.getStudentDetails();
        return details.StudentIID;
    },

    /**
     * Clears the cached student details
     * Call this when user logs out or switches accounts
     */
    clearCache: () => {
        cachedStudentDetails = null;
    }
};
