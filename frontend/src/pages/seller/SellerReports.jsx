import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiPieChart } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import '../admin/AdminPages.css';

const SellerReports = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/seller');
        setStats(response.data);
      } catch (error) {
        toast.error('Gagal memuat laporan penjualan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="btn-spinner inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Menyusun laporan...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Laporan Penjualan</h2>
        <p className="admin-subtitle">Detail performa dan riwayat pendapatan toko</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="stat-card stat-emerald lg:col-span-1">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiDollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Pendapatan Bersih</p>
              <h3 className="stat-value">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card stat-purple lg:col-span-1">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiPieChart size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Pesanan Sukses</p>
              <h3 className="stat-value">{stats.totalOrders - stats.pendingOrders}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-blue lg:col-span-1">
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <FiTrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Rata-rata Pendapatan / Pesanan</p>
              <h3 className="stat-value text-xl">
                Rp {stats.totalOrders > 0 
                  ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('id-ID') 
                  : 0}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <FiTrendingUp className="mr-2 text-emerald-600" /> Rincian Pendapatan 6 Bulan Terakhir
        </h3>
        
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Periode / Bulan</th>
                <th className="text-right">Jumlah Pesanan</th>
                <th className="text-right">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {stats.revenueChart && stats.revenueChart.length > 0 ? (
                stats.revenueChart.map((data, index) => (
                  <tr key={index}>
                    <td className="font-semibold text-gray-700">{data.period}</td>
                    <td className="text-right">{data.orders} pesanan</td>
                    <td className="text-right font-bold text-emerald-400">
                      Rp {data.revenue.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-8">
                    Belum ada data pendapatan untuk 6 bulan terakhir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SellerReports;
