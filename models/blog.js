const mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  status: {
    type: String,
    default: "Active",
  },
  comments: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      comment: {
        type: String,
      },
      website: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", userSchema);
