'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useCart } from '@/lib/cart-context';

export default function TrackOrderPage() {
  const { orders, lastOrder, setIsSearchOpen } = useCart();

  const [inputOrderNumber, setInputOrderNumber] = useState(
    lastOrder?.orderNumber || (orders.length > 0 ? orders[0].orderNumber : 'PK-842913')
  );

  const [searchedOrder, setSearchedOrder] = useState<any>(
    lastOrder || (orders.length > 0 ? orders[0] : {
      id: 'ord-mock-default',
      orderNumber: 'PK-842913',
      createdAt: 'Oct 02, 2026',
      estimatedDelivery: 'Oct 05, 2026 (3-4 Business Days)',
      courierPartner: 'Blue Dart Express',
      trackingAwb: 'BD-IND-94810294',
      status: 'SHIPPED', // CONFIRMED | PROCESSING | PACKED | SHIPPED | DELIVERED
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      subtotal: 2698,
      discount: 200,
      shipping: 0,
      total: 2498,
      address: {
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        addressLine: '123, Green Park, Hauz Khas Enclave',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016'
      },
      items: [
        {
          id: 'item-1',
          name: 'Royal Blue Banarasi Silk Saree',
          price: 1999,
          quantity: 1,
          image: '/images/banarasi-blue.jpg',
          selectedColor: 'Royal Blue',
          blouseIncluded: true,
        },
        {
          id: 'item-2',
          name: 'Embroidered Kurta',
          price: 699,
          quantity: 1,
          image: '/images/embroidered-kurta.jpg',
          selectedColor: 'Blush Pink',
          selectedSize: 'M',
        }
      ]
    })
  );

  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const clean = inputOrderNumber.trim().toUpperCase();

    // Check user's stored orders first
    const found = orders.find((o) => o.orderNumber.toUpperCase() === clean);
    if (found) {
      setSearchedOrder({
        ...found,
        courierPartner: 'Delhivery Surface',
        trackingAwb: `DEL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      });
      return;
    }

    if (clean === 'PK-842913' || clean === 'PK842913') {
      setSearchedOrder({
        id: 'ord-mock-default',
        orderNumber: 'PK-842913',
        createdAt: 'Oct 02, 2026',
        estimatedDelivery: 'Oct 05, 2026',
        courierPartner: 'Blue Dart Express',
        trackingAwb: 'BD-IND-94810294',
        status: 'SHIPPED',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        subtotal: 2698,
        discount: 200,
        shipping: 0,
        total: 2498,
        address: {
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          addressLine: '123, Green Park, Hauz Khas Enclave',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016'
        },
        items: [
          {
            id: 'item-1',
            name: 'Royal Blue Banarasi Silk Saree',
            price: 1999,
            quantity: 1,
            image: '/images/banarasi-blue.jpg',
            selectedColor: 'Royal Blue',
          },
          {
            id: 'item-2',
            name: 'Embroidered Kurta',
            price: 699,
            quantity: 1,
            image: '/images/embroidered-kurta.jpg',
            selectedColor: 'Blush Pink',
          }
        ]
      });
      return;
    }

    setSearchError(`Order "${clean}" could not be located. Try entering order PK-842913 or your newly placed order number.`);
  };

  // Tracking timeline steps
  const steps = [
    { title: 'Order Confirmed', desc: 'Placed & verified', stepKey: 'CONFIRMED' },
    { title: 'Artisan Quality Check', desc: 'Fabric & weave audited', stepKey: 'PROCESSING' },
    { title: 'Packed at Atelier', desc: 'Enclosed in muslin cover', stepKey: 'PACKED' },
    { title: 'In Transit', desc: searchedOrder?.courierPartner || 'Dispatched via Express Courier', stepKey: 'SHIPPED' },
    { title: 'Delivered', desc: 'Doorstep handover', stepKey: 'DELIVERED' },
  ];

  const getStepStatus = (stepKey: string) => {
    const orderStatus = searchedOrder?.status || 'CONFIRMED';
    const hierarchy = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = hierarchy.indexOf(orderStatus);
    const stepIndex = hierarchy.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC]">
      {/* Navbar */}
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Breadcrumb Bar */}
      <div className="bg-[#FAF2F3] border-b border-[#E8DCCF]/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#6E5C57]">
            <Link href="/" className="hover:text-[#722F3D]">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#C6A36B]" />
            <span className="text-[#241816] font-medium">Track Order</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A36B] font-semibold block mb-1">
            Real-Time Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241816]">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] mt-2">
            Enter your 8-digit order number (e.g. <strong>PK-842913</strong>) to check the live journey of your handcrafted ethnic attire.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputOrderNumber}
                onChange={(e) => setInputOrderNumber(e.target.value)}
                placeholder="Enter Order # (e.g. PK-842913)"
                className="w-full bg-[#FFFFFF] border border-[#E8DCCF] rounded-lg pl-4 pr-10 py-3 text-xs sm:text-sm text-[#241816] focus:outline-none focus:ring-2 focus:ring-[#722F3D] uppercase shadow-xs"
              />
              <Search className="w-4 h-4 text-[#6E5C57] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#722F3D] text-[#F8F3EC] rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#541F28] transition-colors shadow-md shrink-0"
            >
              Track
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-[#DC2626] mt-3 bg-[#FEE2E2] p-2.5 rounded-lg border border-[#FCA5A5] flex items-center justify-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </p>
          )}
        </div>

        {searchedOrder && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Order Summary Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E8DCCF] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl font-bold text-[#722F3D]">
                    #{searchedOrder.orderNumber}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2D6A4F]/10 text-[#2D6A4F] uppercase tracking-wider">
                    {searchedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-[#6E5C57] mt-1">
                  Placed on {searchedOrder.createdAt} • Carrier: <strong className="text-[#241816]">{searchedOrder.courierPartner || 'Blue Dart Express'}</strong>
                </p>
                {searchedOrder.trackingAwb && (
                  <p className="text-xs text-[#6E5C57] mt-0.5">
                    AWB Tracking Code: <strong className="text-[#241816] font-mono">{searchedOrder.trackingAwb}</strong>
                  </p>
                )}
              </div>

              <div className="bg-[#FAF2F3] px-5 py-3 rounded-xl border border-[#722F3D]/10 text-right self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end">
                <span className="text-[11px] text-[#6E5C57]">Estimated Delivery</span>
                <span className="font-serif text-base font-bold text-[#722F3D] block">
                  {searchedOrder.estimatedDelivery || 'Oct 05, 2026'}
                </span>
              </div>
            </div>

            {/* Visual Step-by-Step Progress Timeline */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E8DCCF] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#241816] mb-8">
                Delivery Journey
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative">
                {steps.map((st, i) => {
                  const status = getStepStatus(st.stepKey);
                  return (
                    <div key={i} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 relative group">
                      {/* Connecting Line between steps on desktop */}
                      {i < steps.length - 1 && (
                        <div
                          className={`hidden sm:block absolute top-4 left-1/2 w-full h-[3px] -z-0 transition-colors ${
                            status === 'completed' ? 'bg-[#722F3D]' : 'bg-[#E8DCCF]'
                          }`}
                        />
                      )}

                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          status === 'completed'
                            ? 'bg-[#722F3D] text-[#FFFFFF]'
                            : status === 'current'
                            ? 'bg-[#DFC394] text-[#241816] ring-4 ring-[#DFC394]/30'
                            : 'bg-[#F8F3EC] text-[#6E5C57] border border-[#E8DCCF]'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="sm:mt-2">
                        <p className={`text-xs font-bold ${status !== 'upcoming' ? 'text-[#241816]' : 'text-[#6E5C57]'}`}>
                          {st.title}
                        </p>
                        <p className="text-[10px] text-[#6E5C57] mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2-Column Info Grid: Items + Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Items Card (7 cols) */}
              <div className="md:col-span-7 bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8DCCF] shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#241816]">
                  Attire in this Parcel ({searchedOrder.items?.length || 0})
                </h3>

                <div className="divide-y divide-[#E8DCCF]/60">
                  {searchedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#F5EBDD] shrink-0 border border-[#E8DCCF]">
                          <Image
                            src={item.image || '/images/hero-saree.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-xs sm:text-sm text-[#241816]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#6E5C57] mt-0.5">
                            Qty: {item.quantity} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-serif text-sm font-bold text-[#722F3D]">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8DCCF] pt-3 space-y-1.5 text-xs text-[#6E5C57]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#241816]">₹{searchedOrder.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {searchedOrder.discount > 0 && (
                    <div className="flex justify-between text-[#722F3D]">
                      <span>Discount</span>
                      <span>-₹{searchedOrder.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#2D6A4F] font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-[#E8DCCF] pt-2 flex justify-between text-sm font-bold text-[#241816]">
                    <span>Total Amount Paid</span>
                    <span className="font-serif text-[#722F3D]">₹{searchedOrder.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Address & Payment Details (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                {/* Destination */}
                <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8DCCF] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#722F3D]">
                    <MapPin className="w-4 h-4" />
                    <span>Delivery Address</span>
                  </div>
                  <div className="text-xs text-[#6E5C57] leading-relaxed">
                    <p className="font-bold text-[#241816] text-sm">{searchedOrder.address?.name}</p>
                    <p>{searchedOrder.address?.addressLine}</p>
                    <p>{searchedOrder.address?.city}, {searchedOrder.address?.state} – {searchedOrder.address?.pincode}</p>
                    <p className="mt-2 text-[#241816]">Phone: {searchedOrder.address?.phone}</p>
                  </div>
                </div>

                {/* Payment & Security */}
                <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8DCCF] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#722F3D]">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Information</span>
                  </div>
                  <div className="text-xs text-[#6E5C57] space-y-1">
                    <p>Method: <strong className="text-[#241816]">{searchedOrder.paymentMethod || 'UPI'}</strong></p>
                    <p>Status: <strong className="text-[#2D6A4F]">{searchedOrder.paymentStatus || 'PAID'}</strong></p>
                    <p className="text-[11px] text-[#6E5C57] mt-2">
                      Protected by 256-bit SSL encryption &amp; RBI compliance.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8DCCF]/60 flex gap-2">
                    <button
                      onClick={() => alert(`Official tax invoice for #${searchedOrder.orderNumber} downloaded.`)}
                      className="flex-1 py-2 rounded-lg border border-[#E8DCCF] text-xs font-semibold text-[#241816] hover:bg-[#FAF2F3] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#722F3D]" />
                      <span>Invoice</span>
                    </button>
                    <button
                      onClick={() => alert("Our concierge team is available at support@pakhiscollection.com or +91 99999 88888.")}
                      className="flex-1 py-2 rounded-lg bg-[#FAF2F3] text-xs font-semibold text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Support</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
