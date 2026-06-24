const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    refreshToken: {
      type: String,
      select: false,
    },
    refreshTokenExpires: Date,

    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
    },

    lastLoginAt: Date,
    lastLoginIp: String,
    lastLoginUserAgent: String,
    lastFailedLoginAt: Date,
    loginHistory: [
      {
        loggedAt: {
          type: Date,
          default: Date.now,
        },
        success: {
          type: Boolean,
          required: true,
        },
        ipAddress: String,
        userAgent: String,
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    emailChangedAt: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    githubId: {
      type: String,
      default: null,
    },
    githubUsername: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
