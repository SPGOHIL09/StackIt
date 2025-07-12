// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Create Question
router.post("/", async (req, res) => {
  try {
    const newQ = new Question(req.body);
    await newQ.save();
    res.status(201).json(newQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().populate("user");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;