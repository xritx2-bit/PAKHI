'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, X, Star } from 'lucide-react';
import { PRODUCTS } from '@/lib/products-data';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { openProductModal } = useCart();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sarees' | 'kurtas'>('all');

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedFilter !== 'all' && product.category !== selectedFilter) {
      return false;
    }
    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.fabric.toLowerCase().includes(q) ||
      product.occasion.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.pattern.toLowerCase().includes(q) ||
      product.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/75 backdrop-blur-sm flex items-start justify-center pt-16 px-4 pb-6 animate-fadeIn">
      <div 
        className="relative bg-[#FFFFFF] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E8DCCF] overflow-hidden text-[#241816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8DCCF] flex items-center gap-3 bg-[#F8F3EC]">
          <Search className="w-5 h-5 text-[#722F3D]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, kurtas, fabrics ('Banarasi', 'Cotton', 'Festive')..."
            className="flex-1 bg-transparent text-sm text-[#241816] placeholder:text-[#6E5C57] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#6E5C57] hover:text-[#722F3D] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#241816] hover:text-[#722F3D] rounded-full hover:bg-[#E8DCCF]/50"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-2.5 bg-[#FAF2F3] border-b border-[#E8DCCF]/60 flex items-center gap-2 text-xs">
          <span className="text-[#6E5C57]">Category:</span>
          {(['all', 'sarees', 'kurtas'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${
                selectedFilter === cat
                  ? 'bg-[#722F3D] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#241816] border border-[#E8DCCF] hover:bg-[#F8F3EC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#E8DCCF]/60 p-2">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-[#6E5C57] text-sm">
              <p>No matching designs found for &ldquo;{query}&rdquo;.</p>
              <p className="text-xs mt-1">Try searching for &quot;Silk&quot;, &quot;Kurta&quot;, or &quot;Wedding&quot;.</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onClose();
                  openProductModal(p);
                }}
                className="p-3 rounded-lg hover:bg-[#F8F3EC] flex items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded-md overflow-hidden bg-[#F5EBDD] flex-shrink-0 border border-[#E8DCCF]">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#241816]">{p.name}</h4>
                    <p className="text-xs text-[#6E5C57]">{p.fabric} • {p.occasion}</p>
                    <div className="flex items-center gap-1 text-[11px] text-[#C6A36B] mt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold text-[#241816]">{p.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-sm text-[#722F3D]">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  {p.originalPrice > p.price && (
                    <span className="block text-[11px] text-[#6E5C57] line-through">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
