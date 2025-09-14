// src/routes/movies.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const reviewController = require('../controllers/reviewController');
const { auth, adminOnly } = require('../middlewares/auth');
const Joi = require('joi');
const validate = require('../middlewares/validate');

// Movie endpoints
router.get('/', movieController.listMovies);
router.get('/:id', movieController.getMovie);
router.post('/', auth, adminOnly, movieController.createMovie);

// Reviews endpoints (nested under movies)
const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  text: Joi.string().allow('', null)
});

router.get('/:id/reviews', reviewController.listReviewsForMovie);
router.post('/:id/reviews', auth, validate(reviewSchema), reviewController.createReview);
router.put('/:id/reviews/:reviewId', auth, validate(reviewSchema), reviewController.updateReview);
router.delete('/:id/reviews/:reviewId', auth, reviewController.deleteReview);
router.get('/reviews/user/:userId', auth, reviewController.listReviewsByUser);


module.exports = router;
