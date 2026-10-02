'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface ShopByCategoryProps {
  onSelectCategory: (category: 'sarees' | 'kurtas') => void;
}

export default function ShopByCategory({ onSelectCategory }: ShopByCategoryProps) {
  return (
    <section className="py-16 md:py-24 bg-[#F8F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Lotus Motif */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#241816] font-bold tracking-tight">
            Shop by Category
          </h2>
          {/* Subtle Lotus / Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-[1px] w-12 bg-[#C6A36B]" />
            <span className="text-[#C6A36B] text-lg">❦</span>
            <div className="h-[1px] w-12 bg-[#C6A36B]" />
          </div>
          <p className="text-sm text-[#6E5C57] font-light">
            Curated ensembles honoring timeless Indian artisanal heritage.
          </p>
        </div>

        {/* 2 Category Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Sarees Card */}
          <div 
            onClick={() => onSelectCategory('sarees')}
            className="group cursor-pointer relative bg-[#F5EBDD] rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/category-saree.jpg"
                alt="Sarees - Grace in every drape"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241816]/70 via-[#241816]/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-[#FFFFFF] flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.25em] text-[#DFC394] font-medium mb-1">
                Collection
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mb-1">
                SAREES
              </h3>
              <p className="text-sm text-[#F5EBDD]/90 mb-4 font-light">
                Grace in every drape
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[#DFC394] group-hover:text-[#FFFFFF] transition-colors">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Kurtas Card */}
          <div 
            onClick={() => onSelectCategory('kurtas')}
            className="group cursor-pointer relative bg-[#F5EBDD] rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/category-kurta.jpg"
                alt="Kurtas - Comfort in every step"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241816]/70 via-[#241816]/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-[#FFFFFF] flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.25em] text-[#DFC394] font-medium mb-1">
                Collection
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mb-1">
                KURTAS
              </h3>
              <p className="text-sm text-[#F5EBDD]/90 mb-4 font-light">
                Comfort in every step
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[#DFC394] group-hover:text-[#FFFFFF] transition-colors">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
