// backend/models/inventoryHistory.js
module.exports = (sequelize, DataTypes) => {
  const InventoryHistory = sequelize.define('InventoryHistory', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return InventoryHistory;
};
