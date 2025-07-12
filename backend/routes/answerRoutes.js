// routes/answerRoutes.js
const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");

// Create Answer
router.post("/", async (req, res) => {
  try {
    const newA = new Answer(req.body);
    await newA.save();
    res.status(201).json(newA);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get answers for a question
router.get("/question/:id", async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.id }).populate("user");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all answers for a specific question
router.get("/question/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const answers = await Answer.find({ question: questionId })
      .populate("user", "username")  // Show answer author
      .sort({ createdAt: -1 });      // Newest first (optional)

    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});


module.exports = router;