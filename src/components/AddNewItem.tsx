import React, { useState } from 'react';
import axios from 'axios';
import { InventoryItem } from '../types';

interface AddNewItemProps {
  onItemAdded: () => void;
}

export const AddNewItem: React.FC<AddNewItemProps> = ({ onItemAdded }) => {
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    lowStockThreshold: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'lowStockThreshold' ? parseInt(value) || 0 : value 
    }));
  };

  const handleAddItem = async () => {
    try {
      console.log('Sending new item data:', newItem); // Add this line
      const response = await axios.post('http://localhost:3001/api/inventory', newItem);
      console.log('New item added:', response.data);
      setNewItem({ name: '', category: '', quantity: 0, unit: '', lowStockThreshold: 0 });
      onItemAdded();
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  return (
    <div className="bg-light rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          name="category"
          value={newItem.category}
          onChange={handleInputChange}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="Unit"
          name="unit"
          value={newItem.unit}
          onChange={handleInputChange}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Low Stock Threshold"
          name="lowStockThreshold"
          value={newItem.lowStockThreshold}
          onChange={handleInputChange}
        />
      </div>
      <button 
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddItem}
      >
        Add Item
      </button>
    </div>
  );
};