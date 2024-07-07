import React, { useState } from 'react';
import axios from 'axios';
import { InventoryItem } from '../types';

interface InventoryTableProps {
  inventoryItems: InventoryItem[];
  selectedItems: number[];
  onSelectItem: (items: number[]) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: number) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventoryItems,
  selectedItems,
  onSelectItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortField, setSortField] = useState<keyof InventoryItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const filteredAndSortedItems = [...inventoryItems]
    .filter(item => filterCategory === '' || item.category === filterCategory)
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof InventoryItem) => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value);
  };

  const handleSelectItem = (id: number) => {
    onSelectItem(
      selectedItems.includes(id)
        ? selectedItems.filter(item => item !== id)
        : [...selectedItems, id]
    );
  };

  const handleUpdateItem = async (id: number, field: keyof InventoryItem, value: string | number) => {
    try {
      const item = inventoryItems.find(item => item.id === id);
      if (!item) return;
  
      const updatedItem = { ...item, [field]: value };
      const response = await axios.put(`http://localhost:3001/api/inventory/${id}`, updatedItem);
      onUpdateItem(response.data);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/inventory/${id}`);
      onDeleteItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const adjustStock = async (id: number, amount: number) => {
    const item = inventoryItems.find(item => item.id === id);
    if (item) {
      await handleUpdateItem(id, 'quantity', item.quantity + amount);
    }
  };

  return (
    <div className="bg-white rounded shadow">
      <h2 className="text-lg font-semibold p-4 border-b">Inventory List</h2>
      <div className="mb-4 p-4">
        <label htmlFor="category-filter" className="mr-2">Filtrar por categoria:</label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={handleFilterChange}
          className="border rounded p-1"
        >
          <option value="">Todas las Categorias</option>
          {Array.from(new Set(inventoryItems.map(item => item.category))).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
            <th 
              onClick={() => handleSort('name')} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th 
              onClick={() => handleSort('category')} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Category {sortField === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th 
              onClick={() => handleSort('quantity')} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th 
              onClick={() => handleSort('lowStockThreshold')} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Low Stock Threshold {sortField === 'lowStockThreshold' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAndSortedItems.map((item) => (
            <tr key={item.id} 
            className={`${item.quantity <= item.lowStockThreshold ? 'bg-red-200' : ''} hover:bg-gray-100 transition-colors duration-200`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  className="border p-1 rounded"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  className="border p-1 rounded"
                  value={item.category}
                  onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="mr-2 px-2 py-1 bg-red-500 text-white rounded" onClick={() => adjustStock(item.id, -1)}>-</button>
                {item.quantity} {item.unit}
                <button className="ml-2 px-2 py-1 bg-green-500 text-white rounded" onClick={() => adjustStock(item.id, 1)}>+</button>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <input
                  className="border p-1 rounded w-20"
                  type="number"
                  value={item.lowStockThreshold}
                  onChange={(e) => handleUpdateItem(item.id, 'lowStockThreshold', parseInt(e.target.value))}
                  onBlur={(e) => handleUpdateItem(item.id, 'lowStockThreshold', parseInt(e.target.value))}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.quantity <= item.lowStockThreshold ? (
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Low Stock
                </span>
                 ) : item.quantity <= item.lowStockThreshold * 1.5 ? (
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Medium Stock
                </span>
                ) : (
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                In Stock
                </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;