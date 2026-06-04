const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const { apiLimiter } = require("./middlewares/rateLimiter");

const app = express();

app.use(helmet());
app.use(apiLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

module.exports = app;
