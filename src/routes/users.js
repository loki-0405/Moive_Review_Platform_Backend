const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

router.get('/:id', getProfile);
router.put('/:id', auth, updateProfile);

router.get('/:id/watchlist', auth, getWatchlist);
router.post('/:id/watchlist', auth, addToWatchlist);
router.delete('/:id/watchlist/:movieId', auth, removeFromWatchlist);

module.exports = router;
