const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  logger.error('Please set DB_HOST, DB_USER and DB_NAME in .env');
  process.exit(1);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: 'postgres',
  logging: msg => logger.debug(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// import models after instance created
const Category = require('../models/category')(sequelize);
const Service = require('../models/service')(sequelize);
const PriceOption = require('../models/priceOption')(sequelize);

// associations
Category.hasMany(Service, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Service.belongsTo(Category, { foreignKey: 'categoryId' });

Service.hasMany(PriceOption, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
PriceOption.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = {
  sequelize,
  Sequelize,
  Category,
  Service,
  PriceOption
};
