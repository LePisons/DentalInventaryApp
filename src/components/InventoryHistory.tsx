import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HistoryRecord } from '../types';

const InventoryHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/inventory/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="inventory-history">
      <h2 className="text-2xl font-bold mb-4">Historial de Inventario</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{record.id}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{record.itemId}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{record.action}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{record.quantity}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{new Date(record.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryHistory;