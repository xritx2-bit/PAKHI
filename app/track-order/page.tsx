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
  ShieldCheck,
  RotateCcw,
  X,
  Loader2
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
      courierPartner: 'Blue Dart Express Air',
      trackingAwb: 'BD-IND-94810294',
      status: 'SHIPPED', // CONFIRMED | PROCESSING | PACKED | SHIPPED | DELIVERED | RETURN_REQUESTED
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      subtotal: 2698,
      discount: 200,
      shipping: 0,
      total: 2498,
      isReturnEligible: false,
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
          image: '/images/cotton-printed-kurta.jpg',
          selectedColor: 'Blush Pink',
          selectedSize: 'M',
        }
      ]
    })
  );

  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Return modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Fabric / color differs from screen');
  const [returnNotes, setReturnNotes] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setIsSearching(true);
    const clean = inputOrderNumber.trim().toUpperCase();

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (data.success && data.data) {
        const orderData = data.data;
        setSearchedOrder({
          ...orderData,
          status: orderData.orderStatus,
          address: orderData.shippingAddress,
          items: orderData.items?.map((item: any) => ({
            id: item.id,
            name: item.productNameSnapshot,
            price: item.priceSnapshot,
            quantity: item.quantity,
            selectedColor: item.variantSnapshot || 'Standard',
            image: item.productNameSnapshot?.toLowerCase().includes('kurta')
              ? '/images/cotton-printed-kurta.jpg'
              : '/images/hero-saree.jpg',
          })),
        });
      } else {
        // Check user's stored orders fallback
        const found = orders.find((o) => o.orderNumber.toUpperCase() === clean);
        if (found) {
          setSearchedOrder({
            ...found,
            courierPartner: 'Blue Dart Express Air',
            trackingAwb: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
          });
        } else {
          setSearchError(data.error || `Order "${clean}" could not be located.`);
        }
      }
    } catch {
      setSearchError('Error connecting to tracking service. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Submit return request
  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReturn(true);

    try {
      const res = await fetch('/api/orders/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: searchedOrder.id,
          reason: `${returnReason}${returnNotes ? ` — ${returnNotes}` : ''}`,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setReturnSuccessMessage(data.message);
        setSearchedOrder((prev: any) => ({
          ...prev,
          status: 'RETURN_REQUESTED',
        }));
        setTimeout(() => {
          setIsReturnModalOpen(false);
          setReturnSuccessMessage(null);
        }, 2000);
      } else {
        alert(data.error || 'Failed to submit return request');
      }
    } catch {
      alert('Network error while requesting return');
    } finally {
      setIsSubmittingReturn(false);
    }
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

    if (orderStatus === 'RETURN_REQUESTED') {
      return 'completed';
    }

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
            Enter your order number (e.g. <strong>PK-842913</strong>) to check the live journey of your handcrafted ethnic attire.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputOrderNumber}
                onChange={(e) => setInputOrderNumber(e.target.value)}
                placeholder="Enter Order # (e.g. PK-842913)"
                className="w-full px-4 py-3 pl-10 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E8DCCF] rounded-xl text-[#241816] placeholder:text-[#6E5C57] focus:outline-none focus:border-[#722F3D] shadow-sm uppercase font-mono tracking-wider"
              />
              <Search className="w-4 h-4 text-[#6E5C57] absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-[#722F3D] hover:bg-[#541F28] text-[#FFFFFF] text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Track</span>}
            </button>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-[#FAF2F3] border border-[#722F3D]/20 rounded-xl text-xs text-[#722F3D] flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {searchedOrder && (
          <div className="space-y-8 animate-fadeIn">
            {/* Status Hero Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E8DCCF] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DCCF] gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#722F3D] tracking-wider">
                      {searchedOrder.orderNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                        searchedOrder.status === 'DELIVERED'
                          ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/30'
                          : searchedOrder.status === 'RETURN_REQUESTED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : searchedOrder.status === 'SHIPPED'
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : 'bg-[#C6A36B]/20 text-[#722F3D] border border-[#C6A36B]/40'
                      }`}
                    >
                      {searchedOrder.status === 'RETURN_REQUESTED' ? 'RETURN REQUESTED' : searchedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E5C57] mt-1">
                    Booked on {new Date(searchedOrder.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#6E5C57] uppercase tracking-wider block">
                    Estimated Delivery
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base text-[#241816]">
                    {searchedOrder.estimatedDelivery || '3–4 Business Days'}
                  </span>
                </div>
              </div>

              {/* Courier Partner & AWB */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-[#E8DCCF] text-xs">
                <div>
                  <span className="text-[#6E5C57] block">Courier Partner</span>
                  <strong className="text-[#241816] font-medium">{searchedOrder.courierPartner || 'Blue Dart Express Air'}</strong>
                </div>
                <div>
                  <span className="text-[#6E5C57] block">AWB / Air Waybill Code</span>
                  <strong className="text-[#722F3D] font-mono">{searchedOrder.trackingAwb || 'BD-IND-94810294'}</strong>
                </div>
                <div>
                  <span className="text-[#6E5C57] block">Destination Pincode</span>
                  <strong className="text-[#241816] font-medium">{searchedOrder.address?.pincode || '110016'}</strong>
                </div>
              </div>

              {/* Stepper Timeline */}
              <div className="pt-8 pb-4">
                <div className="relative">
                  <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-[#E8DCCF] -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {steps.map((st, idx) => {
                      const stStatus = getStepStatus(st.stepKey);
                      return (
                        <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all shadow-xs ${
                              stStatus === 'completed'
                                ? 'bg-[#2D6A4F] text-[#FFFFFF]'
                                : stStatus === 'current'
                                ? 'bg-[#722F3D] text-[#FFFFFF] ring-4 ring-[#722F3D]/20 animate-pulse'
                                : 'bg-[#FFFFFF] text-[#6E5C57] border-2 border-[#E8DCCF]'
                            }`}
                          >
                            {stStatus === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <div>
                            <p className={`font-serif text-xs font-bold ${
                              stStatus === 'current' ? 'text-[#722F3D]' : 'text-[#241816]'
                            }`}>
                              {st.title}
                            </p>
                            <p className="text-[10px] text-[#6E5C57] hidden sm:block">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items & Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Items in Consignment (7 cols) */}
              <div className="md:col-span-7 bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8DCCF] shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#241816]">
                  Consignment Items ({searchedOrder.items?.length || 1})
                </h3>

                <div className="divide-y divide-[#E8DCCF]/60">
                  {searchedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#F5EBDD] border border-[#E8DCCF] shrink-0">
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
                            Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
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
                    <span className="font-semibold text-[#241816]">₹{searchedOrder.subtotal?.toLocaleString('en-IN') || searchedOrder.total}</span>
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

              {/* Address, Payment & Returns (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                {/* Destination */}
                <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8DCCF] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#722F3D]">
                    <MapPin className="w-4 h-4" />
                    <span>Delivery Address</span>
                  </div>
                  <div className="text-xs text-[#6E5C57] leading-relaxed">
                    <p className="font-bold text-[#241816] text-sm">{searchedOrder.address?.name || 'Customer'}</p>
                    <p>{searchedOrder.address?.addressLine || searchedOrder.address?.address || '123 Fashion Ave'}</p>
                    <p>{searchedOrder.address?.city}, {searchedOrder.address?.state} – {searchedOrder.address?.pincode}</p>
                    <p className="mt-2 text-[#241816]">Phone: {searchedOrder.address?.phone || '+91 98765 43210'}</p>
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

                  {/* Return Request Button / Status */}
                  <div className="pt-3 border-t border-[#E8DCCF]/60 space-y-2">
                    {searchedOrder.status === 'DELIVERED' && (
                      <button
                        onClick={() => setIsReturnModalOpen(true)}
                        className="w-full py-2.5 rounded-lg bg-[#FAF2F3] border border-[#722F3D]/30 text-xs font-semibold text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request 7-Day Return / Exchange</span>
                      </button>
                    )}

                    {searchedOrder.status === 'RETURN_REQUESTED' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
                        <p className="font-bold flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                          <span>Return Pickup Scheduled</span>
                        </p>
                        <p className="text-[11px] text-amber-700">
                          Blue Dart reverse logistics pickup scheduled within 48–72 hours. Please preserve original tags.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
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

          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* 7-DAY RETURN / EXCHANGE MODAL              */}
      {/* ========================================== */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF4EB] border border-[#E8DCCF] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCF]">
              <div className="flex items-center gap-2 text-[#722F3D]">
                <RotateCcw className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-[#241816]">
                  7-Day Return &amp; Exchange Request
                </h3>
              </div>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="p-1 rounded-full text-[#6E5C57] hover:text-[#241816]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-3.5 text-xs text-[#241816]">
              <p className="text-[11px] text-[#6E5C57]">
                Pakhi&apos;s Collection guarantees a 7-day hassle-free doorstep return. Please ensure the security tag remains attached and the item is in unworn condition.
              </p>

              <div>
                <label className="block text-[#6E5C57] mb-1 font-semibold">Select Return Reason</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8DCCF] text-xs focus:outline-none focus:ring-1 focus:ring-[#722F3D]"
                >
                  <option>Fabric / color differs from screen</option>
                  <option>Size or fit issue</option>
                  <option>Weave / stitching irregularity</option>
                  <option>Package arrived damaged</option>
                  <option>Changed mind / Gift not required</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6E5C57] mb-1 font-semibold">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Share details to assist our quality check team..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8DCCF] text-xs placeholder:text-[#6E5C57] focus:outline-none focus:ring-1 focus:ring-[#722F3D]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E8DCCF] text-[11px] space-y-1 text-[#6E5C57]">
                <p className="font-semibold text-[#241816]">Free Reverse Logistics Pickup:</p>
                <p>• Blue Dart courier will pick up from: {searchedOrder.address?.city || 'Your Address'}</p>
                <p>• Refund of ₹{searchedOrder.total?.toLocaleString('en-IN')} initiated upon atelier inspection</p>
              </div>

              {returnSuccessMessage && (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-center font-semibold">
                  ✓ {returnSuccessMessage}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#FFFFFF] border border-[#E8DCCF] rounded-lg hover:bg-[#FAF2F3] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReturn}
                  className="flex-1 py-2.5 bg-[#722F3D] hover:bg-[#541F28] text-[#FFFFFF] rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingReturn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Return Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
