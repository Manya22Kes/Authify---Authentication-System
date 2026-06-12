const adminService = require("../services/admin.service");

exports.getAdminStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
