'use client';

import React from 'react';
import { CartProvider, useCart } from '@/lib/cart-context';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import SearchModal from '@/components/SearchModal';

function GlobalModals() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    activeProductModal,
    closeProductModal,
    isSearchOpen,
    setIsSearchOpen,
  } = useCart();

  return (
    <>
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      {activeProductModal && (
        <ProductDetailModal
          product={activeProductModal}
          onClose={closeProductModal}
          onOpenCheckout={() => {
            closeProductModal();
            setIsCheckoutOpen(true);
          }}
        />
      )}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <GlobalModals />
    </CartProvider>
  );
}
