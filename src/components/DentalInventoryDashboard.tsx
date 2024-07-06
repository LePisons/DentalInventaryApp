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
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6 p-4 bg-blue-100 border-2 border-blue-500 shadow-lg rounded-lg">
        Inventario Clínica Newen 2024
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
        <InventoryStats inventoryItems={inventoryItems} />
        <LastActions lastActions={lastActions} />
      </div>

      <div className="mb-10">
  <h2 className="text-xl font-bold mb-4">Inventario por categoria</h2>
  <InventoryStatsChart inventoryItems={inventoryItems} />
</div>

      <div className="flex items-start space-x-4 mb-6">
        <BulkActions
          selectedItems={selectedItems}
          onBulkAction={handleBulkAction}
        />
      </div>

      <AddNewItem onItemAdded={fetchInventoryItems} />

      <CategoryFilter onCategoryChange={setCategoryFilter} />

      <SearchBar onSearch={setSearchTerm} />

      <InventoryTable
        inventoryItems={inventoryItems}
        selectedItems={selectedItems}
        onSelectItem={setSelectedItems}
        onUpdateItem={handleItemUpdate}
        onDeleteItem={handleItemDelete}
      />
    </div>
  );
};

export default DentalInventoryDashboard;