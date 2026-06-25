const { createHash, randomBytes } = require("crypto");
const env = require("../config/env");

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_URL = env.CLIENT_URL;
const REQUIRE_EMAIL_VERIFICATION = env.REQUIRE_EMAIL_VERIFICATION;
const User = require("../models/user.model");

const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
} = require("./email.service");

const VERIFICATION_WINDOW_MS = 60 * 60 * 1000;
const REFRESH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const LOGIN_HISTORY_LIMIT = 20;
const RECENTLY_VERIFIED_TOKEN_TTL_MS = 10 * 60 * 1000;
const recentlyVerifiedTokens = new Map();

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLoginAt: user.lastLoginAt || null,
});
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

function buildVerificationUrl(rawToken) {
  return `${CLIENT_URL}/verify-email/${rawToken}`;
}

function buildVerificationToken() {
  const rawToken = randomBytes(32).toString("hex");

  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiresAt: new Date(Date.now() + VERIFICATION_WINDOW_MS),
  };
}

function rememberVerifiedToken(hashedToken, user) {
  recentlyVerifiedTokens.set(hashedToken, {
    user: sanitizeUser(user),
    expiresAt: Date.now() + RECENTLY_VERIFIED_TOKEN_TTL_MS,
  });
}

function getRecentlyVerifiedUser(hashedToken) {
  const cachedVerification = recentlyVerifiedTokens.get(hashedToken);

  if (!cachedVerification) {
    return null;
  }

  if (cachedVerification.expiresAt <= Date.now()) {
    recentlyVerifiedTokens.delete(hashedToken);
    return null;
  }

  return cachedVerification.user;
}

function pushLoginHistory(user, { success, ipAddress, userAgent }) {
  const loginEvent = {
    success,
    ipAddress: ipAddress || "unknown",
    userAgent: userAgent || "unknown",
    loggedAt: new Date(),
  };

  const existingHistory = Array.isArray(user.loginHistory)
    ? user.loginHistory
    : [];

  user.loginHistory = [...existingHistory, loginEvent].slice(
    -LOGIN_HISTORY_LIMIT,
  );

  if (success) {
    user.lastLoginAt = loginEvent.loggedAt;
    user.lastLoginIp = loginEvent.ipAddress;
    user.lastLoginUserAgent = loginEvent.userAgent;
  } else {
    user.lastFailedLoginAt = loginEvent.loggedAt;
  }
}

async function issueAndSendVerification(user) {
  const verification = buildVerificationToken();

  user.emailVerificationToken = verification.hashedToken;
  user.emailVerificationExpires = verification.expiresAt;

  await user.save();

  const delivery = await sendVerificationEmail(
    user.email,
    user.name,
    buildVerificationUrl(verification.rawToken),
  );

  return {
    delivery,
  };
}
async function googleLogin(credential) {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const email = payload.email;
  const name = payload.name;
  const googleId = payload.sub;
  const avatar = payload.picture;

  let user = await User.findOne({ email });
  let isNewUser = false;

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar,
      isVerified: true,
      authProvider: "google",
    });
    isNewUser = true;
  } else {
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
    }

    if (!user.isVerified) {
      user.isVerified = true;
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpires = new Date(Date.now() + REFRESH_WINDOW_MS);

  await user.save();

  if (isNewUser) {
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("Welcome email failed", {
        email: user.email,
        message: error.message,
      });
    }
  }

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

async function githubLogin(profile) {
  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw new Error("GitHub account does not provide an email address");
  }

  const githubId = profile.id;
  const githubUsername = profile.username;
  const name = profile.displayName || profile.username;
  const avatar = profile.photos?.[0]?.value;

  let user = await User.findOne({ email });
  let isNewUser = false;

  if (!user) {
    user = await User.create({
      name,
      email,
      githubId,
      githubUsername,
      avatar,
      isVerified: true,
      authProvider: "github",
    });
    isNewUser = true;
  } else {
    if (!user.githubId) {
      user.githubId = githubId;
      user.githubUsername = githubUsername;
      user.authProvider = "github";
    }

    if (!user.avatar && avatar) {
      user.avatar = avatar;
    }

    if (!user.isVerified) {
      user.isVerified = true;
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpires = new Date(Date.now() + REFRESH_WINDOW_MS);

  await user.save();

  if (isNewUser) {
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("Welcome email failed", {
        email: user.email,
        message: error.message,
      });
    }
  }

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

exports.signup = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const verification = buildVerificationToken();

  const user = await User.create({
    name,
    email,
    password,
    isVerified: false,
    emailVerificationToken: verification.hashedToken,
    emailVerificationExpires: verification.expiresAt,
  });

  try {
    const delivery = await sendVerificationEmail(
      user.email,
      user.name,
      buildVerificationUrl(verification.rawToken),
    );

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("Welcome email failed", {
        email: user.email,
        message: error.message,
      });
    }

    return {
      user: sanitizeUser(user),
      verificationEmailSent: true,
      verificationEmailId: delivery?.id || null,
      message: "User created successfully. Verification email sent.",
    };
  } catch (error) {
    console.error("Signup succeeded but verification email failed", {
      email: user.email,
      message: error.message,
    });

    return {
      user: sanitizeUser(user),
      verificationEmailSent: false,
      verificationEmailId: null,
      message:
        "User created successfully, but the verification email could not be sent right now.",
    };
  }
};

