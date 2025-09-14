const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const Joi = require('joi');
const validate = require('../middlewares/validate');

const regSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin') // 👈 add role
});

const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

router.post('/register', validate(regSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
