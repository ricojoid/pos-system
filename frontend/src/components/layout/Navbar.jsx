import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut,
  FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import './Navbar.css';

const Navbar = ({ toggleCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  
  const cartItemsCount = cartCount;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="w-full px-4 md:px-8 navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <FiShoppingBag size={24} />
          </div>
          <span className="logo-text text-2xl font-bold tracking-tight text-slate-900">Tokoku</span>
        </Link>

        {/* Desktop Search */}
        <div className="navbar-search hidden-mobile">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="search-input"
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions hidden-mobile">
          {isAuthenticated ? (
            <>
              <button className="cart-btn" onClick={openCart}>
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <Badge variant="danger" className="cart-badge">
                    {cartItemsCount}
                  </Badge>
                )}
              </button>
              <div className="user-menu">
                <div className="user-avatar">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User" />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">{user?.fullName || 'User'}</p>
                    <p className="user-role">{user?.role || 'Buyer'}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  {user?.role === 'Admin' && (
                    <Link to="/admin/dashboard" className="dropdown-item">Admin Dashboard</Link>
                  )}
                  {user?.role === 'Seller' && (
                    <Link to="/seller/dashboard" className="dropdown-item">Seller Dashboard</Link>
                  )}
                  {user?.role === 'Buyer' && (
                    <Link to="/become-seller" className="dropdown-item">Buka Toko</Link>
                  )}
                  <Link to="/profile" className="dropdown-item">Profil Saya</Link>
                  <Link to="/buyer/orders" className="dropdown-item">Pesanan Saya</Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="p-4 border-b border-gray-100">
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                className="search-input"
              />
            </div>
          </div>
          
          <div className="mobile-menu-links">
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
            <Link to="/products" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Produk</Link>
            
            {isAuthenticated ? (
              <>
                <div className="mobile-divider"></div>
                {user?.role === 'Admin' && (
                  <Link to="/admin/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                {user?.role === 'Seller' && (
                  <Link to="/seller/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Seller Dashboard</Link>
                )}
                <Link to="/profile" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Profil Saya</Link>
                <Link to="/buyer/orders" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Pesanan Saya</Link>
                <button 
                  className="mobile-link" 
                  onClick={() => {
                    openCart();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Keranjang ({cartItemsCount})
                </button>
                <button className="mobile-link text-danger" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <div className="mobile-divider"></div>
                <Link to="/login" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="mobile-link text-accent-blue" onClick={() => setIsMobileMenuOpen(false)}>Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
