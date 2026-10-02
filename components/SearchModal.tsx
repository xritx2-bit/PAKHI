'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Star, Sparkles, Loader2, ArrowRight } from 'lucide-react';
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
  const [aiResults, setAiResults] = useState<Product[] | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  if (!isOpen) return null;

  // Handle AI Search with debouncing
  const runAiSearch = async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setAiResults(null);
      setAiReasoning(null);
      return;
    }

    setIsSearchingAi(true);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiResults(data.data);
        setAiReasoning(data.reasoning);
      }
    } catch {
      // Fallback to local filter
      setAiResults(null);
    } finally {
      setIsSearchingAi(false);
    }
  };

  // Local filtering fallback
  const localFiltered = PRODUCTS.filter((product) => {
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

  const displayProducts = aiResults !== null ? aiResults : localFiltered;

  const quickPrompts = [
    'Royal blue silk saree for wedding',
    'Breathable cotton kurta under 1500',
    'Festive pink embroidery',
  ];

  const handleSelectPrompt = (prompt: string) => {
    setQuery(prompt);
    runAiSearch(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/75 backdrop-blur-sm flex items-start justify-center pt-14 px-4 pb-6 animate-fadeIn">
      <div
        className="relative bg-[#FFFFFF] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E8DCCF] overflow-hidden text-[#241816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8DCCF] flex items-center gap-3 bg-[#F8F3EC]">
          {isSearchingAi ? (
            <Loader2 className="w-5 h-5 text-[#722F3D] animate-spin shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#722F3D] shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              runAiSearch(e.target.value);
            }}
            placeholder="Ask our AI Stylist (e.g. 'pure silk saree for wedding under ₹3000')..."
            className="flex-1 bg-transparent text-sm text-[#241816] placeholder:text-[#6E5C57] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setAiResults(null);
                setAiReasoning(null);
              }}
              className="text-xs text-[#6E5C57] hover:text-[#722F3D] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#241816] hover:text-[#722F3D] rounded-full hover:bg-[#E8DCCF]/50 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Reasoning / Prompts Bar */}
        <div className="px-4 py-2 bg-[#FAF2F3] border-b border-[#E8DCCF]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          {aiReasoning ? (
            <div className="flex items-center gap-1.5 text-[#722F3D] font-medium animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-[#DFC394]" />
              <span>{aiReasoning}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-[11px] text-[#6E5C57] shrink-0">Try AI Prompts:</span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(p)}
                  className="px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#722F3D]/20 text-[10px] text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1">
            {(['all', 'sarees', 'kurtas'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setAiResults(null);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                  selectedFilter === filter
                    ? 'bg-[#722F3D] text-[#FFFFFF]'
                    : 'text-[#6E5C57] hover:bg-[#FFFFFF]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Product Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#E8DCCF]/60 p-2">
          {displayProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E5C57]">
              No matching pieces found. Try a different fabric, color, or query.
            </div>
          ) : (
            displayProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  openProductModal(product);
                  onClose();
                }}
                className="p-3 hover:bg-[#F8F3EC] rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#F5EBDD] shrink-0 border border-[#E8DCCF]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A36B] font-semibold">
                      {product.fabric} • {product.occasion}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#241816] group-hover:text-[#722F3D] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                      <div className="flex items-center text-[#C6A36B]">
                        <Star className="w-3 h-3 fill-[#C6A36B]" />
                        <span className="ml-1 text-[11px] font-semibold text-[#241816]">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-[#6E5C57]">•</span>
                      <span className="text-[11px] text-[#6E5C57] line-clamp-1">
                        {product.pattern}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif text-sm font-bold text-[#722F3D] block">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-[#6E5C57] line-through block">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-[#722F3D] group-hover:underline inline-flex items-center gap-0.5 mt-1">
                    <span>View</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
