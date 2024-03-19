const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  videos: {
    type: [String],
  },
  videostatus: {
    type: String,
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("galleryVideo", userSchema);
