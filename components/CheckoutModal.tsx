'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, CreditCard, Smartphone, Banknote, ShieldCheck, CheckCircle2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Order, ShippingAddress } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, cartSubtotal, cartDiscount, cartShipping, cartTotal, placeOrder } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    addressLine: '123, Green Park, Hauz Khas Enclave',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    const order = placeOrder(address, paymentMethod);
    setCompletedOrder(order);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#F8F3EC] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DCCF] text-[#241816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DCCF] flex items-center justify-between bg-[#FFFFFF]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#722F3D]">Checkout</h2>
            <p className="text-xs text-[#6E5C57]">Fast, secure &amp; encrypted Indian checkout</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-[#241816] hover:text-[#722F3D] rounded-full hover:bg-[#F8F3EC]"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Ribbon */}
        {!completedOrder && (
          <div className="bg-[#FAF2F3] px-6 py-3 border-b border-[#722F3D]/10">
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs font-medium">
              <div className="flex items-center gap-2 text-[#722F3D]">
                <span className="w-5 h-5 rounded-full bg-[#722F3D] text-[#FFFFFF] flex items-center justify-center text-[10px] font-bold">✓</span>
                <span className="font-semibold">1. Delivery</span>
              </div>
              <div className="h-[1px] w-8 sm:w-12 bg-[#722F3D]/40" />
              <div className="flex items-center gap-2 text-[#722F3D]">
                <span className="w-5 h-5 rounded-full bg-[#722F3D] text-[#FFFFFF] flex items-center justify-center text-[10px] font-bold">2</span>
                <span className="font-semibold">Payment</span>
              </div>
              <div className="h-[1px] w-8 sm:w-12 bg-[#E8DCCF]" />
              <div className="flex items-center gap-2 text-[#6E5C57]">
                <span className="w-5 h-5 rounded-full border border-[#E8DCCF] flex items-center justify-center text-[10px]">3</span>
                <span>Review</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {completedOrder ? (
            /* Order Placed Success View */
            <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#C6A36B] font-semibold">Thank You!</span>
                <h3 className="font-serif text-3xl font-bold text-[#722F3D] mt-1">Order Confirmed</h3>
                <p className="text-sm text-[#6E5C57] mt-1">
                  Order <strong>#{completedOrder.orderNumber}</strong> has been successfully placed.
                </p>
              </div>

              {/* Order Lifecycle Timeline from Blueprint Section 11 */}
              <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8DCCF] shadow-sm text-left">
                <h4 className="font-serif text-sm font-bold text-[#241816] mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#722F3D]" />
                  <span>Delivery Tracking Status</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DCCF]">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#2D6A4F] ring-4 ring-[#2D6A4F]/20" />
                    <p className="text-xs font-semibold text-[#2D6A4F]">CONFIRMED</p>
                    <p className="text-[11px] text-[#6E5C57]">Payment verified &amp; order accepted by Pakhi&apos;s Collection.</p>
                  </div>
                  <div className="relative opacity-60">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#E8DCCF]" />
                    <p className="text-xs font-medium text-[#241816]">PROCESSING &amp; QUALITY CHECK</p>
                    <p className="text-[11px] text-[#6E5C57]">Handloom artisans inspection.</p>
                  </div>
                  <div className="relative opacity-60">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#E8DCCF]" />
                    <p className="text-xs font-medium text-[#241816]">SHIPPED &amp; OUT FOR DELIVERY</p>
                    <p className="text-[11px] text-[#6E5C57]">Estimated {completedOrder.estimatedDelivery}.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF2F3] p-4 rounded-lg text-xs text-[#6E5C57] text-left space-y-1">
                <p><strong>Deliver to:</strong> {completedOrder.address.name} ({completedOrder.address.phone})</p>
                <p>{completedOrder.address.addressLine}, {completedOrder.address.city}, {completedOrder.address.state} - {completedOrder.address.pincode}</p>
                <p><strong>Payment Method:</strong> {completedOrder.paymentMethod.toUpperCase()} ({completedOrder.paymentStatus})</p>
                <p><strong>Total Amount:</strong> ₹{completedOrder.total.toLocaleString('en-IN')}</p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-3 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-xs font-semibold uppercase tracking-wider rounded-md shadow-md transition-all"
              >
                Back to Boutique
              </button>
            </div>
          ) : (
            /* Main Checkout View matching mockup */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Delivery Address & Payment Method */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Delivery Address Card */}
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-base font-bold text-[#241816]">Delivery Address</h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-xs font-semibold text-[#722F3D] hover:underline"
                    >
                      {isEditingAddress ? 'Done' : 'Change'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-[#6E5C57] mb-1">Full Name</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          className="w-full p-2 border border-[#E8DCCF] rounded bg-[#F8F3EC]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[#6E5C57] mb-1">Street Address</label>
                        <input
                          type="text"
                          value={address.addressLine}
                          onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                          className="w-full p-2 border border-[#E8DCCF] rounded bg-[#F8F3EC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E5C57] mb-1">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full p-2 border border-[#E8DCCF] rounded bg-[#F8F3EC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E5C57] mb-1">Pincode</label>
                        <input
                          type="text"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full p-2 border border-[#E8DCCF] rounded bg-[#F8F3EC]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#6E5C57] leading-relaxed">
                      <p className="font-semibold text-[#241816] text-sm">{address.name}</p>
                      <p>{address.addressLine}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p className="mt-1 text-[#241816]">Mobile: {address.phone}</p>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector matching mockup */}
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-sm">
                  <h3 className="font-serif text-base font-bold text-[#241816] mb-4">Payment Method</h3>

                  <div className="space-y-3">
                    {/* UPI */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#722F3D] bg-[#FAF2F3] shadow-xs'
                          : 'border-[#E8DCCF] hover:bg-[#F8F3EC]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 text-[#722F3D] focus:ring-[#722F3D]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#241816]">UPI (Instant &amp; Zero Fee)</span>
                          <Smartphone className="w-4 h-4 text-[#722F3D]" />
                        </div>
                        <p className="text-xs text-[#6E5C57] mt-0.5">Pay via Google Pay, PhonePe, Paytm, or BHIM UPI.</p>
                      </div>
                    </label>

                    {/* Credit / Debit Card */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#722F3D] bg-[#FAF2F3] shadow-xs'
                          : 'border-[#E8DCCF] hover:bg-[#F8F3EC]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-[#722F3D] focus:ring-[#722F3D]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#241816]">Credit / Debit Card</span>
                          <CreditCard className="w-4 h-4 text-[#722F3D]" />
                        </div>
                        <p className="text-xs text-[#6E5C57] mt-0.5">Visa, Mastercard, RuPay &amp; American Express.</p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#722F3D] bg-[#FAF2F3] shadow-xs'
                          : 'border-[#E8DCCF] hover:bg-[#F8F3EC]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-[#722F3D] focus:ring-[#722F3D]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#241816]">Cash on Delivery</span>
                          <Banknote className="w-4 h-4 text-[#722F3D]" />
                        </div>
                        <p className="text-xs text-[#6E5C57] mt-0.5">Pay in cash or UPI QR upon courier delivery.</p>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary Card matching mockup */}
              <div className="lg:col-span-5">
                <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#E8DCCF] shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#241816]">Order Summary</h3>

                  {/* Item List */}
                  <div className="divide-y divide-[#E8DCCF]/60 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-12 rounded overflow-hidden bg-[#F5EBDD] flex-shrink-0 border border-[#E8DCCF]">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-[#241816] line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-[#6E5C57]">Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#241816]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="border-t border-[#E8DCCF] pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-[#6E5C57]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#241816]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-[#722F3D]">
                        <span>Festive Discount</span>
                        <span className="font-semibold">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#6E5C57]">
                      <span>Shipping</span>
                      <span className="font-medium text-[#241816]">
                        {cartShipping === 0 ? <span className="text-[#2D6A4F] font-semibold">FREE</span> : `₹${cartShipping}`}
                      </span>
                    </div>
                    <div className="border-t border-[#E8DCCF] pt-2 flex justify-between text-base font-bold text-[#241816]">
                      <span>Total</span>
                      <span className="font-serif text-[#722F3D]">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0}
                    className="w-full py-3.5 bg-[#722F3D] hover:bg-[#541F28] disabled:bg-gray-400 text-[#F8F3EC] text-sm font-semibold rounded-md shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Place Order</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E5C57] pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#C6A36B]" />
                    <span>256-Bit SSL Encrypted &amp; Verified</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
