'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface NewArrivalsProps {
  products: Product[];
  onViewAllClick: () => void;
}

export default function NewArrivals({ products, onViewAllClick }: NewArrivalsProps) {
  const { isInWishlist, toggleWishlist, openProductModal, addToCart } = useCart();

  return (
    <section id="new-arrivals" className="py-16 md:py-24 bg-[#F8F3EC] border-t border-[#E8DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title with View All Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C6A36B] font-semibold block mb-1">
              Fresh Off The Loom
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#241816] font-bold tracking-tight">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#722F3D] hover:text-[#541F28] transition-colors border-b border-[#722F3D]/40 pb-0.5 self-start sm:self-auto group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* 4 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(0, 4).map((product) => {
            const isWish = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group relative bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E8DCCF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div 
                  onClick={() => openProductModal(product)}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EBDD] cursor-pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* "New" Badge */}
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-[#722F3D] text-[#F8F3EC] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                      New
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                      isWish
                        ? 'bg-[#722F3D] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF]/85 text-[#241816] hover:text-[#722F3D]'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#241816]/70 via-[#241816]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal(product);
                      }}
                      className="px-3 py-1.5 bg-[#FFFFFF] text-[#241816] text-xs font-medium rounded shadow hover:bg-[#F8F3EC] transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#722F3D]" />
                      <span>Quick View</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-3 py-1.5 bg-[#722F3D] text-[#FFFFFF] text-xs font-medium rounded shadow hover:bg-[#541F28] transition-colors flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div onClick={() => openProductModal(product)} className="cursor-pointer">
                    <h3 className="font-serif text-base font-semibold text-[#241816] group-hover:text-[#722F3D] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#6E5C57] mt-0.5 line-clamp-1">
                      {product.fabric} • {product.subcategory}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E8DCCF]/60 flex items-center justify-between">
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-base text-[#241816]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-[#6E5C57] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-xs text-[#6E5C57]">
                      <Star className="w-3.5 h-3.5 text-[#C6A36B] fill-current" />
                      <span className="font-medium text-[#241816]">{product.rating}</span>
                      <span className="text-[11px]">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
