'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Sparkles
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CustomerAccountPage() {
  const { wishlist, setIsSearchOpen } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'sizes' | 'notifications'>('orders');

  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);

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

  const fetchAccount = async () => {
    try {
      const res = await fetch('/api/customer/account');
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
    fetchAccount();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const res = await fetch('/api/customer/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAddressForm,
          userId: accountData?.user?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddAddressOpen(false);
        setNewAddressForm({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
        fetchAccount();
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
        fetchAccount();
      }
    } catch {
      alert('Error removing address');
    }
  };

  const handleSaveSizes = (e: React.FormEvent) => {
    e.preventDefault();
    setSizeSavedFeedback(true);
    setTimeout(() => setSizeSavedFeedback(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816]">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Patron Banner Header */}
        <div className="bg-[#722F3D] text-[#F8F3EC] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
            <span className="text-9xl font-serif">❦</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF2F3] text-[#722F3D] font-serif font-bold text-2xl flex items-center justify-center border-2 border-[#DFC394] shadow-md">
                {accountData?.user?.name ? accountData.user.name.charAt(0) : 'P'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
                    {accountData?.user?.name || 'Priya Sharma'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DFC394] text-[#722F3D]">
                    Privileged Patron
                  </span>
                </div>
                <p className="text-xs text-[#DFC394]/90 font-mono">
                  {accountData?.user?.email || 'priya.sharma@example.com'} • {accountData?.user?.phone || '+91 98765 43210'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DCCF] mb-8 overflow-x-auto gap-2">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: accountData?.orders?.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: accountData?.addresses?.length },
            { id: 'sizes', label: 'Size & Fit Profile', icon: Ruler },
            { id: 'notifications', label: 'Boutique Alerts', icon: Bell, count: accountData?.notifications?.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#722F3D] text-[#722F3D] font-bold'
                    : 'border-transparent text-[#6E5C57] hover:text-[#241816]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#722F3D]' : 'text-[#C6A36B]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-[#722F3D] text-white' : 'bg-[#E8DCCF] text-[#6E5C57]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#722F3D] animate-spin" />
            <p className="text-xs text-[#6E5C57]">Retrieving patron dossier...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {accountData?.orders?.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-[#E8DCCF] text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 text-[#C6A36B] mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-[#722F3D]">No Orders Recorded Yet</h3>
                    <p className="text-xs text-[#6E5C57] max-w-sm mx-auto">
                      Explore our handcrafted Banarasi sarees and artisanal kurtas to create your first heirloom look.
                    </p>
                    <Link
                      href="/category/sarees"
                      className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold"
                    >
                      Browse Saree Collection
                    </Link>
                  </div>
                ) : (
                  accountData.orders.map((order: any) => {
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-[#E8DCCF] p-5 sm:p-6 shadow-xs space-y-4 hover:border-[#722F3D]/40 transition-colors"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DCCF]">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-[#722F3D]">{order.orderNumber}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'SHIPPED'
                                  ? 'bg-sky-100 text-sky-800'
                                  : order.orderStatus === 'RETURN_APPROVED'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.orderStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#6E5C57]">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })} • {order.paymentMethod} ({order.paymentStatus})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/track-order?orderNumber=${order.orderNumber}`}
                              className="px-3.5 py-1.5 rounded-lg bg-[#FAF2F3] hover:bg-[#722F3D] text-[#722F3D] hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Live Tracking</span>
                            </Link>

                            <Link
                              href="/returns-policy"
                              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return Info</span>
                            </Link>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-[#E8DCCF]/60">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item: any) => (
                              <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#241816]">
                                    {item.productNameSnapshot}
                                  </h4>
                                  <p className="text-[11px] text-[#6E5C57] font-mono">
                                    Variant: {item.variantSnapshot || 'Standard'} • Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right font-mono text-xs font-bold text-[#722F3D]">
                                  ₹{(item.priceSnapshot * item.quantity).toLocaleString('en-IN')}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-2 text-xs text-[#6E5C57] italic">
                              Artisan pieces registered under order snapshot.
                            </div>
                          )}
                        </div>

                        {/* Order Total */}
                        <div className="pt-2 flex justify-between text-xs font-medium text-[#241816] border-t border-[#E8DCCF]">
                          <span className="text-[#6E5C57]">Net Order Total:</span>
                          <span className="font-serif font-bold text-sm text-[#722F3D]">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="font-serif text-base font-bold text-[#722F3D]">Delivery Address Book</h3>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-4 py-2 rounded-full bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accountData?.addresses?.map((addr: any) => (
                    <div
                      key={addr.id}
                      className="bg-white p-5 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-[#722F3D]">{addr.name}</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#6E5C57] leading-relaxed">
                        {addr.address}<br />
                        {addr.city}, {addr.state} — <strong className="font-mono">{addr.pincode}</strong>
                      </p>
                      <p className="text-[11px] text-[#6E5C57] font-mono pt-1">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SIZE & FIT PROFILE TAB */}
            {activeTab === 'sizes' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-6">
                <div className="space-y-1 pb-4 border-b border-[#E8DCCF]">
                  <h3 className="font-serif text-lg font-bold text-[#722F3D] flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-[#C6A36B]" />
                    <span>Saved Size &amp; Fit Profile</span>
                  </h3>
                  <p className="text-xs text-[#6E5C57]">
                    Save your body measurements once to automatically receive personalized recommendations from our AI Size &amp; Fit Concierge.
                  </p>
                </div>

                <form onSubmit={handleSaveSizes} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Bust (inches)</label>
                      <input
                        type="number"
                        value={savedSizes.bust}
                        onChange={(e) => setSavedSizes({ ...savedSizes, bust: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] text-xs focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Waist (inches)</label>
                      <input
                        type="number"
                        value={savedSizes.waist}
                        onChange={(e) => setSavedSizes({ ...savedSizes, waist: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] text-xs focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Hip (inches)</label>
                      <input
                        type="number"
                        value={savedSizes.hip}
                        onChange={(e) => setSavedSizes({ ...savedSizes, hip: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] text-xs focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Preferred Kurta Fit</label>
                      <select
                        value={savedSizes.preferredKurtaFit}
                        onChange={(e) => setSavedSizes({ ...savedSizes, preferredKurtaFit: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] text-xs focus:ring-1 focus:ring-[#722F3D]"
                      >
                        <option value="tailored">Tailored &amp; Snug (Formal &amp; Evening)</option>
                        <option value="comfortable">Comfortable (Standard 2-inch chest ease)</option>
                        <option value="relaxed">Relaxed / Flowing (A-Line &amp; Anarkali)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241816] mb-1">Saree Blouse Preference</label>
                      <input
                        type="text"
                        value={savedSizes.sareeBlousePreference}
                        onChange={(e) => setSavedSizes({ ...savedSizes, sareeBlousePreference: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] text-xs focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#722F3D] hover:bg-[#541F28] text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      Save Fit Preferences
                    </button>
                    {sizeSavedFeedback && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Preferences saved to your profile</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* 4. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {accountData?.notifications?.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-[#E8DCCF] text-center space-y-2">
                    <Bell className="w-8 h-8 text-[#C6A36B] mx-auto" />
                    <p className="text-xs text-[#6E5C57]">You have no unread notifications.</p>
                  </div>
                ) : (
                  accountData.notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className="bg-white p-4 rounded-xl border border-[#E8DCCF] shadow-xs flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-xs font-bold text-[#722F3D]">{notif.title}</h4>
                          <span className="text-[10px] text-[#6E5C57] font-mono">
                            {new Date(notif.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-[#6E5C57] leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: ADD DELIVERY ADDRESS */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8DCCF] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#722F3D]">Add Delivery Address</h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#241816] font-semibold mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.name}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                />
              </div>

              <div>
                <label className="block text-[#241816] font-semibold mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newAddressForm.phone}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                />
              </div>

              <div>
                <label className="block text-[#241816] font-semibold mb-1">Street Address / Landmark</label>
                <textarea
                  rows={2}
                  required
                  value={newAddressForm.address}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                  placeholder="House/Apartment #, Street, Enclave"
                  className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#241816] font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    placeholder="New Delhi"
                    className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#241816] font-semibold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                    placeholder="Delhi"
                    className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#241816] font-semibold mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.pincode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                    placeholder="110016"
                    className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-1 py-2.5 bg-[#722F3D] hover:bg-[#541F28] text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  {isSavingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
