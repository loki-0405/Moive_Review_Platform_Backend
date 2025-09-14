const Movie = require('../models/Movie');
const Review = require('../models/Review');
const updateMovieRating = require('../utils/calculateRating');

exports.listMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, genre, q, year, minRating } = req.query;
    const filter = {};
    if (genre) filter.genre = { $in: [genre] };
    if (year) filter.releaseYear = parseInt(year);
    if (minRating) filter.averageRating = { $gte: parseFloat(minRating) };
    if (q) filter.$text = { $search: q }; // create text index on title/synopsis for this to work

    const movies = await Movie.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ averageRating: -1, createdAt: -1 });

    const total = await Movie.countDocuments(filter);
    res.json({ data: movies, page: parseInt(page), total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const reviews = await Review.find({ movie: movie._id }).populate('user', 'username profilePicture').sort({ createdAt: -1 });
    res.json({ movie, reviews });
  } catch (err) { next(err); }
};

exports.createMovie = async (req, res, next) => {
  try {
    const doc = await Movie.create(req.body);
    res.status(201).json(doc);
  } catch (err) { next(err); }
};
