import React from 'react';

const categories = [
  { name: 'Insumos generales', icon: '/icons/consumables.png' },
  { name: 'Operatoria', icon: '/icons/equipment.png' },
  { name: 'Ortodoncia', icon: '/icons/supplies.png' },
  { name: 'Rehabilitacion', icon: '/icons/supplies.png' },
  { name: 'Implantología', icon: '/icons/implant.png' },
  { name: 'Periodoncia', icon: '/icons/supplies.png' },
  { name: 'Cirugía', icon: '/icons/supplies.png' },
];

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategoryChange }) => (
  <div className="bg-white rounded shadow p-4 mb-6">
    <h2 className="text-lg font-semibold mb-2">Filter by Category</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {categories.map(category => (
        <div key={category.name} className="text-center">
          <img 
            src={category.icon} 
            alt={category.name} 
            className="w-12 h-12 mx-auto cursor-pointer" 
            onClick={() => onCategoryChange(category.name)}
          />
          <p className="text-sm">{category.name}</p>
        </div>
      ))}
    </div>
  </div>
);