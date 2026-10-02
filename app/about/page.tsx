'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Sparkles, Heart, Award, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function AboutPage() {
  const { setIsSearchOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816]">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#FAF4EB] border-b border-[#E8DCCF] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 space-y-4 relative z-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C6A36B] font-semibold font-mono block">
              Varanasi Handloom Legacy
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#722F3D] leading-tight">
              Elegance in Every Thread
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#6E5C57] max-w-2xl mx-auto">
              Heirloom Banarasi silk sarees, pure georgettes, and modern designer kurtas, woven with generations of reverence.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C6A36B] font-bold">
                The Atelier Genesis
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#722F3D]">
                Rooted in the Sacred Weaving Ghats of Kashi
              </h2>
              <p className="text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
                Founded with a singular devotion to preserve India&apos;s royal textile heritage, <strong>Pakhi&apos;s Collection</strong> bridges centuries-old handloom mastery with contemporary silhouettes. From our central atelier in Varanasi, our master karigars spend upwards of 30 to 45 days meticulously hand-weaving individual katan silk drapes using antique wooden jacquard looms.
              </p>
              <p className="text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
                Every motif, from the traditional <em>Kalka</em> paisley and floral <em>Jaal</em> to geometric architectural borders, tells a story of Indian artistic heritage.
              </p>
            </div>

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-[#E8DCCF]">
              <Image
                src="/hero_banner_artisan.png"
                alt="Pakhi's Collection Handloom Atelier"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Core Values Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-2.5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5 text-[#C6A36B]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#722F3D]">Authentic Handloom</h3>
              <p className="text-xs text-[#6E5C57] leading-relaxed">
                100% genuine silk, tested zari threads, and certified handloom provenance. No machine prints masquerading as handcraft.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-2.5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5 text-[#722F3D]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#722F3D]">Artisan Sustenance</h3>
              <p className="text-xs text-[#6E5C57] leading-relaxed">
                We work directly with third-generation weaving families, ensuring fair compensation and dignified artisan livelihoods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-2.5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
                <Award className="w-5 h-5 text-[#C6A36B]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#722F3D]">Heirloom Quality</h3>
              <p className="text-xs text-[#6E5C57] leading-relaxed">
                Designed to be cherished across generations, passed down from mother to daughter as treasured family heirlooms.
              </p>
            </div>
          </div>

          {/* Call to Explore */}
          <div className="bg-[#722F3D] text-[#F8F3EC] p-8 sm:p-10 rounded-2xl text-center space-y-4 shadow-lg">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Experience the Drape of Indian Royalty</h3>
            <p className="text-xs sm:text-sm text-[#DFC394] max-w-xl mx-auto">
              Explore our launch collections of Banarasi Sarees and designer Kurtas, delivered complimentary across India on orders above ₹999.
            </p>
            <div className="pt-2">
              <Link
                href="/category/sarees"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DFC394] hover:bg-[#C6A36B] text-[#722F3D] text-xs font-bold shadow-md transition-colors"
              >
                <span>Explore Saree Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
