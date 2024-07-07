import React, { useState } from 'react';
import axios from 'axios';

const BulkImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3001/api/inventory/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Bulk import successful');
    } catch (error) {
      console.error('Error during bulk import:', error);
      alert('Bulk import failed');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md ml-0 mt-8">
      <h2 className="text-1xl font-bold mb-4 text-gray-800">Import from CSV</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
      >
        Upload CSV
      </button>
    </div>
  );
};

export default BulkImport;