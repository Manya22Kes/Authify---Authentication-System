const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: envPath });

function readEnv(name, fallback) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

const clientUrl =
  readEnv("CLIENT_URL") ||
  readEnv("FRONTEND_URL") ||
  "http://localhost:5173";

process.env.CLIENT_URL = clientUrl;
process.env.FRONTEND_URL = clientUrl;

module.exports = {
  NODE_ENV: readEnv("NODE_ENV", "development"),
  PORT: readEnv("PORT", 5000),
  MONGO_URI: readEnv("MONGO_URI"),

  JWT_ACCESS_SECRET: readEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: readEnv("JWT_REFRESH_SECRET"),

  GOOGLE_CLIENT_ID: readEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: readEnv("GOOGLE_CLIENT_SECRET"),

  GITHUB_CLIENT_ID: readEnv("GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: readEnv("GITHUB_CLIENT_SECRET"),

  BASE_URL: readEnv("BASE_URL"),

  RESEND_API_KEY: readEnv("RESEND_API_KEY"),
  RESEND_FROM_EMAIL: readEnv(
    "RESEND_FROM_EMAIL",
    "Authify <onboarding@resend.dev>",
  ),

  CLIENT_URL: clientUrl,
  FRONTEND_URL: clientUrl,

  REQUIRE_EMAIL_VERIFICATION: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
};
