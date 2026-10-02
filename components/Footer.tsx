'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (cat: 'sarees' | 'kurtas') => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="about-section" className="bg-[#FAF4EB] border-t border-[#E8DCCF] text-[#241816] pt-16 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E8DCCF]">
          
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C6A36B]/50 shadow-sm">
                <Image src="/logo.jpg" alt="Pakhi's Collection" fill className="object-cover" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-[#722F3D] block">
                  Pakhi&apos;s
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#C6A36B] -mt-1 block font-medium">
                  Collection
                </span>
              </div>
            </div>
            
            <p className="font-serif italic text-sm text-[#722F3D]">
              &ldquo;Elegance in Every Thread&rdquo;
            </p>

            <p className="text-xs text-[#6E5C57] leading-relaxed max-w-sm">
              Celebrating India&apos;s royal weaving traditions with heirloom Banarasi silk sarees, ethereal georgettes, and artisan-crafted modern kurtas.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8DCCF] flex items-center justify-center text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-all" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8DCCF] flex items-center justify-center text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-all" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E8DCCF] flex items-center justify-center text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-all" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (Cols 5-7) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-serif text-sm font-bold text-[#241816] tracking-wide mb-3">Shop</h4>
              <ul className="space-y-2 text-xs text-[#6E5C57]">
                <li>
                  {onSelectCategory ? (
                    <button onClick={() => onSelectCategory('sarees')} className="hover:text-[#722F3D]">Sarees</button>
                  ) : (
                    <Link href="/category/sarees" className="hover:text-[#722F3D]">Sarees</Link>
                  )}
                </li>
                <li>
                  {onSelectCategory ? (
                    <button onClick={() => onSelectCategory('kurtas')} className="hover:text-[#722F3D]">Kurtas</button>
                  ) : (
                    <Link href="/category/kurtas" className="hover:text-[#722F3D]">Kurtas</Link>
                  )}
                </li>
                <li><Link href="/category/all" className="hover:text-[#722F3D]">All Collections</Link></li>
                <li><Link href="/wishlist" className="hover:text-[#722F3D]">My Wishlist</Link></li>
                <li><Link href="/about" className="hover:text-[#722F3D]">Our Story</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#241816] tracking-wide mb-3">Help &amp; Orders</h4>
              <ul className="space-y-2 text-xs text-[#6E5C57]">
                <li><Link href="/track-order" className="hover:text-[#722F3D] font-medium text-[#722F3D]">Track Order</Link></li>
                <li><Link href="/account" className="hover:text-[#722F3D]">My Account</Link></li>
                <li><Link href="/contact" className="hover:text-[#722F3D]">Concierge &amp; Contact</Link></li>
                <li><Link href="/faq" className="hover:text-[#722F3D]">Boutique FAQ</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-[#722F3D]">Shipping Info</Link></li>
                <li><Link href="/returns-policy" className="hover:text-[#722F3D]">Returns Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Box matching bottom-right of mockup */}
            <div className="bg-[#722F3D] rounded-xl p-5 text-[#F8F3EC] shadow-md relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1 z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#DFC394]">Artisanal Boutique</span>
                <h4 className="font-serif text-xl font-bold tracking-wide">
                  Classic Styles. <br />
                  <span className="italic font-normal text-[#DFC394]">Timeless Beauty.</span>
                </h4>
              </div>
              <div className="text-4xl text-[#C6A36B]/20 font-serif select-none" aria-hidden="true">|</div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <p className="text-xs font-medium text-[#241816] mb-2">Join our newsletter for exclusive previews &amp; festive discounts</p>
              {subscribed ? (
                <div className="p-3 bg-[#FAF2F3] border border-[#722F3D]/20 rounded-md text-xs text-[#722F3D] font-medium">
                  ✓ Welcome to the Pakhi&apos;s Circle. Check your inbox for 10% off your first drape.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E8DCCF] rounded-md text-[#241816] placeholder:text-[#6E5C57] focus:outline-none focus:border-[#722F3D]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#722F3D] hover:bg-[#541F28] text-[#FFFFFF] rounded-md transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E5C57] gap-2 text-center sm:text-left">
          <p>© 2026 Pakhi&apos;s Collection. All rights reserved. Handcrafted with reverence in India.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-[#722F3D]">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#722F3D]">Terms &amp; Conditions</Link>
            <span>•</span>
            <Link
              href={process.env.NEXT_PUBLIC_ADMIN_URL || "/admin"}
              className="hover:text-[#722F3D] text-[#6E5C57]/60"
            >
              Staff Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
