const jwt = require('jsonwebtoken');
const Joi = require('joi');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@codesfortomorrow.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
const jwtSecret = process.env.JWT_SECRET || 'super-secret-jwt-key';
const jwtExpires = process.env.JWT_EXPIRES_IN || '1d';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    // Only allowed to login with specified credentials
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: jwtExpires });
    return res.json({ token, expiresIn: jwtExpires });
  } catch (err) {
    next(err);
  }
};
