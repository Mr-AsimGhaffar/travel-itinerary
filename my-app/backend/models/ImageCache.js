// models/ImageResult.js
const mongoose = require("mongoose");

const imageResultSchema = new mongoose.Schema(
  {
    hash: { type: String, unique: true },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImageResult", imageResultSchema);
