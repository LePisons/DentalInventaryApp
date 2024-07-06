import React, { useState, useEffect } from 'react';
import DentalInventoryDashboard from './components/DentalInventoryDashboard';
import Login from './components/Login';
import { verifyToken } from './auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = verifyToken(token);
      if (user) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
          <DentalInventoryDashboard />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;