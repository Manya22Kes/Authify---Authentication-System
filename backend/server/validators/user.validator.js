const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
});

exports.updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "New password must include uppercase, lowercase, and a number",
      "string.empty": "New password is required",
    }),
});

exports.updateEmailSchema = Joi.object({
  newEmail: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "New email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

exports.deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
