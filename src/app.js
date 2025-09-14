require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Import CORS

const app = express();

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:8081', // 👈 allow your frontend
  credentials: true, // if you're using cookies/auth headers
}));

// Middlewares
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');
const movieRatingRoutes = require('./routes/movieRating');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRatingRoutes);

app.use(errorHandler);

module.exports = app;
