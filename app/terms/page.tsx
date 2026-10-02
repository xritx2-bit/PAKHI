'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Scale, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function TermsPage() {
  const { setIsSearchOpen } = useCart();

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

        <div className="text-center space-y-3 pb-10 border-b border-[#E8DCCF]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A36B] font-semibold block font-mono">
            Boutique Operational Terms &amp; Conditions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Terms &amp; Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] max-w-xl mx-auto">
            Please read these terms carefully before acquiring our artisan handlooms and designer ethnic garments.
          </p>
        </div>

        <div className="space-y-6 my-10 text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C6A36B]" />
              <span>1. Handloom Characteristics &amp; Variations</span>
            </h2>
            <p>
              Many of our sarees and kurtas are woven by hand on traditional wooden looms in Varanasi. Minor irregularities in weave texture, zari knots, or subtle yarn shading are intrinsic hallmarks of authentic Indian handlooms, not factory defects. We strive to present color accuracy; however, monitor calibrations may cause slight optical variance.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C6A36B]" />
              <span>2. Pricing, Taxes &amp; Currency</span>
            </h2>
            <p>
              All prices displayed on <strong>Pakhi&apos;s Collection</strong> are quoted in Indian Rupees (₹ / INR) and are inclusive of all applicable Goods and Services Taxes (GST). We reserve the right to revise catalog pricing, seasonal promotions, and discount coupon limits without prior notice.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C6A36B]" />
              <span>3. Cash on Delivery (COD) Rules</span>
            </h2>
            <p>
              To protect valuable handloom inventory during inter-state express transit, Cash on Delivery is strictly capped at a <strong>maximum order total of ₹5,000</strong>. Orders exceeding ₹5,000 must be prepaid through our secure online payment portal (UPI or Cards).
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C6A36B]" />
              <span>4. Intellectual Property &amp; Legal Jurisdiction</span>
            </h2>
            <p>
              All textile designs, motif artwork, photography, branding, and copywriting are the proprietary intellectual property of <strong>Pakhi&apos;s Collection</strong>. Any reproduction or unauthorized commercial exploitation is strictly prohibited under Indian Copyright and Trademark laws. Any legal proceedings arising from transactions on this platform shall be subject to the exclusive jurisdiction of the courts in Varanasi, Uttar Pradesh.
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
