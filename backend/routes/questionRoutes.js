const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { protect } = require("../middleware/auth");

router.post("/", protect, async (req, res) => {
  const q = new Question({ ...req.body, user: req.user._id });
  await q.save();
  res.status(201).json(q);
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const questions = await Question.find()
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Question.countDocuments();
  res.json({ questions, total });
});

router.get("/:id", async (req, res) => {
  const question = await Question.findById(req.params.id).populate("user", "username");
  res.json(question);
});
// Upvote a question
router.put("/:id/upvote", protect, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ error: "Not found" });
  q.upvotes += 1;
  await q.save();
  res.json({ upvotes: q.upvotes });
});

// Downvote a question
router.put("/:id/downvote", protect, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ error: "Not found" });
  q.downvotes += 1;
  await q.save();
  res.json({ downvotes: q.downvotes });
});

// Edit question (owner or admin)
router.put("/:id", protect, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ error: "Not found" });

  if (!q.user.equals(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ error: "Not authorized" });

  q.title = req.body.title;
  q.body = req.body.body;
  q.tags = req.body.tags;
  await q.save();

  res.json(q);
});

// Delete question (owner or admin)
router.delete("/:id", protect, async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ error: "Not found" });

  if (!q.user.equals(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ error: "Not authorized" });

  await q.deleteOne();
  res.json({ message: "Question deleted" });
});

module.exports = router;