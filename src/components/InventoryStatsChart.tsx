import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { InventoryItem } from '../types';

interface InventoryStatsChartProps {
  inventoryItems: InventoryItem[];
}

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="end" 
        fill="#666" 
        transform="rotate(-45)"
        style={{ fontSize: '12px' }}
      >
        {payload.value}
      </text>
    </g>
  );
};

// Explicitly set props to silence warnings
const CustomXAxis = (props: any) => <XAxis {...props} />;
const CustomYAxis = (props: any) => <YAxis {...props} />;

export const InventoryStatsChart: React.FC<InventoryStatsChartProps> = ({ inventoryItems }) => {
  const chartData = Object.entries(
    inventoryItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, quantity]) => ({ category, quantity }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <CustomXAxis 
            dataKey="category"
            interval={0}
            tick={<CustomXAxisTick />}
            height={60}
          />
          <CustomYAxis
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryStatsChart;