const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: envPath });

const clientUrl =
  process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

process.env.CLIENT_URL = clientUrl;
process.env.FRONTEND_URL = clientUrl;

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL:
    process.env.RESEND_FROM_EMAIL || "Authify <onboarding@resend.dev>",
  CLIENT_URL: clientUrl,
  FRONTEND_URL: clientUrl,
  REQUIRE_EMAIL_VERIFICATION:
    process.env.REQUIRE_EMAIL_VERIFICATION === "true",
};
