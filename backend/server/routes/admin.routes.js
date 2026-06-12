const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const { getAdminStats } = require("../controllers/admin.controller");

router.get("/dashboard", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

module.exports = router;
