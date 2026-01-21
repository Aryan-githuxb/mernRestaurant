import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout, toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        AestheticEats
      </Link>

      <div className="nav-container">
        {user && (
          <span className="nav-user-span">
            Hi, {user.name}
          </span>
        )}

        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/orders" onClick={closeMenu}>Orders</Link>
              <Link to="/cart" onClick={closeMenu}>Cart</Link>
              {user.isAdmin && (
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              )}
              <button 
                className="logout-btn"
                onClick={() => { logout(); closeMenu(); }} 
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/signup" onClick={closeMenu}>Signup</Link>
            </>
          )}
          
          <button 
            className="theme-toggle"
            onClick={() => { toggleDarkMode(); closeMenu(); }}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;