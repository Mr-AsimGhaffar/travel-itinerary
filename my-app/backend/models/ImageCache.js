const mongoose = require("mongoose");

const imageCacheSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true, unique: true },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImageCache", imageCacheSchema);
