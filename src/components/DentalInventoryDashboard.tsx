import React, { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { InventoryStats } from './InventoryStats';
import { LastActions } from './LastActions';
import { BulkActions } from './BulkActions';
import { AddNewItem } from './AddNewItem';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { InventoryTable } from './InventoryTable';
import { InventoryItem, HistoryRecord } from '../types';
import InventoryStatsChart from './InventoryStatsChart';
import BulkImport from './BulkImport';
import StockLevelOverview from './StockLevelOverview';

const API_URL = process.env.REACT_APP_API_URL;

const DentalInventoryDashboard: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [lastActions, setLastActions] = useState<HistoryRecord[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventoryItems();
    fetchLastActions();
  }, [categoryFilter, searchTerm]);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory`, {
        params: { category: categoryFilter, search: searchTerm }
      });
      setInventoryItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      setError('Failed to fetch inventory items. Please check your connection and try again.');
    }
  };

  const fetchLastActions = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory/history/last10`);
      setLastActions(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching last actions:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || error.message);
      } else {
        setError('An unexpected error occurred while fetching recent actions.');
      }
    }
  };

  const handleItemUpdate = (updatedItem: InventoryItem) => {
    setInventoryItems(items => items.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleItemDelete = (deletedItemId: number) => {
    setInventoryItems(items => items.filter(item => item.id !== deletedItemId));
  };

  const handleBulkAction = () => {
    fetchInventoryItems();
    setSelectedItems([]);
    fetchLastActions();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">
        Inventario Clínica Newen 2024
      </h1>

      {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )}

<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
  
  <div className="xl:col-span-2 space-y-6">
    
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventario por Categoría</h2>
      <InventoryStatsChart inventoryItems={inventoryItems} />
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Stock Level Overview</h2>
      <StockLevelOverview inventoryItems={inventoryItems} />
    </div>
    
  </div>

  <div className="bg-white rounded-lg shadow-md p-6 flex-grow">
      <div className="h-[calc(100%-2rem)] overflow-auto">
        <LastActions lastActions={lastActions} />
      </div>
    </div>
    </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <BulkActions
              selectedItems={selectedItems}
              onBulkAction={handleBulkAction}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <BulkImport />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
          <CategoryFilter onCategoryChange={setCategoryFilter} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AddNewItem onItemAdded={fetchInventoryItems} />
        </div>

        <InventoryTable
          inventoryItems={inventoryItems}
          selectedItems={selectedItems}
          onSelectItem={setSelectedItems}
          onUpdateItem={handleItemUpdate}
          onDeleteItem={handleItemDelete}
        />
      </div>
    </div>
  );
};

export default DentalInventoryDashboard;