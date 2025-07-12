// routes/answerRoutes.js
const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
const { protect } = require("../middleware/auth");

// Create Answer
router.post("/", protect, async (req, res) => {
  try {
    const newA = new Answer({ ...req.body, user: req.user._id });
    await newA.save();
    await newA.populate("user", "username");
    res.status(201).json(newA);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all answers for a specific question
router.get("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const answers = await Answer.find({ question: id })
      .populate("user", "username")  // Show answer author
      .sort({ createdAt: -1 });      // Newest first (optional)

    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// Upvote answer
router.put("/:id/upvote", protect, async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ error: "Answer not found" });
  answer.upvotes += 1;
  await answer.save();
  res.json({ message: "Upvoted", upvotes: answer.upvotes });
});

// Downvote answer
router.put("/:id/downvote", protect, async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ error: "Answer not found" });
  answer.downvotes += 1;
  await answer.save();
  res.json({ message: "Downvoted", downvotes: answer.downvotes });
});

// Edit answer
router.put("/:id", protect, async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ error: "Not found" });

  if (!answer.user.equals(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }

  answer.body = req.body.body;
  await answer.save();
  res.json(answer);
});

// Delete answer
router.delete("/:id", protect, async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ error: "Not found" });

  if (!answer.user.equals(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }

  await answer.deleteOne();
  res.json({ message: "Deleted" });
});


module.exports = router;