const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, 
  profilePicture: { type: String },
  joinDate: { type: Date, default: Date.now },
  role: { type: String, enum: ['user','admin'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
