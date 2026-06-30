import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTag } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useCart } from '../../context/CartContext';

const HomePage = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch new arrivals (limit 4)
        const prodRes = await api.get('/product?pageSize=4&sortBy=newest');
        setNewProducts(prodRes.data.data);
        
        // Fetch categories
        const catRes = await api.get('/category');
        setCategories(catRes.data.slice(0, 4)); // Get top 4 categories
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-content">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 text-center">
          <Badge variant="primary" className="mb-6 px-4 py-1 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
            Platform E-Commerce Terpercaya
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-slate-900">
            Belanja Mudah, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Kapan Saja</span>
          </h1>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Jelajahi ribuan produk dari berbagai toko terpercaya. Belanja mudah, aman, dan cepat di Tokoku.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="px-8 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                Belanja Sekarang <FiArrowRight className="ml-2 inline" />
              </Button>
            </Link>
            <Link to="/become-seller">
              <Button variant="secondary" size="lg" className="px-8 border-slate-200 text-slate-700 hover:bg-slate-50">
                Buka Toko
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Kategori Populer</h2>
              <p className="text-slate-500 mt-2">Temukan produk berdasarkan kategori impianmu</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse border border-slate-200"></div>)
            ) : categories.length === 0 ? (
              <div className="col-span-4 text-center py-8 text-slate-500">Belum ada kategori</div>
            ) : (
              categories.map(cat => (
                <Link key={cat.id} to={`/products?category=${cat.id}`}>
                  <Card className="h-full border-slate-200 hover:border-emerald-300 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer group bg-white shadow-sm hover:shadow-md">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-emerald-100">
                      <FiTag className="text-2xl text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{cat.productCount} Produk</p>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Produk Terbaru</h2>
              <p className="text-slate-500 mt-2">Koleksi produk terbaru yang baru saja ditambahkan</p>
            </div>
            <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
              Lihat Semua <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse border border-slate-200"></div>)
            ) : newProducts.length === 0 ? (
              <div className="col-span-4 text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                Belum ada produk yang tersedia.
              </div>
            ) : (
              newProducts.map(product => (
                <Card key={product.id} className="flex flex-col h-full overflow-hidden group border-slate-200 shadow-sm hover:shadow-md bg-white p-0">
                  <Link to={`/product/${product.id}`} className="block relative h-48 bg-slate-50 overflow-hidden border-b border-slate-100">
                    {product.imageUrl ? (
                      <img 
                        src={`http://localhost:5018${product.imageUrl}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FiShoppingBag size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Badge variant="primary" className="bg-emerald-500 text-white shadow-sm border-0 font-medium">Baru</Badge>
                    </div>
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{product.categoryName}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-slate-800 text-lg line-clamp-2 hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-2 mb-4 flex items-center gap-1.5">
                      <FiShoppingBag size={14} className="text-slate-400" /> {product.storeName}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Harga</p>
                        <p className="font-bold text-emerald-600 text-lg">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-slate-900 hover:bg-emerald-600 text-white shadow-md transition-colors"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
