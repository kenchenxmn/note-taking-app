const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/** GET All Notes (Only for Logged-in Users) */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** POST Create a New Note */
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "All fields are required" });

  try {
    const note = new Note({ user: req.user.id, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** PUT Update an Existing Note */
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Ensure user owns the note
    if (note.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** DELETE Remove a Note */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Ensure user owns the note
    if (note.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    await Note.deleteOne({ _id: note._id });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
