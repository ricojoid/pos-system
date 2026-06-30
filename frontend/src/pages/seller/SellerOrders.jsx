import React, { useState, useEffect } from 'react';
import { FiList, FiCheckCircle, FiClock, FiTruck, FiXCircle, FiMoreVertical } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import '../admin/AdminPages.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/order/seller-orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Gagal memuat daftar pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/order/${orderId}/status`, { status: newStatus });
      toast.success(`Status pesanan diperbarui menjadi ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Gagal memperbarui status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge variant="warning" className="flex items-center gap-1"><FiClock /> Menunggu Proses</Badge>;
      case 'Processing': return <Badge variant="primary" className="flex items-center gap-1">Diproses</Badge>;
      case 'Shipped': return <Badge variant="secondary" className="flex items-center gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30"><FiTruck /> Dikirim</Badge>;
      case 'Completed': return <Badge variant="success" className="flex items-center gap-1"><FiCheckCircle /> Selesai</Badge>;
      case 'Cancelled': return <Badge variant="danger" className="flex items-center gap-1"><FiXCircle /> Dibatalkan</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Manajemen Pesanan</h2>
        <p className="admin-subtitle">Kelola pesanan masuk dan perbarui status pengiriman</p>
      </div>

      <Card className="p-0 overflow-hidden border-gray-200/60">
        <div className="p-4 border-b border-gray-200 bg-white/30 flex justify-between items-center">
          <div className="flex items-center text-gray-700">
            <FiList className="mr-2" />
            <h3 className="font-bold">Daftar Pesanan ({orders.length})</h3>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="btn-spinner inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Memuat data...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FiList size={48} className="mx-auto mb-4 opacity-50" />
            <p>Belum ada pesanan masuk</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No. Order</th>
                  <th>Tanggal</th>
                  <th>Pembeli & Alamat</th>
                  <th>Produk</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-mono text-sm">#ORD-{order.id.toString().padStart(5, '0')}</span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <div className="font-bold text-gray-700">{order.buyerName}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={order.shippingAddress}>
                        {order.shippingAddress}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {order.items.map(item => (
                          <div key={item.id} className="text-gray-700 mb-1">
                            {item.quantity}x <span className="truncate max-w-[150px] inline-block align-bottom" title={item.productName}>{item.productName}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="font-bold text-emerald-400">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <select
                        className="bg-white border border-gray-200 text-sm rounded px-2 py-1 outline-none focus:border-blue-500 disabled:opacity-50"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id || order.status === 'Completed' || order.status === 'Cancelled'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Proses</option>
                        <option value="Shipped">Kirim</option>
                        <option value="Completed" disabled>Selesai</option>
                        <option value="Cancelled">Batalkan</option>
                      </select>
                      {updatingId === order.id && <span className="ml-2 text-xs text-emerald-600">Updating...</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SellerOrders;
