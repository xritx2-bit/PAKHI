'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  AlertCircle,
  Download,
  Loader2,
  QrCode,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Order, ShippingAddress } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart, lastOrder } = useCart();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Delivery, 2 = Payment & Coupons
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Address Form State
  const [address, setAddress] = useState<ShippingAddress>({
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    addressLine: '123, Green Park, Hauz Khas Enclave',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
  });

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [upiMode, setUpiMode] = useState<'qr' | 'vpa'>('qr');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardName, setCardName] = useState('PRIYA SHARMA');
  const [showOtpChallenge, setShowOtpChallenge] = useState(false);
  const [cardOtp, setCardOtp] = useState('123456');

  if (!isOpen) return null;

  // Real-time calculations
  const rawSubtotal = cartSubtotal;
  const currentDiscount = appliedCoupon
    ? appliedCoupon.discount
    : rawSubtotal >= 2000
    ? 200
    : 0;
  const shippingFee = rawSubtotal >= 999 || rawSubtotal === 0 ? 0 : 49;
  const currentTotal = Math.max(0, rawSubtotal - currentDiscount + shippingFee);

  // COD eligibility check (Max ₹5,000 as per Section 10 of Blueprint)
  const isCodAllowed = currentTotal <= 5000;

  const handleValidateCoupon = async (codeToTest?: string) => {
    const code = (codeToTest || couponInput).trim();
    if (!code) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          subtotal: rawSubtotal,
        }),
      });

      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          message: data.message,
        });
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Unable to validate coupon right now');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const executeOrderSubmission = async () => {
    setIsProcessing(true);
    setOrderError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          address,
          paymentMethod: paymentMethod.toUpperCase(),
          couponCode: appliedCoupon?.code,
          paymentDetails: {
            method: paymentMethod,
            vpa: paymentMethod === 'upi' ? upiId : undefined,
            transactionId: `TXN_${Date.now()}`,
          },
        }),
      });

      const result = await res.json();

      if (result.success) {
        setCompletedOrder({
          ...result.data,
          items: [...cart],
        });
        clearCart();
        setShowOtpChallenge(false);
      } else {
        setOrderError(result.error || 'Failed to place order securely.');
      }
    } catch (err) {
      console.error(err);
      setOrderError('Connection error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = () => {
    if (paymentMethod === 'card') {
      setShowOtpChallenge(true);
      return;
    }
    executeOrderSubmission();
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setShowOtpChallenge(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#F8F3EC] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DCCF] text-[#241816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DCCF] flex items-center justify-between bg-[#FFFFFF] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {step === 2 && !completedOrder && (
              <button
                onClick={() => setStep(1)}
                className="p-1.5 rounded-full text-[#6E5C57] hover:bg-[#FAF2F3] hover:text-[#722F3D] transition-colors"
                title="Back to delivery address"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#722F3D]">
                {completedOrder ? 'Order Confirmed' : step === 1 ? 'Shipping Address' : 'Payment & Review'}
              </h2>
              <p className="text-xs text-[#6E5C57]">
                {completedOrder
                  ? 'Thank you for choosing Pakhi&apos;s Collection'
                  : 'Fast, secure & encrypted checkout for Indian ethnic wear'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-[#241816] hover:text-[#722F3D] rounded-full hover:bg-[#F8F3EC] transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progression Ribbon */}
        {!completedOrder && (
          <div className="bg-[#FAF2F3] px-6 py-2.5 border-b border-[#722F3D]/10">
            <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs font-medium">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#722F3D] font-bold' : 'text-[#6E5C57]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > 1 ? 'bg-[#722F3D] text-[#FFFFFF]' : 'border-2 border-[#722F3D] text-[#722F3D]'}`}>
                  1
                </span>
                <span>Delivery Address</span>
              </div>
              <div className={`h-[1px] w-8 sm:w-16 ${step >= 2 ? 'bg-[#722F3D]' : 'bg-[#E8DCCF]'}`} />
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#722F3D] font-bold' : 'text-[#6E5C57]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#722F3D] text-[#FFFFFF]' : 'border-2 border-[#E8DCCF] text-[#6E5C57]'}`}>
                  2
                </span>
                <span>Payment &amp; Verification</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {completedOrder ? (
            /* Order Placed Success View */
            <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#2D6A4F]/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#C6A36B] font-semibold">Order Confirmed</span>
                <h3 className="font-serif text-3xl font-bold text-[#722F3D] mt-1">
                  Thank You, {address.name}!
                </h3>
                <p className="text-sm text-[#6E5C57] mt-1">
                  Order <strong>#{completedOrder.orderNumber}</strong> has been secured in our database.
                </p>
              </div>

              {/* Delivery ETA card */}
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] text-left text-xs space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DCCF]">
                  <span className="text-[#6E5C57]">Estimated Delivery</span>
                  <span className="font-bold text-[#241816]">
                    {completedOrder.estimatedDelivery || '3–5 Business Days'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DCCF]">
                  <span className="text-[#6E5C57]">Payment Status</span>
                  <span className="font-bold text-[#2D6A4F]">
                    {completedOrder.paymentStatus} ({completedOrder.paymentMethod})
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DCCF]">
                  <span className="text-[#6E5C57]">Shipping Carrier</span>
                  <span className="font-bold text-[#241816]">
                    {completedOrder.courierPartner || 'Blue Dart Express'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#241816] pt-1">
                  <span>Total Amount</span>
                  <span className="font-serif text-[#722F3D]">₹{completedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/track-order"
                  onClick={handleClose}
                  className="flex-1 py-3 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Order Journey</span>
                </Link>

                <button
                  type="button"
                  onClick={() => alert(`Official GST Tax Invoice for order #${completedOrder.orderNumber} downloaded.`)}
                  className="flex-1 py-3 border border-[#E8DCCF] bg-[#FFFFFF] hover:bg-[#FAF2F3] text-xs font-semibold text-[#241816] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#722F3D]" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (7 cols): Step 1 or Step 2 */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* STEP 1: Address Form */}
                {step === 1 && (
                  <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8DCCF] shadow-xs space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#241816]">
                      Shipping &amp; Contact Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#6E5C57] mb-1 font-medium">Full Name</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] focus:ring-1 focus:ring-[#722F3D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E5C57] mb-1 font-medium">Mobile Phone (for OTP &amp; Delivery updates)</label>
                        <input
                          type="text"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] focus:ring-1 focus:ring-[#722F3D]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[#6E5C57] mb-1 font-medium">Street Address / House / Landmark</label>
                        <input
                          type="text"
                          value={address.addressLine}
                          onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] focus:ring-1 focus:ring-[#722F3D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E5C57] mb-1 font-medium">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] focus:ring-1 focus:ring-[#722F3D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E5C57] mb-1 font-medium">State</label>
                        <select
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] focus:ring-1 focus:ring-[#722F3D]"
                        >
                          <option>Delhi</option>
                          <option>Maharashtra</option>
                          <option>Karnataka</option>
                          <option>Uttar Pradesh</option>
                          <option>West Bengal</option>
                          <option>Tamil Nadu</option>
                          <option>Gujarat</option>
                          <option>Rajasthan</option>
                          <option>Telangana</option>
                          <option>Kerala</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#6E5C57] mb-1 font-medium">Pincode (6 digits)</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] focus:ring-1 focus:ring-[#722F3D]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full mt-4 py-3 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                {/* STEP 2: Payment Method, Coupons, & Authorization */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Delivery Summary Badge */}
                    <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DCCF] text-xs flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#6E5C57]">Delivering to:</p>
                        <p className="font-bold text-[#241816]">{address.name} • {address.pincode}</p>
                        <p className="text-[#6E5C57] text-[11px] line-clamp-1">{address.addressLine}, {address.city}</p>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-[#722F3D] hover:underline font-semibold"
                      >
                        Change
                      </button>
                    </div>

                    {/* Coupon Input Box */}
                    <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-xs space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#241816]">
                        <Tag className="w-4 h-4 text-[#722F3D]" />
                        <span>Apply Coupon &amp; Bank Privileges</span>
                      </div>

                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 p-3 rounded-lg text-xs">
                          <div className="flex items-center gap-2 text-[#2D6A4F]">
                            <Sparkles className="w-4 h-4 shrink-0" />
                            <span>
                              <strong>{appliedCoupon.code}</strong> applied. Saved Rs.{appliedCoupon.discount.toLocaleString('en-IN')}.
                            </span>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-[#722F3D] hover:underline font-semibold text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="Enter coupon (e.g. FESTIVE200)"
                              className="flex-1 bg-[#F8F3EC] border border-[#E8DCCF] rounded-lg px-3 py-2 text-xs uppercase text-[#241816] focus:ring-1 focus:ring-[#722F3D]"
                            />
                            <button
                              type="button"
                              onClick={() => handleValidateCoupon()}
                              disabled={isValidatingCoupon || !couponInput.trim()}
                              className="px-4 py-2 bg-[#722F3D] disabled:bg-gray-400 text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#541F28] transition-colors"
                            >
                              {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                            </button>
                          </div>

                          {couponError && (
                            <p className="text-[11px] text-[#DC2626]">{couponError}</p>
                          )}

                          {/* Quick Coupon Suggestions */}
                          <div className="flex items-center gap-2 pt-1 text-[11px]">
                            <span className="text-[#6E5C57]">Try:</span>
                            <button
                              type="button"
                              onClick={() => handleValidateCoupon('FESTIVE200')}
                              className="px-2 py-0.5 rounded bg-[#FAF2F3] text-[#722F3D] border border-[#722F3D]/20 hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors font-mono"
                            >
                              FESTIVE200
                            </button>
                            <button
                              type="button"
                              onClick={() => handleValidateCoupon('ELEGANCE10')}
                              className="px-2 py-0.5 rounded bg-[#FAF2F3] text-[#722F3D] border border-[#722F3D]/20 hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors font-mono"
                            >
                              ELEGANCE10
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Options Selection */}
                    <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8DCCF] shadow-xs space-y-4">
                      <h4 className="font-serif text-sm font-bold text-[#241816]">
                        Select Payment Method
                      </h4>

                      {/* Payment Tabs */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            paymentMethod === 'upi'
                              ? 'border-[#722F3D] bg-[#FAF2F3] text-[#722F3D] font-bold shadow-xs'
                              : 'border-[#E8DCCF] bg-[#FFFFFF] text-[#6E5C57] hover:border-[#722F3D]'
                          }`}
                        >
                          <Smartphone className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs block">UPI</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            paymentMethod === 'card'
                              ? 'border-[#722F3D] bg-[#FAF2F3] text-[#722F3D] font-bold shadow-xs'
                              : 'border-[#E8DCCF] bg-[#FFFFFF] text-[#6E5C57] hover:border-[#722F3D]'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs block">Card</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            paymentMethod === 'cod'
                              ? 'border-[#722F3D] bg-[#FAF2F3] text-[#722F3D] font-bold shadow-xs'
                              : 'border-[#E8DCCF] bg-[#FFFFFF] text-[#6E5C57] hover:border-[#722F3D]'
                          }`}
                        >
                          <Banknote className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs block">Cash On Delivery</span>
                        </button>
                      </div>

                      {/* UPI Panel */}
                      {paymentMethod === 'upi' && (
                        <div className="bg-[#F8F3EC] p-4 rounded-xl border border-[#E8DCCF] text-xs space-y-3 animate-fadeIn">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setUpiMode('qr')}
                              className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                                upiMode === 'qr' ? 'bg-[#722F3D] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#241816] border border-[#E8DCCF]'
                              }`}
                            >
                              Scan UPI QR Code
                            </button>
                            <button
                              type="button"
                              onClick={() => setUpiMode('vpa')}
                              className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                                upiMode === 'vpa' ? 'bg-[#722F3D] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#241816] border border-[#E8DCCF]'
                              }`}
                            >
                              Enter UPI ID / VPA
                            </button>
                          </div>

                          {upiMode === 'qr' ? (
                            <div className="text-center py-2 space-y-2">
                              {/* QR Representation */}
                              <div className="w-36 h-36 mx-auto bg-[#FFFFFF] p-2.5 rounded-xl border-2 border-[#722F3D] shadow-sm flex flex-col items-center justify-center">
                                <QrCode className="w-24 h-24 text-[#722F3D]" />
                                <span className="text-[9px] font-bold text-[#241816] tracking-wider mt-1">BHIM UPI QR</span>
                              </div>
                              <p className="text-[11px] text-[#6E5C57]">
                                Scan using <strong>Google Pay</strong>, <strong>PhonePe</strong>, or <strong>Paytm</strong>.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <label className="block text-[#6E5C57] font-medium">Virtual Payment Address (VPA)</label>
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@upi"
                                className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#FFFFFF] text-xs font-mono"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Panel */}
                      {paymentMethod === 'card' && (
                        <div className="bg-[#F8F3EC] p-4 rounded-xl border border-[#E8DCCF] text-xs space-y-3 animate-fadeIn">
                          <div>
                            <label className="block text-[#6E5C57] mb-1 font-medium">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#FFFFFF] font-mono text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#6E5C57] mb-1 font-medium">Expiry</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#FFFFFF] font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[#6E5C57] mb-1 font-medium">CVV</label>
                              <input
                                type="password"
                                maxLength={3}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#FFFFFF] font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[#6E5C57] mb-1 font-medium">Name on Card</label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#FFFFFF] text-xs uppercase"
                            />
                          </div>
                        </div>
                      )}

                      {/* Cash On Delivery Panel */}
                      {paymentMethod === 'cod' && (
                        <div className="bg-[#F8F3EC] p-4 rounded-xl border border-[#E8DCCF] text-xs space-y-2 animate-fadeIn">
                          {isCodAllowed ? (
                            <div>
                              <p className="font-semibold text-[#2D6A4F] flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>Eligible for Doorstep Cash on Delivery</span>
                              </p>
                              <p className="text-[11px] text-[#6E5C57] mt-1">
                                Pay in cash or through courier UPI QR upon parcel arrival. Please keep exact change ready.
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-[#FEE2E2] rounded-lg border border-[#FCA5A5] text-[#991B1B]">
                              <p className="font-bold flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>COD Not Available for High-Value Orders</span>
                              </p>
                              <p className="text-[11px] mt-0.5">
                                As per Section 10 of our policy, orders above ₹5,000 are not eligible for COD. Please choose UPI or Card.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {orderError && (
                      <p className="text-xs text-[#DC2626] bg-[#FEE2E2] p-3 rounded-lg border border-[#FCA5A5] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{orderError}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): Live Summary & Secure CTA */}
              <div className="lg:col-span-5">
                <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8DCCF] shadow-xs space-y-4 sticky top-24">
                  <h3 className="font-serif text-base font-bold text-[#241816]">Order Overview</h3>

                  {/* Items scroll */}
                  <div className="divide-y divide-[#E8DCCF]/60 max-h-44 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-12 rounded overflow-hidden bg-[#F5EBDD] shrink-0 border border-[#E8DCCF]">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-[#241816] line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-[#6E5C57]">
                              Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#241816]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-[#E8DCCF] pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-[#6E5C57]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#241816]">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {currentDiscount > 0 && (
                      <div className="flex justify-between text-[#722F3D]">
                        <span>Privilege Discount</span>
                        <span className="font-semibold">-₹{currentDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#6E5C57]">
                      <span>Shipping</span>
                      <span className="font-medium text-[#241816]">
                        {shippingFee === 0 ? <span className="text-[#2D6A4F] font-semibold">FREE</span> : `₹${shippingFee}`}
                      </span>
                    </div>

                    <div className="border-t border-[#E8DCCF] pt-2 flex justify-between text-base font-bold text-[#241816]">
                      <span>Total</span>
                      <span className="font-serif text-[#722F3D]">₹{currentTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handlePayNow}
                      disabled={isProcessing || (paymentMethod === 'cod' && !isCodAllowed) || cart.length === 0}
                      className="w-full py-3.5 bg-[#722F3D] hover:bg-[#541F28] disabled:bg-gray-400 text-[#F8F3EC] text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authorizing Payment...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-[#DFC394]" />
                          <span>
                            {paymentMethod === 'cod'
                              ? `Confirm COD Order (₹${currentTotal.toLocaleString('en-IN')})`
                              : `Pay ₹${currentTotal.toLocaleString('en-IN')} & Confirm`}
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="pt-2 text-[10px] text-center text-[#6E5C57] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>256-Bit SSL Encrypted &amp; Trusted Indian Banking</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 3D-Secure Bank OTP Challenge Modal */}
        {showOtpChallenge && (
          <div className="fixed inset-0 z-60 bg-[#241816]/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-sm w-full p-6 border border-[#E8DCCF] shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#241816]">Bank 3D-Secure Verification</h3>
                <p className="text-xs text-[#6E5C57] mt-1">
                  Enter the 6-digit OTP sent to your registered mobile ending in <strong>4321</strong> for ₹{currentTotal.toLocaleString('en-IN')}.
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={cardOtp}
                onChange={(e) => setCardOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-lg font-mono p-2.5 border-2 border-[#722F3D] rounded-lg focus:outline-none"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpChallenge(false)}
                  className="flex-1 py-2.5 border border-[#E8DCCF] text-xs font-semibold rounded-lg hover:bg-[#F8F3EC]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeOrderSubmission}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-[#722F3D] text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#541F28]"
                >
                  {isProcessing ? 'Verifying...' : 'Submit OTP'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
