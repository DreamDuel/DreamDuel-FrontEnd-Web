// API Configuration
// Configuración central de todos los endpoints de la API

export const API_CONFIG = {
  // Base URL del backend
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Timeout para requests
  TIMEOUT: 30000,
  
  // Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      GOOGLE: '/api/auth/google',
      APPLE: '/api/auth/apple',
      PASSWORD_RESET: '/api/auth/password-reset',
      VERIFY_EMAIL: '/api/auth/verify-email',
    },
    
    // Users
    USERS: {
      BASE: '/api/users',
      ME: '/api/users/me',
      PROFILE: (id: string) => `/api/users/${id}`,
      AVATAR: (id: string) => `/api/users/${id}/avatar`,
      FOLLOW: (id: string) => `/api/users/${id}/follow`,
      UNFOLLOW: (id: string) => `/api/users/${id}/unfollow`,
      FOLLOWERS: (id: string) => `/api/users/${id}/followers`,
      FOLLOWING: (id: string) => `/api/users/${id}/following`,
      CREDITS: '/api/users/me/credits',
    },
    
    // Stories
    STORIES: {
      BASE: '/api/stories',
      TRENDING: '/api/stories/trending',
      NEW: '/api/stories/new',
      FEATURED: '/api/stories/featured',
      BY_ID: (id: string) => `/api/stories/${id}`,
      BY_AUTHOR: (authorId: string) => `/api/stories/author/${authorId}`,
      SEARCH: '/api/stories/search',
      LIKE: (id: string) => `/api/stories/${id}/like`,
      SAVE: (id: string) => `/api/stories/${id}/save`,
      VIEW: (id: string) => `/api/stories/${id}/view`,
    },
    
    // AI Generation
    GENERATE: {
      BASE: '/api/generate',
      BATCH: '/api/generate/batch',
      STATUS: (id: string) => `/api/generate/${id}/status`,
      REGENERATE: (id: string) => `/api/generate/${id}/regenerate`,
      CANCEL: (id: string) => `/api/generate/${id}/cancel`,
    },
    
    // Comments
    COMMENTS: {
      BASE: '/api/comments',
      BY_STORY: (storyId: string) => `/api/comments/story/${storyId}`,
      BY_ID: (id: string) => `/api/comments/${id}`,
      LIKE: (id: string) => `/api/comments/${id}/like`,
      REPORT: (id: string) => `/api/comments/${id}/report`,
    },
    
    // Payments
    PAYMENTS: {
      BASE: '/api/payments',
      PLANS: '/api/payments/plans',
      SUBSCRIBE: '/api/payments/subscribe',
      STATUS: '/api/payments/subscription/status',
      CANCEL: '/api/payments/subscription/cancel',
      REACTIVATE: '/api/payments/subscription/reactivate',
      INVOICES: '/api/payments/invoices',
      PORTAL: '/api/payments/portal',
      PAYMENT_METHOD: '/api/payments/payment-method',
    },
    
    // Upload
    UPLOAD: {
      BASE: '/api/upload',
      IMAGE: '/api/upload/image',
      MULTIPLE: '/api/upload/multiple',
    },
    
    // Analytics
    ANALYTICS: {
      BASE: '/api/analytics',
      EVENT: '/api/analytics/event',
      USER_METRICS: '/api/analytics/user/metrics',
      STORY_ANALYTICS: (storyId: string) => `/api/analytics/story/${storyId}`,
    },
  },
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Códigos de error comunes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  RATE_LIMIT: 429,
};
