const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;
    if (!bookId || !rating) return res.status(400).json({ message: 'bookId and rating required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existing = await Review.findOne({ bookId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this book' });

    const review = await Review.create({ bookId, userId: req.user._id, rating, reviewText });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate review' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    review.rating = req.body.rating ?? review.rating;
    review.reviewText = req.body.reviewText ?? review.reviewText;
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsForBook = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId', 'name');
    const reviewCount = reviews.length;
    const averageRating = reviewCount ? (reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(2) : null;
    res.json({ reviews, reviewCount, averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
