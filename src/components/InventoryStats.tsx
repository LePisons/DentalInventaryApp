import React from 'react';
import { InventoryItem } from '../types';

interface InventoryStatsProps {
  inventoryItems: InventoryItem[];
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ inventoryItems }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-sm font-medium text-gray-500">Items Totales</h2>
      <p className="text-2xl font-bold">{inventoryItems.length}</p>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-sm font-medium text-gray-500">Bajo Inventario</h2>
      <p className="text-2xl font-bold">
        {inventoryItems.filter(item => item.quantity <= item.lowStockThreshold).length}
      </p>
    </div>
  </>
);