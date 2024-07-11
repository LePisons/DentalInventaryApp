'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('InventoryHistories', {
      fields: ['itemId'],
      type: 'foreign key',
      name: 'fk_inventoryhistory_inventoryitem',
      references: {
        table: 'InventoryItems',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('InventoryHistories', 'fk_inventoryhistory_inventoryitem');
  }
};