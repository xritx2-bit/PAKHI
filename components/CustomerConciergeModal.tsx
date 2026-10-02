'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'concierge';
  text: string;
  links?: Array<{ label: string; href: string }>;
}

export default function CustomerConciergeModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'concierge',
      text: 'Namaste! Welcome to Pakhi’s Collection. I am your Royal Stylist & Care Concierge. How may I assist your festive wardrobe journey today?',
    },
  ]);

  // Keep admin panel completely isolated from customer widgets
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSend = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'concierge',
            text: data.answer,
            links: data.quickLinks,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'concierge',
            text: 'I apologize, but I could not retrieve that policy detail at the moment. Please contact our boutique support.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'concierge',
          text: 'Our styling desk is momentarily offline. Feel free to browse our launch collections!',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: 'Silk Saree Care', query: 'How do I care for and store my Banarasi silk saree?' },
    { label: 'Shipping & Delivery', query: 'What are your delivery timelines and free shipping threshold?' },
    { label: 'Cash on Delivery (COD)', query: 'What are the rules for Cash on Delivery?' },
    { label: '7-Day Return Policy', query: 'What is your return and exchange policy?' },
  ];

  return (
    <>
      {/* Floating Concierge Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border border-[#DFC394]/60 cursor-pointer group"
          aria-label="Open Royal Concierge"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#DFC394] animate-pulse" />
          <Sparkles className="w-4 h-4 text-[#DFC394] group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-xs font-semibold tracking-wide">
            Ask Royal Concierge
          </span>
        </button>
      )}

      {/* Concierge Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-[#FAF4EB] border border-[#E8DCCF] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#722F3D] text-[#F8F3EC] p-4 flex items-center justify-between border-b border-[#DFC394]/30">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DFC394] shrink-0">
                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#DFC394] leading-tight">
                  Pakhi&apos;s Royal Concierge
                </h4>
                <p className="text-[10px] text-[#F8F3EC]/80 font-mono">
                  Artisanal Care &amp; Store Policies
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#F8F3EC]/70 hover:text-[#FFFFFF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-[#F4ECE1] px-3 py-2 border-b border-[#E8DCCF] flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E8DCCF] text-[#722F3D] hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors font-medium cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#722F3D] text-[#F8F3EC] rounded-tr-none'
                      : 'bg-[#FFFFFF] text-[#241816] border border-[#E8DCCF] rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>

                {/* Quick Links if provided */}
                {m.links && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {m.links.map((link, lIdx) => (
                      <Link
                        key={lIdx}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#722F3D] bg-[#FFFFFF] px-2.5 py-1 rounded-full border border-[#722F3D]/30 hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic bg-[#FFFFFF] border border-[#E8DCCF] p-2.5 rounded-xl w-32">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#722F3D]" />
                <span>Consulting...</span>
              </div>
            )}
          </div>

            {/* Input Footer */}
          <div className="p-3 bg-[#FFFFFF] border-t border-[#E8DCCF]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about silk care, delivery, COD..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#FAF4EB] border border-[#E8DCCF] text-xs text-[#241816] placeholder:text-[#6E5C57] focus:outline-none focus:ring-1 focus:ring-[#722F3D]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 bg-[#722F3D] hover:bg-[#541F28] disabled:opacity-50 text-[#F8F3EC] rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
