// Client Settings (from clientsettings.js)
export const clientSettings = {
    client: "eduegate", // Change to 'pearl', 'qaa', etc.
    appID: "student",
    defaultCurrency: "AED",
};

// App Settings (from appsettings.js)
const environments = {
    "eduegate-live": {
        rootUrl: 'http://demoapi.eduegate.com/api/appdata',
        schoolServiceUrl: "http://demoapi.eduegate.com/api/school",
        securityServiceUrl: "http://demoapi.eduegate.com/api/security",
        userServiceUrl: "http://demoapi.eduegate.com/api/useraccount",
        contentServiceUrl: "http://demoapi.eduegate.com/api/content",
    },
    "pearl-live": {
        rootUrl: 'https://api.pearlschool.org/api/appdata',
        schoolServiceUrl: "https://api.pearlschool.org/api/school",
        securityServiceUrl: "https://api.pearlschool.org/api/security",
        userServiceUrl: "https://api.pearlschool.org/api/useraccount",
        contentServiceUrl: "https://api.pearlschool.org/api/content",
    },
    // Add others as needed
};

// Select environment
const currentEnv = "pearl-live"; // TODO: Make this configurable via .env

export const appSettings = environments[currentEnv];
