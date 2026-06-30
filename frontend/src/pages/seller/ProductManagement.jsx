import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiX } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import '../admin/AdminPages.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
    isActive: true
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/product/my-products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        imageUrl: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      toast.loading('Mengunggah gambar...', { id: 'upload' });
      const res = await api.post('/product/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: res.data.url });
      toast.success('Gambar berhasil diunggah', { id: 'upload' });
    } catch (error) {
      toast.error('Gagal mengunggah gambar', { id: 'upload' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock || !formData.categoryId) {
      toast.error('Mohon lengkapi data wajib (Nama, Harga, Stok, Kategori)');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingId) {
        await api.put(`/product/${editingId}`, formData);
        toast.success('Produk berhasil diperbarui');
      } else {
        await api.post('/product', formData);
        toast.success('Produk berhasil ditambahkan');
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/product/${id}`);
      toast.success('Produk berhasil dihapus');
      fetchProducts();
    } catch (error) {
      toast.error('Gagal menghapus produk');
    }
  };

  return (
    <div className="admin-page relative">
      <div className="admin-header space-between">
        <div>
          <h2 className="admin-title">Produk Saya</h2>
          <p className="admin-subtitle">Kelola inventaris dan katalog produk toko Anda</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <FiPlus /> Tambah Produk
        </Button>
      </div>

      <Card>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    <div className="btn-spinner inline-block"></div> Memuat data...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    Belum ada produk. Silakan tambah produk baru.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={`http://localhost:5018${p.imageUrl}`} alt={p.name} className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-700 flex items-center justify-center rounded">
                            <FiImage className="text-gray-500" />
                          </div>
                        )}
                        <span className="font-semibold text-gray-200">{p.name}</span>
                      </div>
                    </td>
                    <td><Badge variant="secondary">{p.categoryName}</Badge></td>
                    <td className="font-medium text-emerald-400">Rp {p.price.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={p.stock <= 5 ? 'text-red-400' : ''}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <Badge variant={p.isActive ? 'success' : 'secondary'}>
                        {p.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="text-right flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenModal(p)}>
                        <FiEdit2 size={14} />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                        <FiTrash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 px-8 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Produk <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Contoh: Sepatu Sneakers"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm appearance-none transition-colors"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Harga (Rp) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value ? parseInt(e.target.value) : ''})}
                      required
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm font-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Stok <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value ? parseInt(e.target.value) : ''})}
                    required
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Produk</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm min-h-[120px] transition-colors"
                  placeholder="Berikan penjelasan lengkap mengenai produk Anda..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Foto Produk</label>
                <div className="flex items-center gap-6 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  {formData.imageUrl ? (
                    <div className="relative group">
                      <img 
                        src={`http://localhost:5018${formData.imageUrl}`} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg shadow-sm border border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-white text-xs font-medium px-2 py-1 bg-black/40 rounded border border-white/20">Ubah</button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center text-slate-400">
                      <FiImage size={24} className="mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Kosong</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm text-sm py-2 px-4 rounded-lg flex items-center"
                    >
                      <FiImage className="mr-2" size={16} /> Pilih Gambar
                    </Button>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Format: JPG, PNG, WEBP (Maksimal 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="isActive" className="ml-3 font-medium text-emerald-900 cursor-pointer select-none">
                  Aktifkan Produk (Bisa dibeli oleh pelanggan)
                </label>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" onClick={handleCloseModal} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6">
                  Batal
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="bg-slate-900 hover:bg-emerald-500 text-white shadow-md px-8">
                  Simpan Produk
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
