const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PriceOption = sequelize.define('PriceOption', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Hourly', 'Weekly', 'Monthly'),
      allowNull: false
    },
    serviceId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'price_options',
    timestamps: true
  });

  return PriceOption;
};
