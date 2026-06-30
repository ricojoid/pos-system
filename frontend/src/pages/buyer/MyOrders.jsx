import React, { useState, useEffect } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/order/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Gagal memuat pesanan", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await api.put(`/order/${orderId}/complete`);
      toast.success('Terima kasih! Pesanan telah diselesaikan.');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyelesaikan pesanan');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': 
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200"><FiClock /> Menunggu Proses</span>;
      case 'Processing': 
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200"><FiPackage /> Diproses</span>;
      case 'Shipped': 
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200"><FiTruck /> Dikirim</span>;
      case 'Completed': 
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200"><FiCheckCircle /> Selesai</span>;
      case 'Cancelled': 
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200"><FiXCircle /> Dibatalkan</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Pesanan</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau status pengiriman dan riwayat belanja Anda.</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FiPackage size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada pesanan</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Anda belum pernah melakukan transaksi. Mulai belanja sekarang dan temukan barang impian Anda.</p>
            <Button onClick={() => window.location.href='/products'} variant="primary" className="px-6">Mulai Belanja</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Order Header */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">No. Pesanan</span>
                      <span className="font-semibold text-slate-900">ORD-{order.id.toString().padStart(5, '0')}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div>
                      <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tanggal Pembelian</span>
                      <span className="font-medium text-slate-900">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-5">
                  <div className="space-y-5">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-20 h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <img src={`http://localhost:5018${item.productImage}`} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FiPackage size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate">{item.productName}</h4>
                          <p className="text-xs text-slate-500 mt-1">Penjual: {item.storeName}</p>
                          <p className="text-sm text-slate-600 mt-2">{item.quantity} barang x Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                          <p className="font-semibold text-slate-900">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-200 gap-4">
                  <div className="text-sm flex-1">
                    <p className="text-slate-500 mb-1 text-xs font-medium uppercase tracking-wider">Alamat Pengiriman</p>
                    <p className="text-slate-800 leading-relaxed line-clamp-2 max-w-lg">{order.shippingAddress}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Belanja</p>
                      <p className="text-lg font-bold text-emerald-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    </div>
                    {order.status === 'Shipped' && (
                      <Button 
                        variant="primary" 
                        onClick={() => handleCompleteOrder(order.id)}
                        className="w-full sm:w-auto shadow-sm"
                      >
                        Pesanan Diterima
                      </Button>
                    )}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
