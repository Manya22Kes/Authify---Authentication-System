const userService = require("../services/user.service");
const User = require("../models/user.model");
const uploadAvatarToCloudinary = require("../utils/uploadAvatar");
const cloudinary = require("../config/cloudinary");
const {
  updateProfileSchema,
  updatePasswordSchema,
  deleteAccountSchema,
  uploadAvatar,
} = require("../validators/user.validator");

exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const profile = await userService.updateProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { error } = updatePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await userService.updatePassword(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const result = await userService.updateEmail(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSecurityOverview = async (req, res) => {
  try {
    const overview = await userService.getSecurityOverview(req.user.id);

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await userService.getSessions(req.user.id);

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.revokeSessions = async (req, res) => {
  try {
    const result = await userService.revokeSessions(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { error } = deleteAccountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await userService.deleteAccount(
      req.user.id,
      req.body.password,
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const existingUser = await User.findById(req.user.id);

    // Delete old avatar from Cloudinary
    if (existingUser.avatarPublicId) {
      await cloudinary.uploader.destroy(existingUser.avatarPublicId);
    }

    const result = await uploadAvatarToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: result.secure_url,
        avatarPublicId: result.public_id,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Avatar Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAccountActivity = async (req, res) => {
  try {
    const activity = await userService.getAccountActivity(req.user.id);

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
