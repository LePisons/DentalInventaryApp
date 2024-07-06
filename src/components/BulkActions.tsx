import React, { useState } from 'react';
import axios from 'axios';
import { InventoryItem } from '../types';

interface BulkActionsProps {
  selectedItems: number[];
  onBulkAction: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({ selectedItems, onBulkAction }) => {
  const [bulkUpdateField, setBulkUpdateField] = useState<keyof InventoryItem>('category');
  const [bulkUpdateValue, setBulkUpdateValue] = useState<string | number>('');

  const handleBulkDelete = async () => {
    try {
      await axios.post('http://localhost:3001/api/inventory/bulk-delete', {
        ids: selectedItems
      });
      onBulkAction();
      alert('Acción múltiple exitosa');
    } catch (error) {
      console.error('Error during bulk delete:', error);
      alert('Borrado fallido');
    }
  };

  const handleBulkUpdate = async () => {
    try {
      await axios.post('http://localhost:3001/api/inventory/bulk-update', {
        items: selectedItems,
        bulkUpdateField,
        bulkUpdateValue
      });
      onBulkAction();
      alert('Acción múltiple exitosa');
    } catch (error) {
      console.error('Error during bulk update:', error);
      alert('Actualización fallida');
    }
  };

  return (
    <div className="w-2/3 bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Acción Múltiple</h2>
      <div className="flex flex-wrap items-center">
        <button onClick={handleBulkDelete} className="mr-2 mb-2 bg-red-500 text-white px-4 py-2 rounded">
          Borrado multiple 
        </button>
        <button onClick={handleBulkUpdate} className="mr-2 mb-2 bg-blue-500 text-white px-4 py-2 rounded">
          Bulk Update
        </button>
        <select
          className="mr-2 mb-2 border p-2 rounded"
          value={bulkUpdateField}
          onChange={(e) => setBulkUpdateField(e.target.value as keyof InventoryItem)}
        >
          <option value="category">Category</option>
          <option value="quantity">Quantity</option>
          <option value="unit">Unit</option>
          <option value="lowStockThreshold">Low Stock Threshold</option>
        </select>
        <input
          className="mb-2 border p-2 rounded"
          placeholder="New Value"
          value={bulkUpdateValue}
          onChange={(e) => setBulkUpdateValue(e.target.value)}
        />
      </div>
    </div>
  );
};