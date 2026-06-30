import React, { useState, useEffect } from 'react';
import { FiSave, FiInfo, FiHome } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import '../admin/AdminPages.css';

const SellerSettings = () => {
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
  });

  useEffect(() => {
    fetchMyStore();
  }, []);

  const fetchMyStore = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/store/my-store');
      setStore(res.data);
      setFormData({
        storeName: res.data.storeName || '',
        description: res.data.description || '',
      });
    } catch (error) {
      toast.error('Gagal memuat data toko');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeName.trim()) {
      toast.error('Nama toko tidak boleh kosong');
      return;
    }

    try {
      setIsSaving(true);
      await api.put('/store/my-store', formData);
      toast.success('Pengaturan toko berhasil disimpan');
      fetchMyStore(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page flex justify-center py-20">
        <div className="btn-spinner inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Pengaturan Toko</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola profil dan informasi publik toko Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100 shadow-inner">
              <FiHome size={40} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-1">{store?.storeName}</h3>
            <p className="text-sm font-medium text-emerald-600 mb-4 bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">Toko Terverifikasi</p>
            <div className="text-xs text-slate-500 border-t border-slate-100 pt-4 mt-2">
              Bergabung sejak {new Date(store?.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3 shadow-sm">
            <FiInfo className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
            <p className="leading-relaxed">Informasi yang Anda simpan di sini akan ditampilkan secara publik di halaman detail produk pembeli.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nama Toko
                </label>
                <Input
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Masukkan nama toko"
                  fullWidth
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Deskripsi Toko
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm"
                  placeholder="Ceritakan tentang toko Anda (barang apa yang dijual, jam operasional, dll)"
                ></textarea>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  isLoading={isSaving}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-500 text-white shadow-md transition-colors px-6"
                >
                  <FiSave /> Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
