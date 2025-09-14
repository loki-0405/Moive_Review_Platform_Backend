const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const mongoose = require('mongoose');

router.get('/:movieId/rating', async (req, res) => {
  const { movieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  try {
    const agg = await Review.aggregate([
      { $match: { movie:new mongoose.Types.ObjectId(movieId) } },
      {
        $group: {
          _id: '$movie',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (agg.length === 0) {
      return res.json({ averageRating: 0, reviewCount: 0 });
    }

    const { averageRating, reviewCount } = agg[0];

    res.json({
      averageRating: parseFloat(averageRating.toFixed(2)),
      reviewCount
    });
  } catch (err) {
    console.error('Aggregation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
