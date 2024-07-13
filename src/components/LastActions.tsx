import React from 'react';
import { HistoryRecord } from '../types';

interface LastActionsProps {
  lastActions: HistoryRecord[];
}

export const LastActions: React.FC<LastActionsProps> = ({ lastActions }) => (
  <div className="bg-white p-4 rounded shadow h-full overflow-auto">
    <h2 className="text-lg font-semibold text-gray-700 mb-3">Ultimas acciones</h2>
    {lastActions.length > 0 ? (
      <ul className="space-y-2">
        {lastActions.slice(0, 20).map((action, index) => (  // Showing 7 actions instead of 10
          <li key={index} className="bg-gray-50 p-2 rounded text-sm">
            <span className="font-medium">{action.action}</span>
            <span className="mx-1">-</span>
            <span className="text-blue-600">{action.itemName}</span>
            <span className="mx-1">-</span>
            <span>Quantity: {action.quantity}</span>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(action.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No recent actions recorded.</p>
    )}
  </div>
);