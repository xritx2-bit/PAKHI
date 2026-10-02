'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  onShopSarees: () => void;
  onShopKurtas: () => void;
}

export default function Hero({ onShopSarees, onShopKurtas }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F5EBDD] py-8 md:py-16 border-b border-[#E8DCCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text / CTAs */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C6A36B] font-semibold">
              Pure Handloom and Designer Edit
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#722F3D] leading-[1.15] font-bold tracking-tight">
              Banarasi Sarees <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#241816]">&amp; Kurtas</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E5C57] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Handwoven pure silk sarees from Varanasi and embroidered kurtas for festive, wedding, and everyday wear. Free shipping across India on orders above Rs.999.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onShopSarees}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#722F3D] text-[#F8F3EC] rounded-md font-medium text-sm tracking-wider uppercase hover:bg-[#541F28] transition-colors shadow-md cursor-pointer"
              >
                Shop Sarees
              </button>
              <button
                onClick={onShopKurtas}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-[#C6A36B] text-[#722F3D] hover:bg-[#C6A36B] hover:text-[#241816] rounded-md font-medium text-sm tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
              >
                Shop Kurtas
              </button>
            </div>

            {/* Value props - real facts, no fake counters */}
            <div className="pt-6 grid grid-cols-3 gap-2 border-t border-[#E8DCCF]/80 text-center lg:text-left">
              <div>
                <span className="block font-serif text-lg font-bold text-[#722F3D]">100%</span>
                <span className="text-xs text-[#6E5C57]">Authentic Silk</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#722F3D]">Free</span>
                <span className="text-xs text-[#6E5C57]">Delivery over Rs.999</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#722F3D]">7 Day</span>
                <span className="text-xs text-[#6E5C57]">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFFFFF]">
              <Image
                src="/images/hero-saree.jpg"
                alt="Banarasi silk saree from Pakhi's Collection"
                fill
                className="object-cover object-top"
                priority
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-[#C6A36B]/40 shadow-lg">
                <span className="text-xs font-serif font-bold text-[#722F3D] block">Banarasi Heritage Edition</span>
                <span className="text-[11px] text-[#6E5C57]">Handwoven Pure Zari Drapes</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
