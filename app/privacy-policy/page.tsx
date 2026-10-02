'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function PrivacyPolicyPage() {
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
            Data Protection &amp; Customer Privacy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] max-w-xl mx-auto">
            Effective Date: October 2, 2026. Pakhi&apos;s Collection is committed to preserving the privacy and trust of our esteemed patrons across India.
          </p>
        </div>

        <div className="space-y-6 my-10 text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C6A36B]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you browse our boutique or complete an order for our Banarasi silk sarees or designer kurtas, we collect necessary personal identifiers to deliver your purchase:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#6E5C57]">
              <li><strong>Contact Information:</strong> Name, delivery address, postal pincode, email address, and phone number for delivery SMS coordination.</li>
              <li><strong>Order Data:</strong> Selected saree/kurta items, sizes, custom tailoring preferences, and billing records.</li>
              <li><strong>Device &amp; Session Insights:</strong> IP addresses, browser types, and anonymous cookie data used to maintain your shopping cart and wishlist across sessions.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C6A36B]" />
              <span>2. Payment Security &amp; Tokenization</span>
            </h2>
            <p>
              <strong>We never store raw credit card, debit card, or UPI PIN credentials on our servers.</strong> All online transactions are encrypted via industry-grade 256-bit TLS encryption through RBI-authorized payment aggregators (Razorpay / Cashfree). Your payments are processed in compliance with PCI-DSS Level 1 specifications.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#C6A36B]" />
              <span>3. How We Use &amp; Share Your Data</span>
            </h2>
            <p>
              We adhere to the <strong>Digital Personal Data Protection Act (DPDPA 2023)</strong> and do not sell, rent, or trade your data to third-party advertising brokers. Your information is shared only with:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#6E5C57]">
              <li><strong>Courier Partners (Blue Dart, Delhivery):</strong> Solely to print shipping labels and fulfill delivery to your doorstep.</li>
              <li><strong>Transactional Communication Providers:</strong> To send order confirmation, dispatch updates, and OTP authentications.</li>
              <li><strong>Legal Compliance:</strong> When strictly mandated by statutory Indian authorities or law enforcement agencies.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#E8DCCF] space-y-3">
            <h2 className="font-serif text-base font-bold text-[#722F3D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C6A36B]" />
              <span>4. Your Rights &amp; Grievance Redressal</span>
            </h2>
            <p>
              You have the right to request access to your personal data, rectify inaccurate details, or request deletion of your boutique customer account. For any privacy queries or data protection officer inquiries:
            </p>
            <div className="p-3 bg-[#FAF2F3] rounded-lg border border-[#722F3D]/20 text-xs font-mono text-[#722F3D]">
              Grievance Officer: Ritesh Sharma<br />
              Email: privacy@pakhiscollection.com<br />
              Atelier Address: Ghat Atelier, Dashashwamedh Road, Varanasi, UP 221001
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
