// Feature flags for the application
export const features = {
  // AI Services features
  aiServices: true,
  serviceHealth: true,
  jobHistory: true,
  realTimeUpdates: true,
  
  // Demo features
  demo: {
    enabled: true,
    requireAuth: true, // AI services require authentication
    showUsageStats: true,
    showJobHistory: true,
  },
  
  // Authentication features
  auth: {
    googleOAuth: true,
    sessionPersistence: true,
    protectedRoutes: true,
  },
  
  // UI features
  darkMode: true,
  animations: true,
  notifications: true,
}

export type Features = typeof features