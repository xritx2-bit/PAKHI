'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ShippingAddress } from './types';
import { PRODUCTS } from './products-data';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: { color?: string; size?: string; blouseIncluded?: boolean; quantity?: number }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  activeProductModal: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  orders: Order[];
  lastOrder: Order | null;
  placeOrder: (address: ShippingAddress, paymentMethod: 'upi' | 'card' | 'cod') => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Pre-seed with the 2 items shown in the user's design mockup for an instant Wow factor!
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'mock-1',
      productId: 'saree-3',
      name: 'Royal Blue Banarasi Silk Saree',
      slug: 'royal-blue-banarasi-silk-saree',
      price: 1999,
      originalPrice: 2499,
      image: '/images/banarasi-blue.jpg',
      quantity: 1,
      selectedColor: 'Royal Blue',
      blouseIncluded: true,
    },
    {
      id: 'mock-2',
      productId: 'kurta-2',
      name: 'Embroidered Kurta',
      slug: 'embroidered-kurta',
      price: 999, // Matching the design mockup value ₹999 / ₹899
      originalPrice: 1999,
      image: '/images/embroidered-kurta.jpg',
      quantity: 1,
      selectedColor: 'Blush Pink',
      selectedSize: 'M',
    }
  ]);

  const [wishlist, setWishlist] = useState<string[]>(['saree-1', 'kurta-1']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const addToCart = (product: Product, options?: { color?: string; size?: string; blouseIncluded?: boolean; quantity?: number }) => {
    const qty = options?.quantity || 1;
    const color = options?.color || product.colors[0]?.name || 'Standard';
    const size = options?.size || (product.sizes ? product.sizes[1] || product.sizes[0] : undefined);
    const blouse = options?.blouseIncluded ?? product.blouseIncluded ?? true;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qty,
        };
        return next;
      }

      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: qty,
          selectedColor: color,
          selectedSize: size,
          blouseIncluded: blouse,
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openProductModal = (product: Product) => setActiveProductModal(product);
  const closeProductModal = () => setActiveProductModal(null);

  // Price calculations matching Blueprint & Mockup
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = cartSubtotal >= 2000 ? 200 : cartSubtotal >= 1000 ? 100 : 0;
  // Free shipping above ₹999 as stated on the top banner
  const cartShipping = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (address: ShippingAddress, paymentMethod: 'upi' | 'card' | 'cod'): Order => {
    const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      total: cartTotal,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
      status: 'CONFIRMED',
      createdAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      estimatedDelivery: '3 - 5 Business Days'
    };

    // Also asynchronously record order in database
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          address,
          paymentMethod,
        }),
      }).catch((err) => console.error('Order recording error:', err));
    } catch {
      // Fallback silently if offline
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        activeProductModal,
        openProductModal,
        closeProductModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        lastOrder,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
