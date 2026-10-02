'use client';

import React from 'react';
import Image from 'next/image';
import { OCCASIONS } from '@/lib/products-data';

interface ShopByOccasionProps {
  selectedOccasion: string | null;
  onSelectOccasion: (occasion: string) => void;
}

export default function ShopByOccasion({ selectedOccasion, onSelectOccasion }: ShopByOccasionProps) {
  return (
    <section className="py-14 bg-[#F5EBDD] border-t border-b border-[#E8DCCF]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#241816] font-bold">
            Shop by Occasion
          </h2>
          <div className="h-0.5 w-12 bg-[#C6A36B] mx-auto mt-2" />
        </div>

        {/* 5 Circular Occasion Items */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 overflow-x-auto pb-4 no-scrollbar">
          {OCCASIONS.map((item) => {
            const isSelected = selectedOccasion === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onSelectOccasion(item.name)}
                className="group flex flex-col items-center flex-shrink-0 focus:outline-none transition-transform hover:-translate-y-1"
              >
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 shadow-md ${
                    isSelected
                      ? 'ring-4 ring-[#722F3D] ring-offset-2 ring-offset-[#F5EBDD] scale-105'
                      : 'border-2 border-[#C6A36B]/60 group-hover:border-[#722F3D]'
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                <span
                  className={`mt-3 text-xs sm:text-sm font-medium tracking-wide transition-colors ${
                    isSelected
                      ? 'text-[#722F3D] font-bold'
                      : 'text-[#241816] group-hover:text-[#722F3D]'
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[10px] text-[#6E5C57]">
                  {item.count} Styles
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
