'use client';

import React from 'react';
import Image from 'next/image';

interface EditorialBannerProps {
  onShopNow: () => void;
}

export default function EditorialBanner({ onShopNow }: EditorialBannerProps) {
  return (
    <section className="py-12 bg-[#F8F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8DCCF]">
          
          {/* Background image */}
          <div className="relative h-80 sm:h-96 w-full">
            <Image
              src="/images/festive-editorial.jpg"
              alt="Celebrate Tradition in Style - Pakhi's Collection"
              fill
              className="object-cover object-center"
            />
            {/* Rich gradient overlay for luxury contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#241816]/90 via-[#241816]/60 to-transparent" />
          </div>

          {/* Foreground Text & CTA */}
          <div className="absolute inset-0 flex items-center p-8 sm:p-14 lg:p-16">
            <div className="max-w-lg space-y-4 text-[#FFFFFF]">
              <span className="text-xs uppercase tracking-[0.25em] text-[#DFC394] font-semibold block">
                Heritage Celebration
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-tight">
                Celebrate Tradition <br />
                <span className="italic font-normal text-[#DFC394]">in Style</span>
              </h2>
              <p className="text-sm sm:text-base text-[#F5EBDD]/90 font-light leading-relaxed">
                From everyday elegance to grand occasions, find your perfect drape crafted with artisanal mastery.
              </p>
              <div className="pt-2">
                <button
                  onClick={onShopNow}
                  className="px-8 py-3 bg-[#C6A36B] hover:bg-[#B89355] text-[#241816] font-semibold text-xs tracking-widest uppercase rounded-md shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
