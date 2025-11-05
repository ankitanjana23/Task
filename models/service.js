const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('Normal', 'VIP'),
      allowNull: false,
      defaultValue: 'Normal'
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'services',
    timestamps: true
  });

  return Service;
};
