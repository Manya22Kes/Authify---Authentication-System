const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const { apiLimiter } = require("./middlewares/rateLimiter");
const adminRoutes = require("./routes/admin.routes");
const passport = require("./config/passport");

const app = express();

app.use(helmet());
app.use(apiLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes(".vercel.app") ||
        origin === env.FRONTEND_URL
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.set("trust proxy", 1);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
