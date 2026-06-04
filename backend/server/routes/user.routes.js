const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  updatePassword,
  getSecurityOverview,
  getSessions,
  revokeSessions,
} = require("../controllers/user.controller");

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, updatePassword);
router.get("/security", protect, getSecurityOverview);
router.get("/sessions", protect, getSessions);
router.delete("/sessions", protect, revokeSessions);

module.exports = router;
