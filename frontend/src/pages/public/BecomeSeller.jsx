import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiFileText } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const BecomeSeller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ storeName: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    const checkExistingRequest = async () => {
      try {
        const res = await api.get('/store/my-requests');
        if (res.data && res.data.length > 0) {
          // Get the most recent request
          setExistingRequest(res.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch existing requests');
      }
    };
    checkExistingRequest();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeName) {
      toast.error('Nama toko wajib diisi');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/store/request', formData);
      toast.success('Permintaan berhasil dikirim!');
      
      // Refresh request status
      const res = await api.get('/store/my-requests');
      if (res.data && res.data.length > 0) {
        setExistingRequest(res.data[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim permintaan');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role === 'Seller' || user?.role === 'Admin') {
    return (
      <div className="page-content">
        <div className="container max-w-2xl mt-12">
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-bold mb-4">Anda Sudah Menjadi Seller!</h2>
            <p className="text-gray-500 mb-6">Akun Anda sudah memiliki akses untuk mengelola toko.</p>
            <Button onClick={() => navigate(`/${user.role.toLowerCase()}/dashboard`)}>
              Ke Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container max-w-2xl mt-12">
        <Card padding="lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Buka Toko Anda</h2>
            <p className="text-gray-500">Bergabunglah sebagai penjual dan mulai raih keuntungan</p>
          </div>

          {existingRequest ? (
            <div className="bg-[#1e293b] p-6 rounded-lg border border-gray-200 text-center">
              <h3 className="text-xl font-bold mb-2">Status Permintaan: 
                <span className="ml-2">
                  <Badge variant={
                    existingRequest.status === 'Pending' ? 'warning' : 
                    existingRequest.status === 'Approved' ? 'success' : 'danger'
                  }>
                    {existingRequest.status}
                  </Badge>
                </span>
              </h3>
              
              {existingRequest.status === 'Pending' && (
                <p className="text-gray-500 mt-2">
                  Permintaan Anda sedang ditinjau oleh Admin. Harap bersabar.
                </p>
              )}
              
              {existingRequest.status === 'Rejected' && (
                <div className="mt-4">
                  <p className="text-red-400 mb-2">Permintaan ditolak dengan alasan:</p>
                  <p className="bg-red-900/20 p-3 rounded text-sm text-red-200">
                    {existingRequest.adminNotes || 'Tidak ada alasan spesifik'}
                  </p>
                  <Button 
                    variant="primary" 
                    className="mt-6"
                    onClick={() => setExistingRequest(null)}
                  >
                    Kirim Ulang Permintaan
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nama Toko"
                placeholder="Contoh: Toko Berkah"
                icon={FiShoppingBag}
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              />
              
              <div className="form-group">
                <label className="form-label">Deskripsi Toko</label>
                <div className="input-wrapper">
                  <FiFileText className="input-icon" />
                  <textarea 
                    className="input-field"
                    style={{ minHeight: '120px', paddingTop: '12px' }}
                    placeholder="Ceritakan tentang toko Anda dan apa yang Anda jual..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth 
                isLoading={isLoading}
              >
                Kirim Permintaan
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BecomeSeller;
