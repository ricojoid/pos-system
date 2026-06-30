import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiGrid,
  FiList,
  FiTrendingUp,
  FiCheckSquare
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Pengguna', path: '/admin/users', icon: FiUsers },
    { name: 'Kategori', path: '/admin/categories', icon: FiList },
    { name: 'Persetujuan Toko', path: '/admin/approvals', icon: FiCheckSquare },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: FiGrid },
    { name: 'Produk Saya', path: '/seller/products', icon: FiShoppingBag },
    { name: 'Pesanan', path: '/seller/orders', icon: FiList },
    { name: 'Laporan', path: '/seller/reports', icon: FiTrendingUp },
    { name: 'Pengaturan Toko', path: '/seller/settings', icon: FiSettings },
  ];

  const links = role === 'Admin' ? adminLinks : sellerLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <FiShoppingBag size={20} />
        </div>
        <span className="logo-text text-xl font-bold tracking-tight text-slate-900">Tokoku</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.path} 
            to={link.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <link.icon className="sidebar-link-icon" />
            <span className="sidebar-link-text">{link.name}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
