const User = require("../models/user.model");

function sanitizeProfile(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
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
  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
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

  // Create friendly device name
  let deviceName = null;

  if (user.lastLoginUserAgent?.includes("Chrome")) {
    deviceName = "Chrome on Windows";
  } else if (user.lastLoginUserAgent?.includes("Firefox")) {
    deviceName = "Firefox on Windows";
  } else {
    deviceName = user.lastLoginUserAgent || null;
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

    // Security Activity fields
    lastSuccessfulLogin: user.lastLoginAt || null,
    lastFailedLogin: user.lastFailedLoginAt || null,
    loginIp: user.lastLoginIp || null,
    deviceUsed: deviceName,

    lastLogin: user.lastLoginAt
      ? {
          loggedAt: user.lastLoginAt,
          ipAddress: user.lastLoginIp || "unknown",
          deviceUsed: deviceName,
          userAgent: user.lastLoginUserAgent || "unknown",
        }
      : null,

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

exports.updateEmail = async (userId, { newEmail, password }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new Error("Password is incorrect");
  }

  const existingUser = await User.findOne({
    email: newEmail.toLowerCase(),
  });

  if (existingUser && existingUser._id.toString() !== userId) {
    throw new Error("Email already in use");
  }

  user.email = newEmail.toLowerCase().trim();

  // Optional: force re-verification later
  // user.isVerified = false;
  user.emailChangedAt = new Date();
  await user.save();

  return {
    email: user.email,
  };
};

exports.deleteAccount = async (userId, password) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  await User.findByIdAndDelete(userId);

  return {
    message: "Account deleted successfully",
  };
};
exports.getAccountActivity = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    accountCreatedAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null,
    lastFailedLoginAt: user.lastFailedLoginAt || null,
    passwordChangedAt: user.passwordChangedAt || null,
    emailChangedAt: user.emailChangedAt || null,
  };
};
