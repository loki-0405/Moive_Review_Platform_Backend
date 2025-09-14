
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const updateMovieRating = require('../utils/calculateRating');


exports.createReview = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const { rating, text } = req.body;

    
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    
    const existing = await Review.findOne({ user: req.user._id, movie: movieId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this movie' });

    const review = await Review.create({
      user: req.user._id,
      movie: movieId,
      rating,
      text
    });

   
    await updateMovieRating(movieId);
    await review.populate('user', 'username profilePicture');


    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};


exports.listReviewsForMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const { page = 1, limit = 20 } = req.query;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ movie: movieId });

    res.json({
      data: reviews,
      page: parseInt(page),
      total,
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    next(err);
  }
};


exports.updateReview = async (req, res, next) => {
  try {
    const { id: movieId, reviewId } = req.params;
    const { rating, text } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // ensure the review belongs to the movie param (sanity)
    if (review.movie.toString() !== movieId) {
      return res.status(400).json({ message: 'Review does not belong to that movie' });
    }

    // authorization: owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // allow partial updates
    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    review.updatedAt = new Date();

    await review.save();

    // recalc movie rating
    await updateMovieRating(movieId);

    await review.populate('user', 'username profilePicture');


    res.json(review);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a review
 * DELETE /api/movies/:id/reviews/:reviewId
 * Auth required - only review owner or admin
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id: movieId, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.movie.toString() !== movieId) {
      return res.status(400).json({ message: 'Review does not belong to that movie' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // 🔥 Replace review.remove() with:
    await Review.findByIdAndDelete(reviewId);

    await updateMovieRating(movieId);

    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
};


/**
 * (Optional) Get a single review by id
 * GET /api/reviews/:reviewId
 */
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId).populate('user', 'username profilePicture').populate('movie', 'title posterUrl');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
};


exports.listReviewsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find({ user: userId })
      .populate('movie', 'title posterUrl year genre') // populate movie details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: userId });

    res.json({
      reviews,
      page: parseInt(page),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};