exports.verifyEmail = async (token) => {
  if (!token) {
    throw new Error("Verification token is required");
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  });

  if (user) {
    if (user.isVerified) {
      return {
        user: sanitizeUser(user),
        message: "Email already verified",
      };
    }

    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires <= new Date()
    ) {
      throw new Error("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();
    rememberVerifiedToken(hashedToken, user);

    return {
      user: sanitizeUser(user),
      message: "Email verified successfully",
    };
  }

  const recentlyVerifiedUser = getRecentlyVerifiedUser(hashedToken);

  if (recentlyVerifiedUser) {
    return {
      user: recentlyVerifiedUser,
      message: "Email already verified",
    };
  }

  throw new Error("Invalid or expired verification token");
};

exports.resendVerificationEmail = async (email) => {
  const genericResponse = {
    success: true,
    message:
      "If an account with that email exists and is not verified, a new verification email has been sent.",
  };

  if (!email) {
    return genericResponse;
  }

  const user = await User.findOne({ email });

  if (!user || user.isVerified) {
    return genericResponse;
  }

  try {
    await issueAndSendVerification(user);
  } catch (error) {
    console.error("Resend verification failed", {
      email,
      message: error.message,
    });
  }

  return genericResponse;
};

exports.sendTestEmail = async ({ email, name }) => {
  if (!email) {
    throw new Error("Recipient email is required");
  }

  const rawToken = randomBytes(16).toString("hex");
  const delivery = await sendVerificationEmail(
    email,
    name || "there",
    buildVerificationUrl(rawToken),
  );

  return {
    email,
    deliveryId: delivery?.id || null,
  };
};

exports.login = async ({ email, password }, metadata = {}) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    pushLoginHistory(user, {
      success: false,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
    await user.save();
    throw new Error("Invalid credentials");
  }

  if (REQUIRE_EMAIL_VERIFICATION && !user.isVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpires = new Date(Date.now() + REFRESH_WINDOW_MS);

  pushLoginHistory(user, {
    success: true,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
  });

  await user.save();

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
    verification: {
      isVerified: user.isVerified,
      loginBlockedUntilVerified: REQUIRE_EMAIL_VERIFICATION,
      warning: user.isVerified
        ? null
        : "Email not verified yet. Please check your inbox for the verification link.",
    },
  };
};
exports.googleLogin = googleLogin;
exports.githubLogin = githubLogin;

exports.refreshToken = async (oldToken) => {
  if (!oldToken) {
    throw new Error("No refresh token provided");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(oldToken);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  const hashedIncoming = hashToken(oldToken);

  if (!user || user.refreshToken !== hashedIncoming) {
    throw new Error("Refresh token mismatch");
  }

  if (user.refreshTokenExpires && user.refreshTokenExpires <= new Date()) {
    user.refreshToken = null;
    user.refreshTokenExpires = null;
    await user.save();
    throw new Error("Refresh token expired");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = hashToken(newRefreshToken);
  user.refreshTokenExpires = new Date(Date.now() + REFRESH_WINDOW_MS);

  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: sanitizeUser(user),
    verification: {
      isVerified: user.isVerified,
      loginBlockedUntilVerified: REQUIRE_EMAIL_VERIFICATION,
      warning: user.isVerified
        ? null
        : "Email not verified yet. Please verify your account.",
    },
  };
};

exports.logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const hashedToken = hashToken(refreshToken);

  const user = await User.findOne({
    refreshToken: hashedToken,
  }).select("+refreshToken");

  if (user) {
    user.refreshToken = null;
    user.refreshTokenExpires = null;
    await user.save();
  }
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const resetToken = randomBytes(32).toString("hex");
  const hashedToken = hashToken(resetToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetUrl =
    `${process.env.FRONTEND_URL || "http://localhost:5173"}` +
    `/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(user.email, user.name, resetUrl);

  return resetToken;
};

exports.resetPassword = async (token, newPassword) => {
  if (!newPassword) {
    throw new Error("New password is required");
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeUser(user);
};

exports.getVerificationStatus = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    isVerified: user.isVerified,
    verificationPending: !user.isVerified,
  };
};
