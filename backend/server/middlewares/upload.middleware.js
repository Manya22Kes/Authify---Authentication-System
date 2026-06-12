const multer = require("multer");
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

module.exports = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
