const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateEmail,
  getSecurityOverview,
  getSessions,
  revokeSessions,
  deleteAccount,
  uploadAvatar,
  getAccountActivity,
} = require("../controllers/user.controller");

router.get("/profile", protect, getProfile);
router.get("/activity", protect, getAccountActivity);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, updatePassword);
router.patch("/change-email", protect, updateEmail);
router.get("/security", protect, getSecurityOverview);
router.get("/sessions", protect, getSessions);
router.delete("/sessions", protect, revokeSessions);
router.delete("/account", protect, deleteAccount);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
