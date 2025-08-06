import React, { useState, useContext } from 'react';
import { Search, ShoppingCart, Home, User } from 'lucide-react';
import '../css/ShopHeader.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext'; // Adjust path if needed

const ShopHeader = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { accessToken } = useContext(UserContext);

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <header className="shop-header">
      <div className="shop-header-container">
        <div className="shop-header-content">

          <button onClick={navigateToHome} className="home-button" aria-label="Home">
            <Home size={20} />
          </button>

          <div className="search-wrapper">
            <div className="search-container">
              <input
                type="text"
                placeholder="Хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon-wrapper">
                <Search size={16} />
              </div>
            </div>
          </div>

          <div className="buttons-container">
            <button onClick={navigateToCart} className="cart-button" aria-label="Shopping Cart">
              <ShoppingCart size={18} />
              <span>Сагс</span>
            </button>

            {/* Conditionally render Login button if user is NOT logged in */}
            {!accessToken && (
              <button onClick={navigateToLogin} className="login-button" aria-label="Login">
                <User size={18} />
                <span>Нэвтрэх</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
