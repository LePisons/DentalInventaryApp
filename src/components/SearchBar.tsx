import React from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => (
  <div className="bg-white rounded shadow p-4 mb-6">
    <h2 className="text-lg font-semibold mb-2">Search Items</h2>
    <input
      className="border p-2 rounded w-full"
      placeholder="Search"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);