import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import api from '../../services/api';
import './AdminPages.css';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        const data = response.data;
        
        setStats({
          totalUsers: data.totalUsers || 0,
          totalStores: data.totalSellers || 0,
          pendingRequests: data.pendingSellerRequests || 0,
          totalRevenue: data.totalRevenue || 0
        });
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Ringkasan Sistem</h2>
        <p className="admin-subtitle">Pantau performa dan metrik utama aplikasi POS Anda</p>
      </div>

      <div className="admin-stats-grid">
        <Card className="stat-card stat-blue">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiUsers size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Pengguna</p>
              <h3 className="stat-value">{stats.totalUsers}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-emerald">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Toko Aktif</p>
              <h3 className="stat-value">{stats.totalStores}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-amber">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiActivity size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Permintaan Toko</p>
              <h3 className="stat-value">{stats.pendingRequests}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-purple">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiDollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Estimasi GMV</p>
              <h3 className="stat-value">Rp {(stats.totalRevenue).toLocaleString('id-ID')}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="admin-chart-placeholder">
        <div className="chart-empty-state">
          <FiActivity size={48} className="chart-icon" />
          <p>Grafik Penjualan akan tampil di sini</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
