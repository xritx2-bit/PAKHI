'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ContactPage() {
  const { setIsSearchOpen } = useCart();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Custom Tailoring Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'Order & Custom Tailoring Inquiry', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816]">
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
            Personal Styling &amp; Atelier Support
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#722F3D]">
            Boutique Concierge &amp; Contact
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C57] max-w-xl mx-auto">
            Whether you seek custom blouse measurements, fabric consultations, or delivery assistance, our Varanasi concierge team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-10">
          {/* Left Column: Direct Channels */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#722F3D]">Boutique Showroom</h3>

              <div className="space-y-4 text-xs text-[#4A3B36]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#241816]">Pakhi&apos;s Atelier Showroom</strong>
                    <p className="text-[#6E5C57] leading-relaxed">
                      Ghat Atelier, Dashashwamedh Road,<br />
                      Varanasi, Uttar Pradesh, 221001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#241816]">Concierge Hotline</strong>
                    <a href="tel:+919876543210" className="text-[#722F3D] font-mono hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#241816]">WhatsApp Styling Desk</strong>
                    <a
                      href="https://wa.me/919876543210?text=Hello%20Pakhi's%20Collection,%20I%20would%20like%20styling%20advice"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-mono hover:underline flex items-center gap-1"
                    >
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#241816]">Email Support</strong>
                    <a href="mailto:support@pakhiscollection.com" className="text-[#722F3D] font-mono hover:underline">
                      support@pakhiscollection.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#241816]">Operating Hours</strong>
                    <p className="text-[#6E5C57]">
                      Mon – Sat: 10:00 AM – 8:00 PM IST<br />
                      Sunday: 11:00 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DCCF] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#722F3D]">Send an Inquiry to Our Stylists</h3>

              {formSubmitted ? (
                <div className="p-6 bg-[#FAF2F3] border border-[#722F3D]/20 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#722F3D] mx-auto" />
                  <h4 className="font-serif text-base font-bold text-[#722F3D]">Inquiry Received with Thanks</h4>
                  <p className="text-xs text-[#6E5C57] max-w-sm mx-auto">
                    A boutique concierge specialist will contact you within 2 to 4 business hours via phone or email.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-3 text-xs text-[#722F3D] font-semibold underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#241816] font-semibold mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Priya Sharma"
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#241816] font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="priya@example.com"
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#241816] font-semibold mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#241816] font-semibold mb-1">Inquiry Nature</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                      >
                        <option value="Order & Custom Tailoring Inquiry">Order &amp; Custom Tailoring Inquiry</option>
                        <option value="Saree Fabric & Zari Guidance">Saree Fabric &amp; Zari Guidance</option>
                        <option value="Wedding Trousseau Consultation">Wedding Trousseau Consultation</option>
                        <option value="Shipping & Delivery Status">Shipping &amp; Delivery Status</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#241816] font-semibold mb-1">How May We Assist You?</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your requirements or questions..."
                      className="w-full p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E8DCCF] focus:ring-1 focus:ring-[#722F3D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#722F3D] hover:bg-[#541F28] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Message to Concierge</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
