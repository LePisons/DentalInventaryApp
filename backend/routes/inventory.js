const express = require('express');
const router = express.Router();
const { sequelize, InventoryItem, InventoryHistory } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { Op } = require('sequelize');



// Obtener todos los ítems con opciones de búsqueda y filtrado
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
    res.status(500).json({ error: error.message });
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

// Crear un nuevo ítem
router.post('/', async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    await InventoryHistory.create({ itemId: item.id, action: 'created', quantity: item.quantity });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk delete inventory items using POST
router.post('/bulk-delete', async (req, res) => {
  const { ids } = req.body;

  try {
    await InventoryItem.destroy({ where: { id: ids } });
    res.status(200).json({ message: 'Bulk delete successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const updatedItem = await item.update(req.body);
    await InventoryHistory.create({ 
      itemId: item.id, 
      action: 'updated', 
      quantity: updatedItem.quantity,
      lowStockThreshold: updatedItem.lowStockThreshold
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un ítem
router.delete('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.destroy();
    await InventoryHistory.create({ itemId: item.id, action: 'deleted', quantity: 0 });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk import inventory items from CSV using multer
router.post('/bulk-import', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await InventoryItem.bulkCreate(results);
        res.status(200).json({ message: 'Bulk import successful' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
      }
    });
});

// Bulk update inventory items
router.post('/bulk-update', async (req, res) => {
  const { items, bulkUpdateField, bulkUpdateValue } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty items array' });
  }

  try {
    const updatePromises = items.map(id => 
      InventoryItem.update({ [bulkUpdateField]: bulkUpdateValue }, { where: { id } })
    );

    await Promise.all(updatePromises);

    // Log the update in InventoryHistory
    await Promise.all(items.map(id => 
      InventoryHistory.create({ 
        itemId: id, 
        action: 'bulk_updated', 
        quantity: bulkUpdateField === 'quantity' ? bulkUpdateValue : 0,
        lowStockThreshold: items.lowStockThreshold 
      })
    ));

    res.status(200).json({ message: 'Bulk update successful' });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Bulk update failed', details: error.message });
  }
});

// New route to get the last 10 actions
router.get('/history/last10', async (req, res) => {
  try {
    const history = await InventoryHistory.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(history);
  } catch (error) {
    console.error('Error fetching last 10 actions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
