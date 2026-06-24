const env = require("../config/env");
const authService = require("../services/auth.service");
const {
  signupSchema,
  loginSchema,
  emailSchema,
  testEmailSchema,
} = require("../validators/auth.validator");

const {
  updateProfileSchema,
  updatePasswordSchema,
  updateEmailSchema,
} = require("../validators/user.validator");
const passport = require("../config/passport");

function cookieOptions() {
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function getRequestMetadata(req) {
  return {
    ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
    userAgent: req.headers["user-agent"] || "unknown",
  };
}

exports.signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await authService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        verificationEmailSent: result.verificationEmailSent,
        verificationEmailId: result.verificationEmailId,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { accessToken, refreshToken, user, verification } =
      await authService.login(req.body, getRequestMetadata(req));

    return res
      .cookie("refreshToken", refreshToken, cookieOptions())
      .status(200)
      .json({
        success: true,
        accessToken,
        user,
        verification,
      });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    const { accessToken, refreshToken, user, verification } =
      await authService.refreshToken(oldToken);

    return res
      .cookie("refreshToken", refreshToken, cookieOptions())
      .status(200)
      .json({
        success: true,
        accessToken,
        user,
        verification,
      });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    await authService.logout(token);

    return res.clearCookie("refreshToken", cookieOptions()).status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { error } = emailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email } = req.body;
    const resetToken = await authService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, reset instructions were sent.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password, newPassword } = req.body;

    await authService.resetPassword(token, newPassword || password);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyEmailController = async (req, res) => {
  try {
    const result = await authService.verifyEmail(req.params.token);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error("Email verification failed", {
      message: error.message,
      tokenPreview: req.params.token
        ? `${req.params.token.slice(0, 8)}...`
        : null,
    });

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { error } = emailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await authService.resendVerificationEmail(req.body.email);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Resend verification failed", {
      message: error.message,
      details: error.details || null,
      body: req.body || null,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVerificationStatus = async (req, res) => {
  try {
    const verification = await authService.getVerificationStatus(req.user.id);

    return res.status(200).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.testEmail = async (req, res) => {
  try {
    if (env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "The test email route is disabled in production.",
      });
    }

    const { error, value } = testEmailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await authService.sendTestEmail(value);

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Test email failed", {
      message: error.message,
      details: error.details || null,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
      details: error.details || null,
    });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { error } = updateEmailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await userService.updateEmail(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const { accessToken, refreshToken, user } =
      await authService.googleLogin(credential);

    return res
      .cookie("refreshToken", refreshToken, cookieOptions())
      .status(200)
      .json({
        success: true,
        accessToken,
        user,
      });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.githubCallback = async (req, res) => {
  try {
    const { refreshToken } = await authService.githubLogin(req.user);

    res
      .cookie("refreshToken", refreshToken, cookieOptions())
      .redirect(`${env.CLIENT_URL}/oauth/callback`);
  } catch (error) {
    console.error("GitHub login failed", error);

    res.redirect(`${env.CLIENT_URL}/login`);
  }
};
