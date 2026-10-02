'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ReturnsPolicyPage() {
  const { setIsSearchOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816]">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#722F3D] hover:underline font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="text-center space-y-3 pb-10 border-b border-[#E8DCCF]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A36B] font-semibold block font-mono">
            Hassle-Free Doorstep Exchanges &amp; Refunds
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Returns &amp; Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] max-w-xl mx-auto">
            We take immense pride in our artisan weaves. If your saree or kurta does not fulfill your expectations, we offer a seamless 7-day return and exchange policy.
          </p>
        </div>

        {/* 5-Step Process Ribbon */}
        <div className="my-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#722F3D] text-center">
            How Doorstep Returns Work at Pakhi&apos;s Collection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Submit Request', desc: 'Visit Track Order within 7 days of delivery and select Return.' },
              { step: '02', title: 'Desk Approval', desc: 'Our Varanasi boutique approves your request within 24 hours.' },
              { step: '03', title: 'Free Reverse Pickup', desc: 'Blue Dart courier collects the package from your doorstep.' },
              { step: '04', title: 'Atelier Inspection', desc: 'Craftsmen verify original tags and fabric condition.' },
              { step: '05', title: 'Instant Refund', desc: 'Full refund credited to original UPI / Bank within 3–5 days.' },
            ].map((item, idx) => (
              <div key={item.step} className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8DCCF] space-y-1.5 text-center relative">
                <span className="text-xs font-mono font-bold text-[#C6A36B] block">STEP {item.step}</span>
                <h3 className="font-serif text-xs font-bold text-[#722F3D]">{item.title}</h3>
                <p className="text-[11px] text-[#6E5C57] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Initiate a Return on an Existing Order</span>
            </Link>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-6 text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h3 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Return Eligibility Criteria</span>
            </h3>
            <p>
              To ensure our handlooms maintain the highest hygiene and preservation standards, items submitted for return must satisfy the following criteria:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#6E5C57]">
              <li>Requested within strictly <strong>7 calendar days</strong> from the official delivery date recorded by the courier.</li>
              <li>Sarees and kurtas must be unworn, unwashed, unaltered, and without fragrance or perfume odors.</li>
              <li>Original boutique security tags, blouse fabric piece (if attached), and handloom certificates must be intact.</li>
              <li>Must be placed inside the original rigid presentation box.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h3 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>2. Non-Returnable Items</span>
            </h3>
            <p className="text-xs text-[#6E5C57]">
              The following categories cannot be returned or refunded due to customization or hygiene regulations:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#6E5C57]">
              <li>Pre-stitched or tailored blouse pieces where custom body measurements were provided.</li>
              <li>Jewellery and intimate accessories with broken security seals.</li>
              <li>Items purchased during clearance or flash sale events tagged as &ldquo;Final Sale&rdquo;.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h3 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#C6A36B]" />
              <span>3. Mode of Refund &amp; Timeline</span>
            </h3>
            <p>
              Once your returned item arrives at our Varanasi atelier and passes quality inspection (usually within 24 hours of receipt):
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#6E5C57]">
              <li><strong>Prepaid Orders (UPI, Netbanking, Cards):</strong> The entire order amount will be refunded directly back to your original source account within <strong>3 to 5 business days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> Our customer concierge will contact you to transfer the refund via instant UPI or NEFT direct bank transfer.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h3 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#C6A36B]" />
              <span>4. Damaged or Defective Deliveries</span>
            </h3>
            <p>
              In the unlikely event that your parcel arrives visibly damaged or tampered with, please take a photograph of the outer package and notify us within 24 hours at <strong>support@pakhiscollection.com</strong> or via our WhatsApp Concierge. We will initiate a priority immediate replacement or 100% refund without waiting for standard transit.
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
