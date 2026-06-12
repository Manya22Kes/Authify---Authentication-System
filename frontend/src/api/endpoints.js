export const ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  VERIFICATION_STATUS: "/auth/verification-status",

  // Password
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Profile
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  UPLOAD_AVATAR: "/users/avatar",
  CHANGE_PASSWORD: "/users/password",
  CHANGE_EMAIL: "/users/change-email",
  DELETE_ACCOUNT: "/users/account",

  // Future: OTP, OAuth, MFA, Sessions
  // VERIFY_OTP: '/auth/verify-otp',
  // GOOGLE_OAUTH: '/auth/google',
  // GITHUB_OAUTH: '/auth/github',
  // MFA_SETUP: '/auth/mfa/setup',
  // MFA_VERIFY: '/auth/mfa/verify',
  // SESSIONS: '/auth/sessions',
  // AUDIT_LOGS: '/auth/audit-logs',
};
