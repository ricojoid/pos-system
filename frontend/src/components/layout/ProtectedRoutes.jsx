import React from 'react';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import './DashboardLayout.css';
import '../layout/Navbar.css'; // Import Navbar CSS for user-menu styling

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="btn-spinner loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'Seller') return <Navigate to="/seller/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const DashboardLayout = ({ role }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`dashboard-sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar role={role} />
      </div>
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button 
              className="mobile-sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>
            <h1 className="dashboard-title">{role} Dashboard</h1>
          </div>
          
          <div className="dashboard-header-right">
            <div className="user-menu z-50">
              <div className="user-avatar bg-emerald-100 text-emerald-600 border-emerald-200">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="User" />
                ) : (
                  <span className="font-bold text-lg">{user?.fullName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="user-name text-slate-900">{user?.fullName || 'User'}</p>
                  <p className="user-role text-slate-500">{user?.role || role}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/" className="dropdown-item">Kembali ke Beranda</Link>
                <Link to="/profile" className="dropdown-item">Profil Saya</Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="dashboard-content">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
