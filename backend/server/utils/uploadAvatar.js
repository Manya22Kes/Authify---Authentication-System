const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadAvatar = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "authify/avatars",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadAvatar;
