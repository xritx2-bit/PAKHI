'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Truck, ShieldCheck, Clock, MapPin, Package, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ShippingPolicyPage() {
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
            Boutique Logistics &amp; Delivery Charter
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] max-w-xl mx-auto">
            Every Pakhi&apos;s Collection heirloom drape is inspected by master artisans, packed in moisture-resistant luxury boxes, and expedited via express air logistics.
          </p>
        </div>

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="bg-white p-5 rounded-xl border border-[#E8DCCF] shadow-xs space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#722F3D]">Free Express Shipping</h3>
            <p className="text-[11px] text-[#6E5C57]">
              Complimentary on all orders ₹999 and above. Flat ₹49 for smaller orders.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8DCCF] shadow-xs space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#722F3D]">3–5 Business Days</h3>
            <p className="text-[11px] text-[#6E5C57]">
              Doorstep delivery across major Indian metros; 5–7 days for remote regional hubs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8DCCF] shadow-xs space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#722F3D]">Tamper-Proof Box</h3>
            <p className="text-[11px] text-[#6E5C57]">
              Shipped in security-sealed luxury cases with barcode tracking and insurance.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4A3B36] leading-relaxed">
          <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#E8DCCF]">
            <h2 className="font-serif text-lg font-bold text-[#722F3D] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#C6A36B]" />
              <span>1. Order Processing &amp; Dispatch Timeline</span>
            </h2>
            <p>
              All orders placed at <strong>Pakhi&apos;s Collection</strong> are routed to our central atelier in Varanasi, Uttar Pradesh. Each saree undergoes a rigorous hand-finishing check for zari integrity, falling hem consistency, and color richness before packaging.
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#6E5C57]">
              <li>Orders placed before 2:00 PM IST (Mon–Sat) are packaged and dispatched within <strong>24 to 48 hours</strong>.</li>
              <li>Orders placed on Sundays or National Holidays will be processed on the next business day.</li>
              <li>Custom saree blouse tailoring or unstitched fabric requests may require an additional 48 hours.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#E8DCCF]">
            <h2 className="font-serif text-lg font-bold text-[#722F3D] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C6A36B]" />
              <span>2. Delivery Coverage &amp; Courier Partners</span>
            </h2>
            <p>
              We service over <strong>27,000+ postal pincodes</strong> across India. To guarantee white-glove transit of fragile silk weaves, we partner exclusively with Tier-1 logistics carriers:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs font-medium text-[#722F3D]">
              <div className="p-2.5 bg-[#FDFBF7] border border-[#E8DCCF] rounded-lg">Blue Dart Express</div>
              <div className="p-2.5 bg-[#FDFBF7] border border-[#E8DCCF] rounded-lg">Delhivery Air</div>
              <div className="p-2.5 bg-[#FDFBF7] border border-[#E8DCCF] rounded-lg">DTDC Prime</div>
              <div className="p-2.5 bg-[#FDFBF7] border border-[#E8DCCF] rounded-lg">Speed Post National</div>
            </div>
          </section>

          <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#E8DCCF]">
            <h2 className="font-serif text-lg font-bold text-[#722F3D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C6A36B]" />
              <span>3. Shipping Charges &amp; Free Shipping Tiers</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E8DCCF] rounded-lg overflow-hidden">
                <thead className="bg-[#FAF2F3] text-[#722F3D] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Cart Subtotal</th>
                    <th className="p-3">Standard Delivery Fee</th>
                    <th className="p-3">Estimated Transit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCF]">
                  <tr>
                    <td className="p-3 font-semibold text-[#722F3D]">₹999 and above</td>
                    <td className="p-3 font-bold text-emerald-700">FREE (₹0.00)</td>
                    <td className="p-3 text-[#6E5C57]">3–5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#722F3D]">Below ₹999</td>
                    <td className="p-3 font-semibold text-[#722F3D]">₹49 Flat</td>
                    <td className="p-3 text-[#6E5C57]">3–5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#722F3D]">Cash on Delivery (COD)</td>
                    <td className="p-3 text-[#6E5C57]">Standard shipping applies (Available up to ₹5,000)</td>
                    <td className="p-3 text-[#6E5C57]">4–6 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#E8DCCF]">
            <h2 className="font-serif text-lg font-bold text-[#722F3D] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C6A36B]" />
              <span>4. Real-Time Tracking &amp; Delivery Alerts</span>
            </h2>
            <p>
              Once your parcel leaves our Varanasi depot, you will receive an automated SMS and email containing your direct courier tracking Airway Bill (AWB) number. You can also view live status updates at any time on our dedicated{' '}
              <Link href="/track-order" className="text-[#722F3D] font-bold underline">
                Track Order Portal
              </Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
