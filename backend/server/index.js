const env = require("./config/env");
const app = require("./app");
const mongoose = require("mongoose");

const PORT = env.PORT;

if (!env.MONGO_URI) {
  throw new Error("MONGO_URI is missing. Check backend/server/.env");
}

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
