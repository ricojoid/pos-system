import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiList, FiDollarSign, FiClock } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import api from '../../services/api';
import '../admin/AdminPages.css'; // Reusing the same CSS for grid and cards

const SellerDashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    revenueChart: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/seller');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load seller dashboard', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Toko</h2>
        <p className="text-sm text-slate-500 mt-1">Ringkasan performa dan penjualan toko Anda</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <FiShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Produk</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalProducts}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Pendapatan</p>
            <h3 className="text-2xl font-bold text-slate-900">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <FiList size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Pesanan</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalOrders}</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pesanan Menunggu</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</h3>
          </div>
        </div>

      </div>
      
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Grafik Pendapatan (6 Bulan Terakhir)</h3>
        {stats.revenueChart && stats.revenueChart.length > 0 ? (
          <div className="flex items-end space-x-4 h-72 mt-4 px-2">
            {stats.revenueChart.map((data, index) => {
              const maxRevenue = Math.max(...stats.revenueChart.map(d => d.revenue)) || 1;
              const height = `${(data.revenue / maxRevenue) * 100}%`;
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full max-w-[60px] bg-emerald-500 rounded-t-md transition-all duration-300 hover:bg-emerald-400 relative group cursor-pointer" style={{ height: height || '5%' }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap z-10 transition-opacity shadow-md">
                      Rp {data.revenue.toLocaleString('id-ID')}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-4 whitespace-nowrap">{data.period}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <FiDollarSign size={32} className="mb-2 text-slate-300" />
            <p>Belum ada data pendapatan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardOverview;
