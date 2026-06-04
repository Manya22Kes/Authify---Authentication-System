const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  verifyEmailController,
  resendVerificationEmail,
  getVerificationStatus,
  testEmail,
} = require("../controllers/auth.controller");

const { authLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/auth.middleware");

router.post("/signup", authLimiter, signup);
router.post("/register", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/verify-email/:token", verifyEmailController);
router.post("/resend-verification", authLimiter, resendVerificationEmail);
router.get("/verification-status", protect, getVerificationStatus);
router.post("/test-email", testEmail);

router.get("/me", protect, getCurrentUser);

router.get("/test", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
