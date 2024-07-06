'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryItem extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  InventoryItem.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    low_stock_threshold: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InventoryItem',
  });
  return InventoryItem;
};
