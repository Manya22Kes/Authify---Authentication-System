// API endpoint paths — base URL comes from env
export const API_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  VERIFICATION_STATUS: '/auth/verification-status',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
};

// User roles — must match backend enum exactly
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// App route paths
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_EMAIL_ROUTE: '/verify-email/:token',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
};

// Token config
export const TOKEN_EXPIRY_BUFFER_MS = 30_000; // 30s before expiry to refresh

// Toast durations
export const TOAST = {
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 4500,
  INFO_DURATION: 3000,
};
