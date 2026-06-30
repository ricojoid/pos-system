import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('pos_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data');
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock < quantity) {
      toast.error('Stok tidak mencukupi');
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error('Gagal menambah, melebihi stok yang tersedia');
          return prev;
        }
        
        toast.success('Kuantitas produk di keranjang diperbarui');
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
      
      toast.success('Produk ditambahkan ke keranjang');
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        storeName: product.storeName,
        stock: product.stock,
        quantity
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.productId === productId) {
        if (newQuantity > item.stock) {
          toast.error('Kuantitas melebihi stok');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('pos_cart');
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);
  const openCart = () => setIsCartOpen(true);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      toggleCart,
      closeCart,
      openCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
