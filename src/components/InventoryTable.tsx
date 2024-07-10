import React, { useState } from 'react';
import axios from 'axios';
import { InventoryItem } from '../types';
import { ChevronUpIcon, ChevronDownIcon, PlusIcon, MinusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

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
  const [editingItem, setEditingItem] = useState<number | null>(null);
  
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
      setEditingItem(null);
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

  const renderSortIcon = (field: keyof InventoryItem) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline" /> : <ChevronDownIcon className="w-4 h-4 inline" />;
  };

  const getStatusBadge = (item: InventoryItem) => {
    if (item.quantity <= item.lowStockThreshold) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Low Stock</span>;
    } else if (item.quantity <= item.lowStockThreshold * 1.5) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium Stock</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Inventory List
        </h3>
        <div className="mt-1 sm:flex sm:items-center">
          <div className="max-w-xs w-full">
            <label htmlFor="category-filter" className="sr-only">Filter by category</label>
            <select
              id="category-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterCategory}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {Array.from(new Set(inventoryItems.map(item => item.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        onChange={() => {
                          const allIds = filteredAndSortedItems.map(item => item.id);
                          onSelectItem(selectedItems.length === allIds.length ? [] : allIds);
                        }}
                        checked={selectedItems.length === filteredAndSortedItems.length}
                      />
                    </th>
                    {['name', 'category', 'quantity', 'lowStockThreshold'].map((field) => (
                      <th
                        key={field}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort(field as keyof InventoryItem)}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {renderSortIcon(field as keyof InventoryItem)}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem === item.id ? (
                          <input
                            className="border rounded px-2 py-1 w-full"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            onBlur={() => setEditingItem(null)}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem === item.id ? (
                          <input
                            className="border rounded px-2 py-1 w-full"
                            value={item.category}
                            onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                            onBlur={() => setEditingItem(null)}
                          />
                        ) : (
                          <div className="text-sm text-gray-500">{item.category}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <button
                            className="p-1 rounded-full text-red-600 hover:bg-red-100"
                            onClick={() => adjustStock(item.id, -1)}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="p-1 rounded-full text-green-600 hover:bg-green-100"
                            onClick={() => adjustStock(item.id, 1)}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem === item.id ? (
                          <input
                            className="border rounded px-2 py-1 w-20"
                            type="number"
                            value={item.lowStockThreshold}
                            onChange={(e) => handleUpdateItem(item.id, 'lowStockThreshold', parseInt(e.target.value))}
                            onBlur={() => setEditingItem(null)}
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{item.lowStockThreshold}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          onClick={() => setEditingItem(item.id)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;