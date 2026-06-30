import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiCreditCard, FiTruck } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Redirect if cart empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/products');
    }
  }, [cartItems, navigate, orderSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Mohon isi alamat pengiriman');
      return;
    }

    setIsSubmitting(true);
    try {
      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const res = await api.post('/order', {
        items,
        shippingAddress: address
      });

      setOrderId(res.data.orderId);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memproses pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="page-content py-20 flex justify-center items-center">
        <Card className="max-w-md w-full text-center p-10 border-emerald-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
          <p className="text-gray-500 mb-6">
            Terima kasih telah berbelanja. Pesanan Anda (ID: #{orderId}) akan segera diproses oleh penjual.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={() => navigate('/buyer/orders')}>
              Lihat Status Pesanan
            </Button>
            <Button variant="secondary" onClick={() => navigate('/products')}>
              Lanjut Belanja
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content py-10">
      <div className="container max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center border-b border-gray-200 pb-4">
                <FiMapPin className="mr-2 text-emerald-600" /> Alamat Pengiriman
              </h2>
              <form id="checkout-form" onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label className="form-label text-gray-700">Penerima</label>
                  <input 
                    type="text" 
                    className="input-field bg-white border-gray-200 w-full" 
                    value={user?.fullName || ''} 
                    disabled 
                  />
                  <p className="text-xs text-gray-500 mt-1">Sesuai data akun profil Anda</p>
                </div>
                <div className="form-group">
                  <label className="form-label text-gray-700">Alamat Lengkap *</label>
                  <textarea 
                    className="input-field bg-white border-gray-200 w-full min-h-[120px]" 
                    placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center border-b border-gray-200 pb-4">
                <FiCreditCard className="mr-2 text-emerald-400" /> Metode Pembayaran
              </h2>
              <div className="p-4 bg-white border border-emerald-500/30 rounded-lg flex items-start gap-4">
                <div className="mt-1">
                  <input type="radio" checked readOnly className="text-emerald-500 focus:ring-emerald-500 h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Cash on Delivery (COD) / Manual Transfer</h3>
                  <p className="text-sm text-gray-500 mt-1">Pembayaran diselesaikan langsung dengan kurir atau transfer manual sesuai instruksi penjual setelah pesanan dikonfirmasi.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border-gray-200">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 bg-white rounded flex-shrink-0">
                      {item.imageUrl && (
                        <img src={`http://localhost:5018${item.imageUrl}`} className="w-full h-full object-cover rounded" alt={item.name} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate" title={item.name}>{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1">
                        Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Produk</span>
                  <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span className="text-emerald-400">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-gray-200/50">
                  <span>Total Tagihan</span>
                  <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                variant="primary" 
                size="lg" 
                fullWidth 
                isLoading={isSubmitting}
                className="shadow-lg shadow-blue-600/20"
              >
                Buat Pesanan
              </Button>
              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                <FiTruck /> Pengiriman instan & aman
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
