'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Search, MessageSquare } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function FaqPage() {
  const { setIsSearchOpen } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchFilter, setSearchFilter] = useState('');

  const faqs = [
    {
      category: 'Sarees & Fabrics',
      question: 'Are all Pakhi’s Collection Banarasi Sarees handwoven?',
      answer: 'Yes, our launch Banarasi silk sarees are authentic handlooms crafted by master karigars in Varanasi using wooden jacquard looms. Each saree is certified for silk purity and genuine zari weave techniques.',
    },
    {
      category: 'Sarees & Fabrics',
      question: 'Does the saree include an unstitched blouse piece?',
      answer: 'Yes! Every saree in our collection includes an attached running 0.8 to 1.0-meter matching unstitched blouse fabric piece with corresponding border detailing, ready for your local master tailor.',
    },
    {
      category: 'Care Instructions',
      question: 'How should I wash and preserve my Banarasi silk saree?',
      answer: 'Pure silk sarees with zari work must strictly be dry cleaned only. Avoid direct spraying of perfumes or water on metallic zari threads. Store your drapes wrapped in breathable pure cotton or muslin fabric in a dry, cool wardrobe and occasionally refold them along different creases.',
    },
    {
      category: 'Sizing & Fitting',
      question: 'How do I choose the correct Kurta size?',
      answer: 'Our Kurtas follow standard Indian measurement standards (XS to XXL). Each product page includes our interactive "AI Size & Fit Assistant" where you can input your bust measurement in inches to receive an instant fit recommendation with tailor ease notes.',
    },
    {
      category: 'Shipping & Delivery',
      question: 'What are your delivery charges and shipping timelines?',
      answer: 'Orders of ₹999 and above receive FREE express air delivery across India. Orders below ₹999 incur a flat ₹49 delivery fee. Parcels are dispatched within 24–48 hours from Varanasi and reach metros in 3–5 business days.',
    },
    {
      category: 'Payments & COD',
      question: 'Is Cash on Delivery (COD) available for my order?',
      answer: 'Cash on Delivery is available across 27,000+ Indian pincodes for orders up to ₹5,000. Orders exceeding ₹5,000 must be prepaid through our secure 256-bit encrypted UPI or Card gateway to safeguard high-value handloom transit.',
    },
    {
      category: 'Returns & Refunds',
      question: 'What is your return and exchange window?',
      answer: 'We provide a 7-day doorstep return and exchange window starting from the date of recorded delivery. You can log a request on our Track Order page. Once approved, our courier partner Blue Dart collects the item from your home, and full refund is settled within 3–5 business days.',
    },
    {
      category: 'Concierge & Customization',
      question: 'Can I request wedding trousseau or bulk gifting sets?',
      answer: 'Yes! Our Varanasi concierge coordinates wedding ensembles, bridesmaid sets, and bespoke corporate gifting. Contact our WhatsApp styling desk at +91 98765 43210 for curated trousseau assistance.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      !searchFilter.trim() ||
      f.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816]">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#722F3D] hover:underline font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </Link>
        </div>

        <div className="text-center space-y-3 pb-8 border-b border-[#E8DCCF]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A36B] font-semibold block font-mono">
            Help Center &amp; Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] max-w-xl mx-auto">
            Everything you need to know about our Varanasi handlooms, sizing guidance, dispatch timelines, and doorstep returns.
          </p>
        </div>

        {/* Search Bar */}
        <div className="my-8 relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E5C57]" />
          <input
            type="text"
            placeholder="Search questions (e.g. silk care, COD, returns)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DCCF] rounded-full text-xs text-[#241816] placeholder-[#6E5C57] focus:outline-none focus:ring-1 focus:ring-[#722F3D] shadow-xs"
          />
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E8DCCF] overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-xs sm:text-sm font-bold text-[#722F3D] hover:bg-[#FAF4EB]/60 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#C6A36B] block">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#722F3D] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E5C57] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#4A3B36] leading-relaxed border-t border-[#E8DCCF]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout Box */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-[#E8DCCF] text-center space-y-3 shadow-xs">
          <MessageSquare className="w-8 h-8 text-[#C6A36B] mx-auto" />
          <h3 className="font-serif text-base font-bold text-[#722F3D]">Still have a question?</h3>
          <p className="text-xs text-[#6E5C57] max-w-sm mx-auto">
            Our atelier concierge is available on WhatsApp and email to assist with custom styling and inquiries.
          </p>
          <div className="pt-1 flex items-center justify-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2 rounded-full bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold"
            >
              Contact Concierge
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
