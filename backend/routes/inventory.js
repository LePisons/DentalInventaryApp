const express = require('express');
const router = express.Router();
const { sequelize, InventoryItem, InventoryHistory } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { Op } = require('sequelize');

// Get all items with search and filter options
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.name = {
      [Op.like]: `%${search}%`
    };
  }

  try {
    const items = await InventoryItem.findAll({ where });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET route for inventory history
router.get('/history', async (req, res) => {
  try {
    const history = await InventoryHistory.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log('Received item data:', req.body);
    const item = await InventoryItem.create(req.body, { transaction: t });
    console.log('Created item:', item.toJSON());
    
    await InventoryHistory.create({
      itemId: item.id,
      itemName: item.name,
      action: 'created',
      quantity: item.quantity
    }, { transaction: t });

    await t.commit();
    res.status(201).json(item);
  } catch (error) {
    await t.rollback();
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk delete inventory items
router.post('/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  const t = await sequelize.transaction();

  try {
    const items = await InventoryItem.findAll({ where: { id: ids } });
    await InventoryItem.destroy({ where: { id: ids }, transaction: t });

    await Promise.all(items.map(item => 
      InventoryHistory.create({
        itemId: item.id,
        itemName: item.name,
        action: 'bulk_deleted',
        quantity: 0
      }, { transaction: t })
    ));

    await t.commit();
    res.status(200).json({ message: 'Bulk delete successful' });
  } catch (error) {
    await t.rollback();
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an item
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const item = await InventoryItem.findByPk(req.params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: 'Item not found' });
    }
    const updatedItem = await item.update(req.body, { transaction: t });
    await InventoryHistory.create({
      itemId: item.id,
      itemName: updatedItem.name,
      action: 'updated',
      quantity: updatedItem.quantity
    }, { transaction: t });

    await t.commit();
    res.status(200).json(updatedItem);
  } catch (error) {
    await t.rollback();
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const item = await InventoryItem.findByPk(req.params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.destroy({ transaction: t });
    await InventoryHistory.create({
      itemId: item.id,
      itemName: item.name,
      action: 'deleted',
      quantity: 0
    }, { transaction: t });

    await t.commit();
    res.status(204).end();
  } catch (error) {
    await t.rollback();
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk import inventory items from CSV
router.post('/bulk-import', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const results = [];
  const t = await sequelize.transaction();

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const createdItems = await InventoryItem.bulkCreate(results, { transaction: t });
        
        await Promise.all(createdItems.map(item => 
          InventoryHistory.create({
            itemId: item.id,
            itemName: item.name,
            action: 'bulk_imported',
            quantity: item.quantity
          }, { transaction: t })
        ));

        await t.commit();
        res.status(200).json({ message: 'Bulk import successful' });
      } catch (error) {
        await t.rollback();
        console.error('Bulk import error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
      }
    });
});

// Bulk update inventory items
router.post('/bulk-update', async (req, res) => {
  const { items, bulkUpdateField, bulkUpdateValue } = req.body;
  const t = await sequelize.transaction();
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty items array' });
  }

  try {
    const updatePromises = items.map(id => 
      InventoryItem.update({ [bulkUpdateField]: bulkUpdateValue }, { where: { id }, transaction: t })
    );

    await Promise.all(updatePromises);

    const updatedItems = await InventoryItem.findAll({ where: { id: items }, transaction: t });

    await Promise.all(updatedItems.map(item => 
      InventoryHistory.create({
        itemId: item.id,
        itemName: item.name,
        action: 'bulk_updated',
        quantity: bulkUpdateField === 'quantity' ? bulkUpdateValue : item.quantity
      }, { transaction: t })
    ));

    await t.commit();
    res.status(200).json({ message: 'Bulk update successful' });
  } catch (error) {
    await t.rollback();
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get the last 10 actions

router.get('/history/last10', async (req, res) => {
  try {
    const history = await InventoryHistory.findAll({
      include: [{
        model: InventoryItem,
        as: 'item',
        attributes: ['name'],
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const formattedHistory = history.map(record => ({
      id: record.id,
      itemName: record.item ? record.item.name : record.itemName,
      action: record.action,
      quantity: record.quantity,
      createdAt: record.createdAt
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Error fetching last 10 actions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;