const User = require("../models/user.model");

exports.getAdminStats = async () => {
  const totalUsers = await User.countDocuments();

  const verifiedUsers = await User.countDocuments({
    isVerified: true,
  });

  const admins = await User.countDocuments({
    role: "admin",
  });

  const activeSessions = await User.countDocuments({
    refreshToken: { $exists: true, $ne: null },
  });

  return {
    totalUsers,
    verifiedUsers,
    admins,
    activeSessions,
  };
};
