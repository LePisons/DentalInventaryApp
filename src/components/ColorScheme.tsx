import React from 'react';

const ColorScheme: React.FC = () => {
  const colors = {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {Object.entries(colors).map(([name, color]) => (
        <div key={name} className="text-center">
          <div 
            className="w-20 h-20 mx-auto mb-2 rounded shadow-md" 
            style={{ backgroundColor: color }}
          ></div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-600">{color}</p>
        </div>
      ))}
    </div>
  );
};

export default ColorScheme;