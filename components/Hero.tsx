'use client';

import React from 'react';
import Image from 'next/image';

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2F3] border border-[#722F3D]/20 text-[#722F3D] text-xs font-medium tracking-wide">
              <span>Pure Handloom & Designer Edit</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#722F3D] leading-[1.15] font-bold tracking-tight">
              Elegance <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#241816]">in Every Thread</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E5C57] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Timeless Sarees &amp; Kurtas for Every Occasion. Immerse yourself in authentic Indian heritage, pure silk weaves, and effortless silhouettes designed to celebrate you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onShopSarees}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#722F3D] text-[#F8F3EC] rounded-md font-medium text-sm tracking-wider uppercase hover:bg-[#541F28] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Shop Sarees
              </button>
              <button
                onClick={onShopKurtas}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-[#C6A36B] text-[#722F3D] hover:bg-[#C6A36B] hover:text-[#241816] rounded-md font-medium text-sm tracking-wider uppercase transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                Shop Kurtas
              </button>
            </div>

            {/* Micro value badges */}
            <div className="pt-6 grid grid-cols-3 gap-2 border-t border-[#E8DCCF]/80 text-center lg:text-left">
              <div>
                <span className="block font-serif text-lg font-bold text-[#722F3D]">100%</span>
                <span className="text-xs text-[#6E5C57]">Authentic Silk</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#722F3D]">5000+</span>
                <span className="text-xs text-[#6E5C57]">Happy Customers</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-[#722F3D]">Pan India</span>
                <span className="text-xs text-[#6E5C57]">Express Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFFFFF]">
              <Image
                src="/images/hero-saree.jpg"
                alt="Pakhi's Collection Elegance in Every Thread"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241816]/40 via-transparent to-transparent pointer-events-none" />
              
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
