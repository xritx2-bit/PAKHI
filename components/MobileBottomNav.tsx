'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface MobileBottomNavProps {
  onSearchClick: () => void;
}

export default function MobileBottomNav({ onSearchClick }: MobileBottomNavProps) {
  const { cartCount, wishlist, setIsCartOpen } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E8DCCF] shadow-lg py-2 px-4 flex items-center justify-around text-[#6E5C57]">
      <Link href="/" className="flex flex-col items-center gap-0.5 text-xs font-medium text-[#722F3D]">
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </Link>

      <button
        onClick={onSearchClick}
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-[#722F3D] transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Search</span>
      </button>

      <Link
        href="/wishlist"
        className="relative flex flex-col items-center gap-0.5 text-xs font-medium hover:text-[#722F3D] transition-colors"
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px]">Wishlist</span>
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C6A36B] text-[#241816] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </Link>

      <Link
        href="/track-order"
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-[#722F3D] transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Track Order</span>
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-0.5 text-xs font-medium text-[#722F3D]"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px]">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#722F3D] text-[#FFFFFF] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
