'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ShopByCategory from '@/components/ShopByCategory';
import NewArrivals from '@/components/NewArrivals';
import EditorialBanner from '@/components/EditorialBanner';
import ShopByOccasion from '@/components/ShopByOccasion';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';
import { ShieldCheck, Sparkles, RefreshCw, Truck, Filter } from 'lucide-react';

function BoutiqueMain() {
  const { setIsSearchOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sarees' | 'kurtas'>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  // Filter products based on selected category & occasion
  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedOccasion && p.occasion !== selectedOccasion) return false;
    return true;
  });

  const handleShopSarees = () => {
    setSelectedCategory('sarees');
    setSelectedOccasion(null);
    const el = document.getElementById('collection-view');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopKurtas = () => {
    setSelectedCategory('kurtas');
    setSelectedOccasion(null);
    const el = document.getElementById('collection-view');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectOccasion = (occ: string) => {
    if (selectedOccasion === occ) {
      setSelectedOccasion(null);
    } else {
      setSelectedOccasion(occ);
      const el = document.getElementById('collection-view');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC]">
      {/* Navbar with brand logo and cart counters */}
      <Navbar
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedOccasion(null);
        }}
      />

      <main className="flex-1">
        {/* Hero Section matching mockup */}
        <Hero onShopSarees={handleShopSarees} onShopKurtas={handleShopKurtas} />

        {/* Shop by Category matching mockup */}
        <ShopByCategory
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('collection-view');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Category / Occasion Filter Bar */}
        <div id="collection-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8DCCF]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6E5C57] font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#722F3D]" />
                Filter by Category:
              </span>
              {(['all', 'sarees', 'kurtas'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedOccasion(null);
                  }}
                  className={`px-3 py-1 rounded-full capitalize text-xs font-medium transition-all ${
                    selectedCategory === cat && !selectedOccasion
                      ? 'bg-[#722F3D] text-[#F8F3EC] shadow-sm'
                      : 'bg-[#FFFFFF] text-[#241816] border border-[#E8DCCF] hover:bg-[#F8F3EC]'
                  }`}
                >
                  {cat === 'all' ? 'All Collections' : cat}
                </button>
              ))}
            </div>

            {selectedOccasion && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#722F3D] text-[#FFFFFF] px-3 py-1 rounded-full flex items-center gap-1">
                  Occasion: {selectedOccasion}
                  <button onClick={() => setSelectedOccasion(null)} className="ml-1 text-[#DFC394]">×</button>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* New Arrivals Section matching mockup */}
        <NewArrivals
          products={filteredProducts}
          onViewAllClick={() => {
            setSelectedCategory('all');
            setSelectedOccasion(null);
          }}
        />

        {/* Editorial Banner matching mockup */}
        <EditorialBanner onShopNow={handleShopSarees} />

        {/* Shop by Occasion matching mockup */}
        <ShopByOccasion
          selectedOccasion={selectedOccasion}
          onSelectOccasion={handleSelectOccasion}
        />

        {/* Trust Badges matching Blueprint Section 4 */}
        <section className="py-12 bg-[#FAF4EB] border-t border-[#E8DCCF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-[#FFFFFF]/60 border border-[#E8DCCF]/50">
                <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#241816]">100% Certified Silk</h3>
                <p className="text-[11px] text-[#6E5C57]">Authentic handlooms verified by master weavers</p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-[#FFFFFF]/60 border border-[#E8DCCF]/50">
                <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#241816]">Free Express Shipping</h3>
                <p className="text-[11px] text-[#6E5C57]">Complimentary delivery on all orders above ₹999</p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-[#FFFFFF]/60 border border-[#E8DCCF]/50">
                <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#241816]">7-Day Easy Returns</h3>
                <p className="text-[11px] text-[#6E5C57]">Doorstep pickup &amp; 100% money-back guarantee</p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-[#FFFFFF]/60 border border-[#E8DCCF]/50">
                <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#241816]">Secure Payments &amp; COD</h3>
                <p className="text-[11px] text-[#6E5C57]">UPI, Cards, Netbanking &amp; Cash on Delivery</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer matching mockup */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* Mobile Navigation Bottom Bar */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}

export default function Home() {
  return <BoutiqueMain />;
}
