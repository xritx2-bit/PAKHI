'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import SearchModal from '@/components/SearchModal';
import CheckoutModal from '@/components/CheckoutModal';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    updateQuantity,
    removeFromCart,
    isSearchOpen,
    setIsSearchOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10') {
      setCouponMessage({ text: 'Coupon WELCOME10 applied! 10% discount added at checkout.', type: 'success' });
    } else if (code === 'FESTIVE500') {
      if (cartSubtotal < 2999) {
        setCouponMessage({ text: 'FESTIVE500 requires a minimum order of ₹2,999.', type: 'error' });
      } else {
        setCouponMessage({ text: 'Coupon FESTIVE500 applied! ₹500 discount added at checkout.', type: 'success' });
      }
    } else {
      setCouponMessage({ text: 'Invalid or expired promotional code.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#241816] flex flex-col font-sans">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="border-b border-[#E8DCCF] pb-5 mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A36B] font-semibold block mb-1">
            Pakhi&apos;s Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] mt-1">
            Review your handcrafted artisanal drapes and garments before proceeding to payment.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-20 h-20 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto mb-5 border border-[#722F3D]/20">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#241816] mb-2">
              Your bag is currently empty
            </h2>
            <p className="text-sm text-[#6E5C57] mb-6 leading-relaxed">
              Explore our curated collections of pure Banarasi sarees, lightweight festive georgettes, and embroidered kurtas.
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-sm font-semibold rounded-md shadow-md transition-all group"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Two Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Alert Bar */}
              <div className="bg-[#FAF2F3] border border-[#722F3D]/20 rounded-xl p-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#722F3D] flex-shrink-0" />
                <div className="flex-1 text-xs">
                  {cartSubtotal >= 999 ? (
                    <span className="font-semibold text-[#722F3D]">
                      🎉 You have unlocked Free Standard Shipping across India!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#722F3D]">₹{(999 - cartSubtotal).toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Express Shipping</strong>!
                    </span>
                  )}
                  <div className="w-full bg-[#E8DCCF] h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-[#722F3D] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (cartSubtotal / 999) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-6 shadow-xs divide-y divide-[#E8DCCF]">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5">
                    {/* Item Image */}
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-[#FAF4EB] border border-[#E8DCCF] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              className="font-serif text-base sm:text-lg font-bold text-[#241816] hover:text-[#722F3D] transition-colors"
                            >
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#6E5C57]">
                              {item.selectedColor && (
                                <span className="bg-[#FAF2F3] text-[#722F3D] px-2 py-0.5 rounded border border-[#722F3D]/10">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="bg-[#FAF4EB] px-2 py-0.5 rounded border border-[#E8DCCF]">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.blouseIncluded !== undefined && (
                                <span className="text-[11px] text-[#2D6A4F] font-medium">
                                  ✓ {item.blouseIncluded ? 'Unstitched Blouse Piece Included' : 'Drape Only'}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-[#6E5C57] hover:text-[#722F3D] hover:bg-[#FAF2F3] rounded-lg transition-colors"
                            title="Remove item"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#FAF4EB]">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#E8DCCF] rounded-lg bg-[#FAF4EB] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-sm font-semibold hover:bg-[#E8DCCF] text-[#241816] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-xs font-bold text-[#241816]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-sm font-semibold hover:bg-[#E8DCCF] text-[#241816] transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-serif text-lg font-bold text-[#722F3D]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-[#6E5C57]">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DCCF] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#C6A36B] flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#241816]">Authentic Handloom</p>
                    <p className="text-[11px] text-[#6E5C57]">Silk Mark &amp; artisan certified</p>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DCCF] flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-[#C6A36B] flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#241816]">7-Day Easy Returns</p>
                    <p className="text-[11px] text-[#6E5C57]">Doorstep reverse pickup</p>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DCCF] flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#C6A36B] flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#241816]">Express Blue Dart</p>
                    <p className="text-[11px] text-[#6E5C57]">Insured air transit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary Box */}
              <div className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-6 shadow-sm space-y-5">
                <h2 className="font-serif text-xl font-bold text-[#241816] pb-3 border-b border-[#E8DCCF]">
                  Order Summary
                </h2>

                {/* Subtotals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#6E5C57]">
                    <span>Items ({cartCount})</span>
                    <span className="font-medium text-[#241816]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#722F3D]">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#6E5C57]">
                    <span>Standard Shipping</span>
                    <span>
                      {cartShipping === 0 ? (
                        <span className="text-[#2D6A4F] font-bold">FREE</span>
                      ) : (
                        `₹${cartShipping}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-[#E8DCCF] pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-bold text-[#241816] block">Total Amount</span>
                      <span className="text-[10px] text-[#6E5C57]">Inclusive of all GST &amp; handloom taxes</span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#722F3D]">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Form */}
                <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-[#E8DCCF]/60">
                  <label htmlFor="coupon-input" className="block text-xs font-semibold text-[#241816] mb-1.5">
                    Have a promo coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon-input"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg uppercase tracking-wider text-[#241816] focus:outline-none focus:border-[#722F3D]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#241816] hover:bg-[#722F3D] text-[#FFFFFF] text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] mt-2 ${couponMessage.type === 'success' ? 'text-[#2D6A4F] font-semibold' : 'text-[#DC2626]'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </form>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[11px] text-[#6E5C57]">
                  Instant UPI, Cards &amp; Cash on Delivery available at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
