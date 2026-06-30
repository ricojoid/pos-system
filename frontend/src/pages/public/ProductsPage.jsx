import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiShoppingBag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { useCart } from '../../context/CartContext';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const { addToCart } = useCart();

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/category');
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let url = `/product?page=${currentPage}&pageSize=12&sortBy=${sortBy}`;
        if (searchQuery) url += `&search=${searchQuery}`;
        if (categoryFilter) url += `&categoryId=${categoryFilter}`;
        
        const res = await api.get(url);
        setProducts(res.data.data);
        setPagination({
          page: res.data.page,
          totalPages: Math.ceil(res.data.totalCount / res.data.pageSize) || 1
        });
      } catch (error) {
        console.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryFilter, sortBy, currentPage]);

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 when filters change
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="page-content py-8">
      <div className="container">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Katalog Produk</h1>
            <p className="text-gray-500">Temukan barang yang Anda butuhkan</p>
          </div>
          
          <div className="w-full md:w-auto">
            <Input 
              icon={FiSearch} 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => updateParams('search', e.target.value)}
              className="w-full md:w-72"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-gray-200">
                <FiFilter /> Filter
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Kategori</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={categoryFilter === ''}
                      onChange={() => updateParams('category', '')}
                      className="form-radio text-blue-500 bg-white border-gray-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-500 group-hover:text-slate-900 transition-colors">Semua Kategori</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={categoryFilter === cat.id.toString()}
                        onChange={() => updateParams('category', cat.id.toString())}
                        className="form-radio text-blue-500 bg-white border-gray-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-500 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Urutkan</h3>
                <select 
                  className="w-full bg-white border border-gray-200 rounded-md p-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => updateParams('sortBy', e.target.value)}
                >
                  <option value="newest">Terbaru</option>
                  <option value="price_asc">Harga (Termurah)</option>
                  <option value="price_desc">Harga (Termahal)</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-white/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/30 rounded-xl border border-dashed border-gray-200">
                <FiShoppingBag size={48} className="text-gray-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
                <Button 
                  variant="secondary" 
                  className="mt-6"
                  onClick={() => {
                    setSearchParams(new URLSearchParams());
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <Card key={product.id} className="flex flex-col h-full overflow-hidden group hover:border-gray-600">
                      <Link to={`/product/${product.id}`} className="block relative h-48 bg-white overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={`http://localhost:5018${product.imageUrl}`} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <FiShoppingBag size={40} />
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="warning" className="bg-amber-500/90 backdrop-blur text-black">
                              Stok Terbatas: {product.stock}
                            </Badge>
                          </div>
                        )}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                            <Badge variant="danger" className="text-lg px-4 py-2">Habis</Badge>
                          </div>
                        )}
                      </Link>
                      
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="text-xs text-emerald-600 mb-1">{product.categoryName}</p>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-bold text-lg line-clamp-2 hover:text-blue-300 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-2">
                          {product.description || "Tidak ada deskripsi"}
                        </p>
                        
                        <div className="mt-auto flex items-end justify-between border-t border-gray-200/50 pt-4">
                          <div>
                            <p className="font-bold text-emerald-400 text-lg">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">
                              {product.storeName}
                            </p>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                          >
                            Beli
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button 
                      variant="secondary" 
                      disabled={currentPage <= 1}
                      onClick={() => updateParams('page', (currentPage - 1).toString())}
                    >
                      <FiChevronLeft />
                    </Button>
                    
                    <div className="flex gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => updateParams('page', (i + 1).toString())}
                          className={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition-colors ${
                            currentPage === i + 1 
                              ? 'bg-blue-600 text-slate-900' 
                              : 'bg-white text-gray-500 hover:bg-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <Button 
                      variant="secondary" 
                      disabled={currentPage >= pagination.totalPages}
                      onClick={() => updateParams('page', (currentPage + 1).toString())}
                    >
                      <FiChevronRight />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
