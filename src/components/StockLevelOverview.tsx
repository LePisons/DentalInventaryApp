// src/components/StockLevelOverview.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { InventoryItem } from '../types';

interface StockLevelOverviewProps {
  inventoryItems: InventoryItem[];
}

const StockLevelOverview: React.FC<StockLevelOverviewProps> = ({ inventoryItems }) => {
  const sortedItems = [...inventoryItems]
    .sort((a, b) => (b.quantity / b.lowStockThreshold) - (a.quantity / a.lowStockThreshold))
    .slice(0, 8);  // Get top 8 items

  const data = sortedItems.map(item => ({
    name: item.name,
    Current: item.quantity,
    Threshold: item.lowStockThreshold
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Current" fill="#8884d8" />
          <Bar dataKey="Threshold" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevelOverview;