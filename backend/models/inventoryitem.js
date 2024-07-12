module.exports = (sequelize, DataTypes) => {
  const InventoryItem = sequelize.define('InventoryItem', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  InventoryItem.associate = function(models) {
    InventoryItem.hasMany(models.InventoryHistory, {
      foreignKey: 'itemId',
      as: 'history'
    });
  };

  return InventoryItem;
};