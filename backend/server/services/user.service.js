const User = require("../models/user.model");

function sanitizeProfile(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt || null,
  };
}

function sanitizeLoginHistory(history = []) {
  return [...history]
    .sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt))
    .map((entry) => ({
      loggedAt: entry.loggedAt,
      success: entry.success,
      ipAddress: entry.ipAddress || "unknown",
      userAgent: entry.userAgent || "unknown",
    }));
}

exports.getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeProfile(user);
};

exports.updateProfile = async (userId, { name }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.name = name.trim();
  await user.save();

  return sanitizeProfile(user);
};

exports.updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatches = await user.comparePassword(currentPassword);

  if (!passwordMatches) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return {
    message: "Password updated successfully",
  };
};

exports.getSecurityOverview = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    verification: {
      isVerified: user.isVerified,
      verificationPending: !user.isVerified,
    },
    sessionStatus: {
      hasActiveRefreshSession: Boolean(user.refreshToken),
      refreshTokenExpires: user.refreshTokenExpires || null,
      multiDeviceSessionsSupported: false,
    },
    lastLogin: user.lastLoginAt
      ? {
          loggedAt: user.lastLoginAt,
          ipAddress: user.lastLoginIp || "unknown",
          userAgent: user.lastLoginUserAgent || "unknown",
        }
      : null,
    lastFailedLoginAt: user.lastFailedLoginAt || null,
    securityIndicators: {
      passwordProtected: true,
      emailVerified: user.isVerified,
      refreshSessionStored: Boolean(user.refreshToken),
    },
    loginHistory: sanitizeLoginHistory(user.loginHistory).slice(0, 10),
  };
};

exports.getSessions = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.refreshToken) {
    return [];
  }

  return [
    {
      id: "primary-refresh-session",
      current: true,
      loggedAt: user.lastLoginAt || null,
      ipAddress: user.lastLoginIp || "unknown",
      userAgent: user.lastLoginUserAgent || "unknown",
      expiresAt: user.refreshTokenExpires || null,
    },
  ];
};

exports.revokeSessions = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new Error("User not found");
  }

  user.refreshToken = null;
  user.refreshTokenExpires = null;
  await user.save();

  return {
    message: "All refresh sessions revoked successfully",
  };
};
