const Review = require('../models/Review');
const Movie = require('../models/Movie');

async function updateMovieRating(movieId) {
  const agg = await Review.aggregate([
    { $match: { movie: movieId } },
    { $group: { _id: '$movie', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  if (agg.length === 0) {
    await Movie.findByIdAndUpdate(movieId, { averageRating: 0, reviewCount: 0 });
    return;
  }

  const { avg, count } = agg[0];
  await Movie.findByIdAndUpdate(movieId, { averageRating: parseFloat(avg.toFixed(2)), reviewCount: count });
}

module.exports = updateMovieRating;
