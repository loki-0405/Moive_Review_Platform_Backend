const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  addedAt: { type: Date, default: Date.now }
});

watchlistSchema.index({ user:1, movie:1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
