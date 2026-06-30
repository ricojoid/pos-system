import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiMinus, FiPlus, FiHome, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        toast.error("Gagal memuat produk. Mungkin produk sudah dihapus.");
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="btn-spinner inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="page-content py-10">
      <div className="container max-w-6xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Kembali
        </button>

        <div className="bg-[#1e293b] rounded-2xl border border-gray-200/50 overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="bg-white lg:border-r border-gray-200 p-8 flex items-center justify-center min-h-[400px]">
              {product.imageUrl ? (
                <img 
                  src={`http://localhost:5018${product.imageUrl}`} 
                  alt={product.name} 
                  className="w-full max-w-md h-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-gray-600">
                  <FiShoppingBag size={80} className="mb-4 opacity-50" />
                  <p>Tidak ada gambar</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <Badge variant="secondary" className="w-fit mb-4">{product.categoryName}</Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{product.name}</h1>
              
              <div className="text-3xl font-extrabold text-emerald-400 mb-6">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              
              <div className="flex items-center gap-4 py-4 border-y border-gray-200/50 mb-6 text-sm text-gray-700">
                <div className="flex items-center">
                  <FiHome className="mr-2 text-emerald-600" /> 
                  <span className="font-semibold">{product.storeName}</span>
                </div>
                <div className="h-4 w-px bg-gray-600"></div>
                <div className="flex items-center">
                  <FiShield className="mr-2 text-emerald-400" /> 
                  <span>Terverifikasi</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-200/50 pb-2">Deskripsi Produk</h3>
                <div className="text-gray-500 leading-relaxed whitespace-pre-line">
                  {product.description || "Toko tidak menyediakan deskripsi untuk produk ini."}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="mt-auto bg-white/50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Sisa Stok</span>
                  <span className={`font-bold ${product.stock <= 5 ? 'text-red-400' : 'text-slate-900'}`}>
                    {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
                  </span>
                </div>
                
                {product.stock > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center justify-between bg-[#1e293b] border border-gray-600 rounded-lg p-1 sm:w-1/3">
                      <button 
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-slate-900 disabled:opacity-50"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="font-bold w-12 text-center text-lg">{quantity}</span>
                      <button 
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-slate-900 disabled:opacity-50"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="flex-1 shadow-lg shadow-blue-600/20"
                      onClick={handleAddToCart}
                    >
                      <FiShoppingBag className="mr-2 inline" /> Tambah ke Keranjang
                    </Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="lg" fullWidth disabled>
                    Stok Habis
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
