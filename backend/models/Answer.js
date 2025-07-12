// models/Answer.js
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
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

module.exports = mongoose.model("Answer", answerSchema);