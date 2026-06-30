import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';

// Layouts
import Navbar from './components/layout/Navbar';
import { ProtectedRoute, DashboardLayout } from './components/layout/ProtectedRoutes';

// Public Pages
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import BecomeSeller from './pages/public/BecomeSeller';
import HomePage from './pages/public/HomePage';
import ProductsPage from './pages/public/ProductsPage';

import ProductDetailPage from './pages/public/ProductDetailPage';
import CheckoutPage from './pages/public/CheckoutPage';
import MyOrders from './pages/buyer/MyOrders';
import ProfilePage from './pages/buyer/ProfilePage';

// Admin Pages
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import UserManagement from './pages/admin/UserManagement';
import SellerApprovals from './pages/admin/SellerApprovals';

// Seller Pages
import SellerDashboardOverview from './pages/seller/SellerDashboardOverview';
import ProductManagement from './pages/seller/ProductManagement';
import SellerOrders from './pages/seller/SellerOrders';
import SellerReports from './pages/seller/SellerReports';
import SellerSettings from './pages/seller/SellerSettings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155'
            }
          }}/>
          
          <CartDrawer />

          <Routes>
            {/* Public Routes with Navbar */}
            <Route element={<><Navbar /><Outlet /></>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Routes (Any authenticated user) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<><Navbar /><Outlet /></>}>
                <Route path="/become-seller" element={<BecomeSeller />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/buyer/orders" element={<MyOrders />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<DashboardLayout role="Admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboardOverview />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/approvals" element={<SellerApprovals />} />
              <Route path="/admin/categories" element={<div>Manajemen Kategori (WIP)</div>} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Seller Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Seller']} />}>
            <Route element={<DashboardLayout role="Seller" />}>
              <Route path="/seller/dashboard" element={<SellerDashboardOverview />} />
              <Route path="/seller/products" element={<ProductManagement />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
              <Route path="/seller/reports" element={<SellerReports />} />
              <Route path="/seller/settings" element={<SellerSettings />} />
              <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

// Removed custom Outlet component, using the one imported from react-router-dom
export default App;
