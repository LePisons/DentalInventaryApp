module.exports = (sequelize, DataTypes) => {
  const InventoryItem = sequelize.define('InventoryItem', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: true // Change this to false if you want to make it required
    }
  });
  return InventoryItem;
};