'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface NavbarProps {
  onSearchClick: () => void;
  onFilterCategory?: (category: 'all' | 'sarees' | 'kurtas') => void;
}

export default function Navbar({ onSearchClick, onFilterCategory }: NavbarProps) {
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F3EC]/95 backdrop-blur-md border-b border-[#E8DCCF] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#722F3D] text-[#FDF9F2] text-xs py-2 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2">
        <span className="text-[#DFC394]">✦</span>
        <span>Free Shipping on Orders Above ₹999 across India</span>
        <span className="text-[#DFC394]">✦</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#241816] hover:text-[#722F3D] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C6A36B]/40 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="Pakhi's Collection Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-wide text-[#722F3D] font-bold group-hover:text-[#541F28] transition-colors">
                Pakhi&apos;s
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#C6A36B] -mt-1 font-medium">
                Collection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#241816]">
            <Link
              href="/"
              onClick={() => onFilterCategory?.('all')}
              className="hover:text-[#722F3D] transition-colors py-1 border-b-2 border-transparent hover:border-[#722F3D]"
            >
              Home
            </Link>
            <Link
              href="/category/sarees"
              onClick={(e) => {
                if (onFilterCategory) {
                  e.preventDefault();
                  onFilterCategory('sarees');
                }
              }}
              className="hover:text-[#722F3D] transition-colors py-1 border-b-2 border-transparent hover:border-[#722F3D]"
            >
              Sarees
            </Link>
            <Link
              href="/category/kurtas"
              onClick={(e) => {
                if (onFilterCategory) {
                  e.preventDefault();
                  onFilterCategory('kurtas');
                }
              }}
              className="hover:text-[#722F3D] transition-colors py-1 border-b-2 border-transparent hover:border-[#722F3D]"
            >
              Kurtas
            </Link>
            <a
              href="/#new-arrivals"
              className="hover:text-[#722F3D] transition-colors py-1 border-b-2 border-transparent hover:border-[#722F3D]"
            >
              New Arrivals
            </a>
            <Link
              href="/about"
              className="hover:text-[#722F3D] transition-colors py-1 border-b-2 border-transparent hover:border-[#722F3D]"
            >
              Our Story
            </Link>
            <Link
              href="/track-order"
              className="hover:text-[#722F3D] transition-colors py-1 border-b-2 border-transparent hover:border-[#722F3D]"
            >
              Track Order
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#241816]">
            {/* Search */}
            <button
              onClick={onSearchClick}
              className="p-2 hover:text-[#722F3D] transition-colors rounded-full hover:bg-[#E8DCCF]/40"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account / Orders */}
            <Link
              href="/account"
              className="hidden sm:inline-flex p-2 hover:text-[#722F3D] transition-colors rounded-full hover:bg-[#E8DCCF]/40"
              aria-label="Account & Orders"
              title="Customer Account & Orders"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:text-[#722F3D] transition-colors rounded-full hover:bg-[#E8DCCF]/40"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C6A36B] text-[#241816] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#722F3D] hover:text-[#541F28] transition-colors rounded-full hover:bg-[#E8DCCF]/40"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#722F3D] text-[#F8F3EC] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F3EC] border-b border-[#E8DCCF] px-4 pt-3 pb-6 space-y-3 transition-all animate-fadeIn">
          <Link
            href="/"
            onClick={() => {
              onFilterCategory?.('all');
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            Home
          </Link>
          <button
            onClick={() => {
              onFilterCategory?.('sarees');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            Sarees
          </button>
          <button
            onClick={() => {
              onFilterCategory?.('kurtas');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            Kurtas
          </button>
          <a
            href="#new-arrivals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            New Arrivals
          </a>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            Our Story
          </Link>
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            My Account
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#241816] hover:bg-[#E8DCCF]/50 hover:text-[#722F3D]"
          >
            Track Order
          </Link>
        </div>
      )}
    </header>
  );
}
