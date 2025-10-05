const express = require('express');
const { addReview, updateReview, deleteReview, getReviewsForBook } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, addReview); // body: { bookId, rating, reviewText }
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);
router.get('/book/:bookId', getReviewsForBook);

module.exports = router;
