'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Plus, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/lib/types';

interface CompleteTheLookProps {
  product: Product;
}

export default function CompleteTheLook({ product }: CompleteTheLookProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [ensemble, setEnsemble] = useState<any[]>([]);
  const [stylistTip, setStylistTip] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchLook() {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/complete-the-look', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            slug: product.slug,
            category: product.category,
            fabric: product.fabric,
            occasion: product.occasion,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setEnsemble(data.ensemble || []);
          setStylistTip(data.stylistTip || '');
        }
      } catch (err) {
        console.error('Failed to load complete the look:', err);
      } finally {
        setLoading(false);
      }
    }

    if (product) {
      fetchLook();
    }
  }, [product]);

  const handleAddEnsembleItem = (item: any) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        slug: item.actionSlug || product.slug,
        price: item.price,
        originalPrice: Math.round(item.price * 1.25),
        image: item.image,
        category: 'jewellery',
        subcategory: item.category || 'Accessories',
        discountPercent: 20,
        rating: 4.9,
        reviewCount: 18,
        gallery: [item.image],
        description: `Handcrafted artisan pairing for ${product.name}`,
        fabric: 'Artisan Metalwork / Precious Stones',
        occasion: 'Festive',
        pattern: 'Handcrafted',
        isNew: true,
        isTrending: true,
        stock: 12,
        colors: [{ name: 'Gold', hex: '#DFC394', inStock: true }],
        careInstructions: 'Store in dry velvet case',
        details: ['Handmade', 'Hypoallergenic'],
      },
      { color: 'Curated Pairing', quantity: 1 }
    );
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setIsCartOpen(true);
    }, 400);
  };

  if (!ensemble.length && !loading) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[#E8DCCF]/80">
      <div className="bg-[#FAF4EB] border border-[#E8DCCF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCF]/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#722F3D]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#722F3D]">
                AI Royal Atelier Stylist
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241816]">
              Complete The Look
            </h3>
            <p className="text-xs text-[#6E5C57]">
              Curated pairings and accessories crafted to elevate this drape into a showstopping ensemble.
            </p>
          </div>
        </div>

        {/* Stylist editorial tip */}
        {stylistTip && (
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8DCCF] text-xs text-[#6E5C57] flex items-start gap-3">
            <span className="text-base text-[#722F3D] font-serif">❝</span>
            <p className="italic leading-relaxed">{stylistTip}</p>
          </div>
        )}

        {/* Pairings Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ensemble.map((item) => {
            const isAdded = addedItems[item.id];
            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-xl p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-44 rounded-lg overflow-hidden bg-[#F5EBDD] border border-[#E8DCCF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-[#722F3D] text-[#F8F3EC] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                      {item.category}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#241816] line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#6E5C57] line-clamp-2 mt-1">
                      {item.curationNote}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DCCF]/60 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#722F3D]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => handleAddEnsembleItem(item)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Pairing</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
