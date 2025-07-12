// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register (basic, no hashing yet)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, firstName,lastName, dob, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;