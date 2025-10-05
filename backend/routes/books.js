const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

// Add Book
router.post("/", auth, async (req, res) => {
  const { title, author, description, genre, year } = req.body;
  try {
    const book = await Book.create({ title, author, description, genre, year, addedBy: req.user });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Books with pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  try {
    const books = await Book.find().skip((page - 1) * limit).limit(limit);
    const total = await Book.countDocuments();
    res.json({ books, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
