const express = require("express");
const Thought = require("../../models/Thought");
const User = require("../../models/User");
const router = express.Router();

// Get all thoughts
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find().select("-__v");
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single thought by ID
router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new thought
router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findById(req.body.userId);
    user.thoughts.push(thought._id);
    await user.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a thought
router.put("/:id", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a thought
router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json({ message: "Thought deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a reaction
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    thought.reactions.push(req.body);
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    thought.reactions.pull({ _id: req.params.reactionId });
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
