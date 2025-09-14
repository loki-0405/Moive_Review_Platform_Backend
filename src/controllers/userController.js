const User = require('../models/User');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // review history:
    const reviews = await require('../models/Review').find({ user: user._id }).populate('movie', 'title posterUrl').sort({ createdAt: -1 });
    res.json({ user, reviews });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updates = (({ username, profilePicture }) => ({ username, profilePicture }))(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};

// watchlist endpoints
exports.getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.params.id }).populate('movie');
    res.json(items);
  } catch (err) { next(err); }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    const exists = await Watchlist.findOne({ user: req.params.id, movie: movieId });
    if (exists) return res.status(400).json({ message: 'Already in watchlist' });
    const item = await Watchlist.create({ user: req.params.id, movie: movieId });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    await Watchlist.findOneAndDelete({ user: req.params.id, movie: movieId });
    res.status(204).send();
  } catch (err) { next(err); }
};
