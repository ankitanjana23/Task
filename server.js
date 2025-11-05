require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { sequelize } = require('./config/database.js');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120
});
app.use(limiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// Error handler
app.use(errorHandler);

// Connect DB then start
(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected.');
    // Synchronize models. In production, prefer migrations.
    await sequelize.sync({ alter: false }); // set to false to avoid unintended changes
    logger.info('Models synchronized.');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Initialization error', err);
    process.exit(1);
  }
})();
