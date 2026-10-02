'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star, Sparkles, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { PRODUCTS } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setIsSearchOpen } = useCart();

  // Find all products that are currently in the wishlist
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    addToCart(product);
    toggleWishlist(product.id);
  };

  const handleMoveAllToBag = () => {
    wishlistedProducts.forEach((p) => {
      addToCart(p);
      toggleWishlist(p.id);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC]">
      {/* Navbar */}
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Breadcrumb Bar */}
      <div className="bg-[#FAF2F3] border-b border-[#E8DCCF]/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#6E5C57]">
            <Link href="/" className="hover:text-[#722F3D]">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#C6A36B]" />
            <span className="text-[#241816] font-medium">My Wishlist</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#E8DCCF] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A36B] font-semibold block mb-1">
              Personal Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241816]">
              Saved Treasures
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5C57] mt-1">
              {wishlistedProducts.length === 0
                ? 'Your wishlist is currently empty.'
                : `You have saved ${wishlistedProducts.length} exquisite handcrafted design${wishlistedProducts.length > 1 ? 's' : ''}.`}
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              onClick={handleMoveAllToBag}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#722F3D] text-[#F8F3EC] text-xs font-semibold hover:bg-[#541F28] transition-all shadow-md self-start sm:self-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {/* Content */}
        {wishlistedProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-[#FFFFFF] rounded-2xl p-12 sm:p-16 text-center border border-[#E8DCCF] shadow-xs max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#241816]">Your Wishlist is Empty</h2>
              <p className="text-xs sm:text-sm text-[#6E5C57] mt-1 max-w-md mx-auto leading-relaxed">
                Save pieces you adore by clicking the heart icon while exploring our Sarees and Kurtas. They will stay safely here.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/category/sarees"
                className="px-6 py-2.5 rounded-lg bg-[#722F3D] text-[#F8F3EC] text-xs font-semibold hover:bg-[#541F28] transition-colors shadow-sm"
              >
                Explore Sarees
              </Link>
              <Link
                href="/category/kurtas"
                className="px-6 py-2.5 rounded-lg bg-[#FAF2F3] text-[#722F3D] border border-[#722F3D]/20 text-xs font-semibold hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors shadow-xs"
              >
                Explore Kurtas
              </Link>
            </div>
          </div>
        ) : (
          /* Grid of Wishlisted Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E8DCCF] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Area */}
                <div className="relative aspect-[3/4] bg-[#F5EBDD] overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFFFF]/90 text-[#6E5C57] hover:text-[#722F3D] hover:bg-[#FFFFFF] shadow-md transition-all active:scale-95"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-[#C6A36B] text-[#241816] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Info & Move to Bag */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A36B] font-semibold">
                      {product.fabric} • {product.occasion}
                    </span>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif text-sm font-bold text-[#241816] group-hover:text-[#722F3D] transition-colors line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-serif font-bold text-sm text-[#722F3D]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-[#6E5C57] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E8DCCF]/60">
                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full py-2.5 rounded-lg bg-[#722F3D] text-[#F8F3EC] hover:bg-[#541F28] text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs group"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
