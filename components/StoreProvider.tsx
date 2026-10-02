'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider, useCart } from '@/lib/cart-context';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import SearchModal from '@/components/SearchModal';
import CustomerConciergeModal from '@/components/CustomerConciergeModal';

function GlobalModals() {
  const pathname = usePathname();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    activeProductModal,
    closeProductModal,
    isSearchOpen,
    setIsSearchOpen,
  } = useCart();

  // Keep admin panel completely isolated from customer modals
  if (pathname?.startsWith('/admin')) {
    return null;
  }

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
      <CustomerConciergeModal />
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
