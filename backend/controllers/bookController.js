const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    const book = await Book.create({ title, author, description, genre, year, addedBy: req.user._id });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const genre = req.query.genre;
    const sort = req.query.sort || '-createdAt';

    const filter = {};
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { author: { $regex: search, $options: 'i' } }];
    if (genre) filter.genre = genre;
    if (req.query.addedBy) filter.addedBy = req.query.addedBy;

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('addedBy', 'name');

    res.json({ books, page, pages: Math.ceil(total / limit), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ bookId: book._id }).populate('userId', 'name');
    const reviewCount = reviews.length;
    const averageRating = reviewCount ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2) : null;

    res.json({ book, reviews, averageRating, reviewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const updates = ['title', 'author', 'description', 'genre', 'year'];
    updates.forEach(field => { if (req.body[field] !== undefined) book[field] = req.body[field]; });
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await Review.deleteMany({ bookId: book._id });
    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
