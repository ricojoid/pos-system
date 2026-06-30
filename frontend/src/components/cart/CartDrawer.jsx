import React from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 fade-in" 
        onClick={closeCart}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1e293b] border-l border-gray-200 shadow-2xl z-50 flex flex-col slide-in-right">
        
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiShoppingBag /> Keranjang Belanja
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-500 hover:text-slate-900 rounded-full hover:bg-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <FiShoppingBag size={48} className="mb-4 opacity-20" />
              <p>Keranjang Anda masih kosong</p>
              <Button 
                variant="primary" 
                className="mt-6"
                onClick={() => {
                  closeCart();
                  navigate('/products');
                }}
              >
                Mulai Belanja
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4 bg-white p-3 rounded-lg border border-gray-200/50">
                  <div className="w-20 h-20 bg-white rounded shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={`http://localhost:5018${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <FiShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-500 hover:text-red-400 p-1"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">{item.storeName}</p>
                    <p className="text-emerald-400 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-3 bg-white rounded-md border border-gray-200">
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-slate-900 disabled:opacity-50"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-slate-900 disabled:opacity-50"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Total Belanja</span>
              <span className="text-xl font-bold text-slate-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <Button 
              variant="primary" 
              fullWidth 
              size="lg"
              onClick={handleCheckout}
            >
              Checkout Sekarang
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
