import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminAddFood from './pages/AdminAddFood';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
  const [darkMode, setDarkMode] = useState(false);
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const showFlash = (msg, type = 'success') => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 3000);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      {flash && (
        <div className="flash-message" style={{ backgroundColor: flash.type === 'success' ? '#4CAF50' : '#f44336' }}>
          {flash.msg}
        </div>
      )}
      
      <Navbar user={user} logout={logout} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      
      <div className="main-content" style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home user={user} showFlash={showFlash} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart user={user} showFlash={showFlash} />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="/admin/orders" element={<AdminOrders user={user} showFlash={showFlash} />} />
          <Route path="/admin/add-food" element={<AdminAddFood user={user} showFlash={showFlash} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;