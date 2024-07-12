module.exports = (sequelize, DataTypes) => {
  const InventoryHistory = sequelize.define('InventoryHistory', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemName: {
      type: DataTypes.STRING,
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

  InventoryHistory.associate = function(models) {
    InventoryHistory.belongsTo(models.InventoryItem, {
      foreignKey: 'itemId',
      as: 'item'
    });
  };

  return InventoryHistory;
};