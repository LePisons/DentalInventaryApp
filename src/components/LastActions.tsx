import React from 'react';
import { HistoryRecord } from '../types';

interface LastActionsProps {
  lastActions: HistoryRecord[];
}

export const LastActions: React.FC<LastActionsProps> = ({ lastActions }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-sm font-medium text-gray-500 mb-2">Last 10 Actions</h2>
    <ul className="text-sm">
      {lastActions.map((action, index) => (
        <li key={index} className="mb-1">
          {action.action} - Item ID: {action.itemId} - Quantity: {action.quantity} - {new Date(action.createdAt).toLocaleString()}
        </li>
      ))}
    </ul>
  </div>
);