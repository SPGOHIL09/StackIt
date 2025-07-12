// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Question", questionSchema);