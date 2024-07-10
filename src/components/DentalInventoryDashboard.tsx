import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InventoryStats } from './InventoryStats';
import { LastActions } from './LastActions';
import { BulkActions } from './BulkActions';
import { AddNewItem } from './AddNewItem';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { InventoryTable } from './InventoryTable';
import { InventoryItem, HistoryRecord } from '../types';
import InventoryStatsChart from './InventoryStatsChart';
import BulkImport from './BulkImport'; // Add this import
import ColorScheme from './ColorScheme'


const DentalInventoryDashboard: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [lastActions, setLastActions] = useState<HistoryRecord[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    fetchInventoryItems();
    fetchLastActions();
  }, [categoryFilter, searchTerm]);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/inventory', {
        params: { category: categoryFilter, search: searchTerm }
      });
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const fetchLastActions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/inventory/history/last10');
      setLastActions(response.data);
    } catch (error) {
      console.error('Error fetching last actions:', error);
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
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">
          Inventario Clínica Newen 2024
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <InventoryStatsChart inventoryItems={inventoryItems} />
          </div>
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            <InventoryStats inventoryItems={inventoryItems} />
            <LastActions lastActions={lastActions} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <CategoryFilter onCategoryChange={setCategoryFilter} />
          <SearchBar onSearch={setSearchTerm} />
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