'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Bell,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Loader2,
  Clock,
  Sparkles,
  Phone,
  KeyRound,
  LogOut,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CustomerAccountPage() {
  const { wishlist, setIsSearchOpen } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'sizes' | 'notifications'>('orders');

  // Customer Session & OTP Authentication State
  const [customerUser, setCustomerUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);

  // OTP Login Form State
  const [phoneInput, setPhoneInput] = useState('9876543210');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Add Address Modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Saved Size Preferences state (persisted locally)
  const [savedSizes, setSavedSizes] = useState({
    bust: '36',
    waist: '30',
    hip: '38',
    height: '5 ft 4 in',
    preferredKurtaFit: 'comfortable',
    sareeBlousePreference: 'With standard unstitched blouse piece',
  });
  const [sizeSavedFeedback, setSizeSavedFeedback] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const fetchAccount = async (userId?: string) => {
    try {
      setLoading(true);
      const url = userId ? `/api/customer/account?userId=${userId}` : '/api/customer/account';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setAccountData(data.data);
      }
    } catch (err) {
      console.error('Failed to load account:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check existing customer session from localStorage
    const saved = localStorage.getItem('pakhi_customer_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomerUser(parsed);
        fetchAccount(parsed.id);
      } catch {
        fetchAccount();
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Handle Requesting OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          phone: phoneInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpTimer(60);
        setAuthSuccessMsg(`OTP sent to ${data.phone}. Use demo code ${data.devOtp || '123456'} to log in.`);
        if (data.devOtp) {
          setOtpInput(data.devOtp);
        }
      } else {
        setAuthError(data.error || 'Failed to send OTP. Please check the mobile number.');
      }
    } catch {
      setAuthError('Connection error sending OTP. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Verifying OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          phone: phoneInput.trim(),
          otp: otpInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('pakhi_customer_user', JSON.stringify(data.user));
        setCustomerUser(data.user);
        fetchAccount(data.user.id);
      } else {
        setAuthError(data.error || 'Invalid OTP code. Please try again.');
      }
    } catch {
      setAuthError('Network error verifying OTP.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('pakhi_customer_user');
    setCustomerUser(null);
    setAccountData(null);
    setOtpSent(false);
    setOtpInput('');
    setAuthSuccessMsg(null);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const res = await fetch('/api/customer/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAddressForm,
          userId: customerUser?.id || accountData?.user?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddAddressOpen(false);
        setNewAddressForm({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
        fetchAccount(customerUser?.id);
      } else {
        alert(data.error || 'Failed to save address');
      }
    } catch {
      alert('Error saving address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    try {
      const res = await fetch(`/api/customer/account?addressId=${addressId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchAccount(customerUser?.id);
      }
    } catch {
      alert('Error removing address');
    }
  };

  const handleSaveSizes = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pakhi_customer_sizes', JSON.stringify(savedSizes));
    setSizeSavedFeedback(true);
    setTimeout(() => setSizeSavedFeedback(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816]">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* ========================================================= */}
        {/* VIEW 1: CUSTOMER NOT LOGGED IN -> OTP AUTHENTICATION GATE */}
        {/* ========================================================= */}
        {!customerUser ? (
          <div className="max-w-md mx-auto my-6 animate-fadeIn">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8DCCF] shadow-xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF2F3] rounded-bl-full pointer-events-none opacity-60" />
              
              <div className="text-center space-y-3 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#FAF2F3] border border-[#722F3D]/20 text-[#722F3D] flex items-center justify-center mx-auto shadow-sm">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A36B] font-bold block font-mono">
                    Artisanal Boutique
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#722F3D] mt-1">
                    Customer Account
                  </h1>
                </div>
                <p className="text-xs text-[#6E5C57]">
                  Instant passwordless login via Indian mobile number &amp; SMS OTP
                </p>
              </div>

              {/* Status & Feedback Messages */}
              {authError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg text-center animate-fadeIn">
                  {authError}
                </div>
              )}
              {authSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg text-center animate-fadeIn">
                  {authSuccessMsg}
                </div>
              )}

              {/* STEP 1: ENTER PHONE NUMBER */}
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#241816] mb-1.5">
                      Mobile Phone Number
                    </label>
                    <div className="flex items-center rounded-lg border border-[#E8DCCF] bg-[#FAF4EB] focus-within:border-[#722F3D] focus-within:ring-1 focus-within:ring-[#722F3D] overflow-hidden">
                      <span className="px-3.5 py-2.5 text-xs font-semibold text-[#722F3D] border-r border-[#E8DCCF] bg-[#F2E8DC]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="10-digit mobile (e.g. 9876543210)"
                        className="flex-1 px-3.5 py-2.5 text-xs text-[#241816] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP via SMS...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        <span>Send Verification OTP</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneInput('9876543210');
                        handleSendOtp();
                      }}
                      className="text-[11px] text-[#722F3D] hover:underline font-medium"
                    >
                      Use Demo Patron Number (+91 98765 43210)
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: ENTER 6-DIGIT OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-[#241816]">
                        Enter 6-Digit SMS OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#722F3D] hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="flex items-center rounded-lg border border-[#E8DCCF] bg-[#FAF4EB] focus-within:border-[#722F3D] focus-within:ring-1 focus-within:ring-[#722F3D] overflow-hidden">
                      <span className="px-3.5 py-2.5 text-xs font-semibold text-[#722F3D] border-r border-[#E8DCCF] bg-[#F2E8DC]">
                        <KeyRound className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="e.g. 123456"
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-[#241816] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Verify OTP &amp; Log In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-[#6E5C57] pt-1">
                    <span>
                      {otpTimer > 0 ? (
                        <>Resend code in <strong className="text-[#722F3D]">{otpTimer}s</strong></>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-[#722F3D] font-bold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Resend OTP Code
                        </button>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpInput('123456');
                      }}
                      className="text-[#C6A36B] hover:underline"
                    >
                      Autofill Code (123456)
                    </button>
                  </div>
                </form>
              )}

              {/* Guarantees Footer */}
              <div className="mt-8 pt-5 border-t border-[#E8DCCF] flex items-center justify-center gap-4 text-[11px] text-[#6E5C57]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C6A36B]" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A36B]" />
                  <span>No Password Required</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: AUTHENTICATED PATRON ACCOUNT DASHBOARD            */
          /* ========================================================= */
          <div>
            {/* Patron Banner Header */}
            <div className="bg-[#722F3D] text-[#F8F3EC] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden mb-8">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
                <span className="text-9xl font-serif opacity-30 select-none" aria-hidden="true">P</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAF2F3] text-[#722F3D] font-serif font-bold text-2xl flex items-center justify-center border-2 border-[#DFC394] shadow-md">
                    {customerUser?.name ? customerUser.name.charAt(0) : (accountData?.user?.name ? accountData.user.name.charAt(0) : 'P')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
                        {customerUser?.name || accountData?.user?.name || 'Privileged Patron'}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DFC394] text-[#722F3D]">
                        Privileged Patron
                      </span>
                    </div>
                    <p className="text-xs text-[#DFC394]/90 font-mono">
                      {customerUser?.phone || accountData?.user?.phone || '+91 98765 43210'} • {customerUser?.email || accountData?.user?.email || 'patron@pakhiscollection.com'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/wishlist"
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#DFC394]" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </Link>
                  <Link
                    href="/track-order"
                    className="px-4 py-2 rounded-full bg-[#DFC394] hover:bg-[#C6A36B] text-[#722F3D] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Active Order</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3.5 py-2 rounded-full bg-black/20 hover:bg-black/30 border border-white/20 text-xs font-medium flex items-center gap-1.5 text-rose-200 hover:text-white transition-colors cursor-pointer"
                    title="Sign Out of Boutique"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#E8DCCF] mb-8 overflow-x-auto gap-2 sm:gap-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#722F3D] text-[#722F3D]'
                    : 'border-transparent text-[#6E5C57] hover:text-[#241816]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders &amp; Drapes ({accountData?.orders?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'border-[#722F3D] text-[#722F3D]'
                    : 'border-transparent text-[#6E5C57] hover:text-[#241816]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses ({accountData?.addresses?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('sizes')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'sizes'
                    ? 'border-[#722F3D] text-[#722F3D]'
                    : 'border-transparent text-[#6E5C57] hover:text-[#241816]'
                }`}
              >
                <Ruler className="w-4 h-4" />
                <span>Tailoring &amp; Size Specs</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'border-[#722F3D] text-[#722F3D]'
                    : 'border-transparent text-[#6E5C57] hover:text-[#241816]'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Dispatch Updates ({accountData?.notifications?.length || 0})</span>
              </button>
            </div>

            {/* TAB CONTENT: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {accountData?.orders && accountData.orders.length > 0 ? (
                  accountData.orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-6 shadow-xs hover:border-[#722F3D]/30 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DCCF]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#722F3D]">{order.orderNumber}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                              order.orderStatus === 'DELIVERED' ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-[#FAF2F3] text-[#722F3D]'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#6E5C57] block mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/track-order?orderId=${order.orderNumber}`}
                            className="px-4 py-1.5 rounded-lg border border-[#722F3D] text-[#722F3D] hover:bg-[#722F3D] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <span>Live Tracker</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          {order.orderStatus === 'DELIVERED' && (
                            <Link
                              href="/returns-policy"
                              className="px-4 py-1.5 rounded-lg bg-[#FAF2F3] text-[#722F3D] hover:bg-[#722F3D]/20 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>7-Day Return</span>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="divide-y divide-[#E8DCCF]/50">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-semibold text-[#241816]">{item.productNameSnapshot}</p>
                              {item.variantSnapshot && <p className="text-[11px] text-[#6E5C57]">{item.variantSnapshot}</p>}
                            </div>
                            <div className="text-right">
                              <span className="font-serif font-bold text-[#722F3D]">₹{item.priceSnapshot.toLocaleString('en-IN')}</span>
                              <span className="text-[11px] text-[#6E5C57] block">Qty: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Totals */}
                      <div className="pt-3 border-t border-[#E8DCCF] flex justify-between items-center text-xs">
                        <span className="text-[#6E5C57]">
                          Paid via <strong className="uppercase text-[#241816]">{order.paymentMethod}</strong>
                        </span>
                        <div className="text-right">
                          <span className="text-[11px] text-[#6E5C57]">Total: </span>
                          <span className="font-serif text-base font-bold text-[#722F3D]">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-10 text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 text-[#C6A36B] mx-auto stroke-1" />
                    <h3 className="font-serif text-lg font-bold text-[#241816]">No Past Orders Found</h3>
                    <p className="text-xs text-[#6E5C57] max-w-sm mx-auto">
                      You haven&apos;t placed any orders with this phone number yet. Explore our handcrafted sarees to make your first purchase.
                    </p>
                    <Link
                      href="/category/all"
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#722F3D] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-[#541F28] transition-colors mt-2"
                    >
                      <span>Explore Drapes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#241816]">Delivery Address Book</h2>
                    <p className="text-xs text-[#6E5C57]">Manage your home, festive residence, and workplace shipping destinations.</p>
                  </div>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-4 py-2 bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Destination</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountData?.addresses?.map((addr: any) => (
                    <div key={addr.id} className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-5 shadow-xs relative group flex flex-col justify-between">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#241816]">{addr.name}</span>
                          <span className="text-[10px] font-mono font-bold bg-[#FAF2F3] text-[#722F3D] px-2 py-0.5 rounded">
                            {addr.city}
                          </span>
                        </div>
                        <p className="text-[#6E5C57] leading-relaxed pt-1">{addr.address}</p>
                        <p className="text-[#6E5C57]">
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-[#6E5C57] pt-1">
                          Contact: <strong>{addr.phone}</strong>
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E8DCCF]/60 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: TAILORING & SIZES */}
            {activeTab === 'sizes' && (
              <div className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl">
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-[#722F3D]">Boutique Tailoring Profile</h2>
                  <p className="text-xs text-[#6E5C57] mt-1">
                    Save your body specifications for effortless size recommendations and unstitched blouse preferences.
                  </p>
                </div>

                {sizeSavedFeedback && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Measurements updated! Our AI Stylist will customize recommendations to this profile.</span>
                  </div>
                )}

                <form onSubmit={handleSaveSizes} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Bust (inches)</label>
                      <input
                        type="text"
                        value={savedSizes.bust}
                        onChange={(e) => setSavedSizes({ ...savedSizes, bust: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Waist (inches)</label>
                      <input
                        type="text"
                        value={savedSizes.waist}
                        onChange={(e) => setSavedSizes({ ...savedSizes, waist: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Hip (inches)</label>
                      <input
                        type="text"
                        value={savedSizes.hip}
                        onChange={(e) => setSavedSizes({ ...savedSizes, hip: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#241816] mb-1">Kurta Fit Silhouette</label>
                    <select
                      value={savedSizes.preferredKurtaFit}
                      onChange={(e) => setSavedSizes({ ...savedSizes, preferredKurtaFit: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    >
                      <option value="fitted">Tailored / Contoured Fit</option>
                      <option value="comfortable">Comfortable Regular Indian Silhouette</option>
                      <option value="relaxed">Relaxed / Flowing Festive Anarkali</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#241816] mb-1">Saree Blouse Handling</label>
                    <select
                      value={savedSizes.sareeBlousePreference}
                      onChange={(e) => setSavedSizes({ ...savedSizes, sareeBlousePreference: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    >
                      <option value="With standard unstitched blouse piece">Always include complimentary 0.8m unstitched pure silk blouse piece</option>
                      <option value="Drape Only">Drape Only (No extra blouse piece)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer mt-2"
                  >
                    Save Tailoring Profile
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-[#FFFFFF] border border-[#E8DCCF] rounded-2xl p-6 shadow-xs space-y-4 max-w-3xl">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#241816]">Transactional Dispatch Alerts</h2>
                  <p className="text-xs text-[#6E5C57]">Live tracking and order confirmation messages sent to your mobile &amp; email.</p>
                </div>

                <div className="divide-y divide-[#E8DCCF]/60">
                  {accountData?.notifications && accountData.notifications.length > 0 ? (
                    accountData.notifications.map((notif: any) => (
                      <div key={notif.id} className="py-4 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-[#241816]">{notif.title}</h4>
                            <span className="text-[10px] text-[#6E5C57]">
                              {new Date(notif.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-[#6E5C57] leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-[#6E5C57]">
                      No transactional notifications at this time.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODAL: ADD DELIVERY DESTINATION */}
        {isAddAddressOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8DCCF] p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8DCCF] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#722F3D]">New Delivery Address</h3>
                <button
                  onClick={() => setIsAddAddressOpen(false)}
                  className="text-gray-400 hover:text-black p-1 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#241816] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    placeholder="Recipient's Name"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#241816] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#241816] mb-1">Street Address / House No.</label>
                  <textarea
                    required
                    rows={2}
                    value={newAddressForm.address}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    placeholder="Flat/House, Wing, Street, Landmark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#241816] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddressForm.city}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#241816] mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddressForm.state}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[#241816] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddressForm.pincode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DCCF] rounded-lg focus:outline-none focus:border-[#722F3D]"
                    placeholder="110016"
                  />
                </div>

                <div className="pt-3 border-t border-[#E8DCCF] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(false)}
                    className="px-4 py-2 border border-[#E8DCCF] rounded-lg hover:bg-gray-50 text-[#6E5C57] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="px-5 py-2 bg-[#722F3D] hover:bg-[#541F28] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingAddress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Save Address</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
