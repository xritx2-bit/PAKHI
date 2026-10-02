'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Share2,
  CheckCircle2,
  MapPin,
  Sparkles,
  Info,
  Ruler
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import CompleteTheLook from '@/components/CompleteTheLook';
import { PRODUCTS } from '@/lib/products-data';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart, isInWishlist, toggleWishlist, openProductModal, setIsCheckoutOpen, setIsSearchOpen } = useCart();

  // Find product by slug or default to first
  const product: Product = useMemo(() => {
    const found = PRODUCTS.find((p) => p.slug === slug);
    return found || PRODUCTS[0];
  }, [slug]);

  // Gallery state
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  // Variants state
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[1] || product.sizes[0] : 'Free Size');
  const [blouseIncluded, setBlouseIncluded] = useState(product.blouseIncluded ?? true);
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openSection, setOpenSection] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details');

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);

  // Size chart & AI Fit modal state
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showAiFitModal, setShowAiFitModal] = useState(false);
  const [aiFitBust, setAiFitBust] = useState('36');
  const [aiFitPref, setAiFitPref] = useState<'tailored' | 'comfortable' | 'relaxed'>('comfortable');
  const [aiFitResult, setAiFitResult] = useState<any>(null);
  const [isCalculatingFit, setIsCalculatingFit] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  const isWish = isInWishlist(product.id);

  // Related products (same category or different items)
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product.id]);

  const handleCalculateAiFit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculatingFit(true);
    try {
      const res = await fetch('/api/ai/size-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bust: Number(aiFitBust),
          preferredFit: aiFitPref,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiFitResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculatingFit(false);
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setDeliveryInfo(`Delivering to ${pincode} within 3-4 business days. Free Shipping & Cash on Delivery available.`);
    } else {
      setDeliveryInfo('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor,
      size: product.category === 'kurtas' ? selectedSize : undefined,
      blouseIncluded: product.category === 'sarees' ? blouseIncluded : undefined,
      quantity,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, {
      color: selectedColor,
      size: product.category === 'kurtas' ? selectedSize : undefined,
      blouseIncluded: product.category === 'sarees' ? blouseIncluded : undefined,
      quantity,
    });
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const productSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": [product.image, ...(product.gallery || [])],
    "description": product.description,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Pakhi's Collection"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://pakhiscollection.com/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Pakhi's Collection"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.9,
      "reviewCount": product.reviewCount || 24,
      "bestRating": "5",
      "worstRating": "1"
    }
  }), [product]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EC]">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Navbar */}
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Breadcrumb Bar */}
      <div className="bg-[#FAF2F3] border-b border-[#E8DCCF]/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#6E5C57]">
            <Link href="/" className="hover:text-[#722F3D]">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#C6A36B]" />
            <Link href={`/category/${product.category}`} className="capitalize hover:text-[#722F3D]">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A36B]" />
            <span className="text-[#241816] font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:w-20 shrink-0">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[3/4] w-16 sm:w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img
                      ? 'border-[#722F3D] ring-2 ring-[#722F3D]/20 shadow-md'
                      : 'border-[#E8DCCF] hover:border-[#DFC394]'
                  }`}
                >
                  <Image src={img} alt={`${product.name} angle ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F5EBDD] border border-[#E8DCCF] shadow-lg group">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.isNew && (
                  <span className="bg-[#722F3D] text-[#F8F3EC] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    New Arrival
                  </span>
                )}
                <span className="bg-[#C6A36B] text-[#241816] text-xs font-bold px-3 py-1 rounded-full tracking-wider shadow-md">
                  {product.discountPercent}% OFF
                </span>
              </div>

              {/* Share & Wishlist Floating Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="p-3 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs text-[#241816] hover:bg-[#FFFFFF] hover:text-[#722F3D] shadow-md transition-all active:scale-95"
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-[#722F3D] text-[#722F3D]' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  className="p-3 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs text-[#241816] hover:bg-[#FFFFFF] hover:text-[#722F3D] shadow-md transition-all active:scale-95 relative"
                >
                  <Share2 className="w-5 h-5" />
                  {copiedLink && (
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#241816] text-[#FFFFFF] text-[10px] rounded whitespace-nowrap shadow-lg">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Buy Box & Specifications (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C6A36B] font-semibold">
                  {product.fabric} • {product.occasion}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#241816] bg-[#FAF2F3] px-2.5 py-1 rounded-full border border-[#722F3D]/10">
                  <Star className="w-3.5 h-3.5 fill-[#C6A36B] text-[#C6A36B]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#6E5C57]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241816] leading-tight">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-serif text-3xl font-bold text-[#722F3D]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-[#6E5C57] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-[#6E5C57] mt-1">Inclusive of all taxes. Free shipping on this order.</p>

              {/* Festive Promo Box */}
              <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-[#FAF2F3] to-[#F5EBDD] border border-[#DFC394]/60 flex items-start gap-2.5 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#C6A36B] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#722F3D]">Special Festive Privilege</p>
                  <p className="text-[#6E5C57] mt-0.5">
                    Use coupon code <strong className="text-[#241816] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#DFC394]">FESTIVE200</strong> at checkout for flat ₹200 off!
                  </p>
                </div>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#241816] uppercase tracking-wider">
                  Color: <span className="font-normal text-[#6E5C57]">{selectedColor}</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor === color.name
                        ? 'border-[#722F3D] scale-110 shadow-sm'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector for Kurtas */}
            {product.category === 'kurtas' && product.sizes && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#241816] uppercase tracking-wider">
                    Select Size: <span className="font-normal text-[#6E5C57]">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAiFitModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#722F3D] bg-[#FAF2F3] px-2.5 py-0.5 rounded-full border border-[#722F3D]/20 hover:bg-[#722F3D] hover:text-[#FFFFFF] transition-colors font-semibold shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-[#C6A36B]" />
                      <span>AI Fit Stylist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="inline-flex items-center gap-1 text-xs text-[#6E5C57] hover:text-[#722F3D] hover:underline font-medium"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 h-10 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === sz
                          ? 'border-[#722F3D] bg-[#722F3D] text-[#FFFFFF] shadow-sm'
                          : 'border-[#E8DCCF] bg-[#FFFFFF] text-[#241816] hover:border-[#722F3D]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saree Blouse Option */}
            {product.category === 'sarees' && (
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8DCCF]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#241816]">Unstitched Blouse Piece</p>
                    <p className="text-[11px] text-[#6E5C57]">Includes matching 0.8m running silk brocade fabric</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBlouseIncluded(true)}
                      className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                        blouseIncluded
                          ? 'bg-[#722F3D] text-[#FFFFFF] border-[#722F3D]'
                          : 'bg-[#F8F3EC] text-[#6E5C57] border-[#E8DCCF]'
                      }`}
                    >
                      Included
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#241816] uppercase tracking-wider">Qty:</span>
                <div className="flex items-center border border-[#E8DCCF] bg-[#FFFFFF] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm hover:bg-[#F5EBDD] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-[#241816]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-sm hover:bg-[#F5EBDD] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#2D6A4F] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock ({product.stock} available)</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-lg border-2 border-[#722F3D] bg-[#FAF2F3] hover:bg-[#722F3D] text-[#722F3D] hover:text-[#FFFFFF] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-lg bg-[#722F3D] hover:bg-[#541F28] text-[#FFFFFF] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
              >
                <Zap className="w-4 h-4 fill-[#DFC394] text-[#DFC394]" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Indian Pincode Delivery Checker */}
            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DCCF] shadow-xs">
              <label className="block text-xs font-semibold text-[#241816] mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#722F3D]" />
                <span>Check Delivery &amp; COD Availability</span>
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 110016)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 bg-[#F8F3EC] border border-[#E8DCCF] rounded-lg px-3 py-2 text-xs text-[#241816] focus:outline-none focus:ring-1 focus:ring-[#722F3D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#241816] text-[#F8F3EC] rounded-lg text-xs font-semibold hover:bg-[#722F3D] transition-colors"
                >
                  Check
                </button>
              </form>
              {deliveryInfo && (
                <p className="text-xs text-[#2D6A4F] mt-2 font-medium flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{deliveryInfo}</span>
                </p>
              )}
            </div>

            {/* Brand Assurances */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E8DCCF] text-center text-[10px] text-[#6E5C57]">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-[#C6A36B]" />
                <span>100% Handloom Authenticity</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-5 h-5 text-[#C6A36B]" />
                <span>7-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-[#C6A36B]" />
                <span>Free Insured Shipping</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border border-[#E8DCCF] rounded-xl overflow-hidden divide-y divide-[#E8DCCF] bg-[#FFFFFF]">
              {/* Product Details */}
              <div>
                <button
                  onClick={() => setOpenSection(openSection === 'details' ? (null as any) : 'details')}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#241816] hover:bg-[#FAF2F3]"
                >
                  <span>Product Story &amp; Details</span>
                  {openSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'details' && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#6E5C57] space-y-2 leading-relaxed animate-fadeIn">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fabric & Care */}
              <div>
                <button
                  onClick={() => setOpenSection(openSection === 'fabric' ? (null as any) : 'fabric')}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#241816] hover:bg-[#FAF2F3]"
                >
                  <span>Fabric Specifications &amp; Care</span>
                  {openSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'fabric' && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#6E5C57] space-y-2 animate-fadeIn">
                    <p><strong>Primary Fabric:</strong> {product.fabric}</p>
                    <p><strong>Weave Technique:</strong> {product.pattern || 'Zari Brocade'}</p>
                    <p><strong>Care:</strong> {product.careInstructions}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? (null as any) : 'shipping')}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#241816] hover:bg-[#FAF2F3]"
                >
                  <span>Shipping, COD &amp; Returns Policy</span>
                  {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'shipping' && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#6E5C57] space-y-2 animate-fadeIn">
                    <p>• Orders dispatched within 24 hours from our atelier.</p>
                    <p>• Standard transit time: 3–5 business days across India.</p>
                    <p>• Hassle-free 7-day doorstep return pickup and exchange.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* AI Royal Atelier Stylist: Complete The Look */}
        <CompleteTheLook product={product} />

        {/* Customer Reviews & Ratings Section */}
        <section className="mt-16 pt-12 border-t border-[#E8DCCF]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C6A36B] font-semibold">
                Customer Voices
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241816] mt-1">
                Ratings &amp; Reviews
              </h2>
            </div>
            <div className="flex items-center gap-4 bg-[#FFFFFF] px-5 py-3 rounded-xl border border-[#E8DCCF] shadow-xs">
              <div className="text-center">
                <span className="font-serif text-3xl font-bold text-[#722F3D] block">{product.rating}</span>
                <span className="text-[10px] text-[#6E5C57]">out of 5</span>
              </div>
              <div className="h-8 w-[1px] bg-[#E8DCCF]" />
              <div className="text-xs text-[#6E5C57]">
                <div className="flex items-center gap-1 text-[#C6A36B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C6A36B]" />
                  ))}
                </div>
                <p className="mt-1 font-medium text-[#241816]">Based on {product.reviewCount} verified purchases</p>
              </div>
            </div>
          </div>

          {/* Sample Verified Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8DCCF] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#241816]">Meenakshi Sundaram</h4>
                  <p className="text-[10px] text-[#2D6A4F] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer • Chennai</span>
                  </p>
                </div>
                <div className="flex items-center text-[#C6A36B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C6A36B]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#6E5C57] leading-relaxed">
                &ldquo;The drape of this saree is genuinely regal. The antique gold zari has a subtle shimmer rather than cheap sparkle. Wore it to a wedding reception and received countless compliments!&rdquo;
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8DCCF] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#241816]">Ritu Bhasin</h4>
                  <p className="text-[10px] text-[#2D6A4F] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer • New Delhi</span>
                  </p>
                </div>
                <div className="flex items-center text-[#C6A36B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C6A36B]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#6E5C57] leading-relaxed">
                &ldquo;Packaging was exquisite, complete with fabric care pouch. The fabric feels pure and lightweight. Truly living up to the promise of elegance in every thread.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* You May Also Like / Complete the Look */}
        <section className="mt-16 pt-12 border-t border-[#E8DCCF]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C6A36B] font-semibold">
                Curated Suggestions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241816] mt-1">
                Complete The Look
              </h2>
            </div>
            <Link
              href={`/category/${product.category}`}
              className="text-xs font-semibold text-[#722F3D] hover:underline"
            >
              View Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="group bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E8DCCF] shadow-xs hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-[#F5EBDD] overflow-hidden">
                  <Link href={`/products/${rel.slug}`} className="block w-full h-full">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A36B] font-semibold">
                      {rel.fabric}
                    </span>
                    <Link href={`/products/${rel.slug}`}>
                      <h4 className="font-serif text-sm font-bold text-[#241816] group-hover:text-[#722F3D] transition-colors line-clamp-1 mt-0.5">
                        {rel.name}
                      </h4>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8DCCF]/60">
                    <span className="font-serif font-bold text-sm text-[#722F3D]">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => openProductModal(rel)}
                      className="text-[11px] font-semibold text-[#722F3D] hover:underline"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 border border-[#E8DCCF] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCF]">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#722F3D]" />
                <h3 className="font-serif text-lg font-bold text-[#241816]">Women&apos;s Kurta Size Guide (Inches)</h3>
              </div>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-1 rounded-full text-[#6E5C57] hover:text-[#241816]"
              >
                ✕
              </button>
            </div>

            <div className="py-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#FAF2F3] text-[#722F3D] border-b border-[#E8DCCF]">
                    <th className="py-2.5 px-3 font-semibold">Size</th>
                    <th className="py-2.5 px-3 font-semibold">Bust</th>
                    <th className="py-2.5 px-3 font-semibold">Waist</th>
                    <th className="py-2.5 px-3 font-semibold">Hip</th>
                    <th className="py-2.5 px-3 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCF] text-[#241816]">
                  <tr><td className="py-2 px-3 font-bold">XS</td><td className="py-2 px-3">34</td><td className="py-2 px-3">30</td><td className="py-2 px-3">38</td><td className="py-2 px-3">44</td></tr>
                  <tr><td className="py-2 px-3 font-bold">S</td><td className="py-2 px-3">36</td><td className="py-2 px-3">32</td><td className="py-2 px-3">40</td><td className="py-2 px-3">44</td></tr>
                  <tr><td className="py-2 px-3 font-bold">M</td><td className="py-2 px-3">38</td><td className="py-2 px-3">34</td><td className="py-2 px-3">42</td><td className="py-2 px-3">45</td></tr>
                  <tr><td className="py-2 px-3 font-bold">L</td><td className="py-2 px-3">40</td><td className="py-2 px-3">36</td><td className="py-2 px-3">44</td><td className="py-2 px-3">45</td></tr>
                  <tr><td className="py-2 px-3 font-bold">XL</td><td className="py-2 px-3">42</td><td className="py-2 px-3">38</td><td className="py-2 px-3">46</td><td className="py-2 px-3">46</td></tr>
                  <tr><td className="py-2 px-3 font-bold">XXL</td><td className="py-2 px-3">44</td><td className="py-2 px-3">40</td><td className="py-2 px-3">48</td><td className="py-2 px-3">46</td></tr>
                </tbody>
              </table>
              <p className="text-[11px] text-[#6E5C57] mt-3">
                * Note: Measurements are standard garment sizes in inches. If you fall between sizes, we recommend choosing the larger size for optimal comfort.
              </p>
            </div>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full py-2.5 bg-[#722F3D] text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#541F28]"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* AI Size & Fit Stylist Modal */}
      {showAiFitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#E8DCCF] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FAF2F3] text-[#722F3D] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#C6A36B]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#241816]">AI Size &amp; Fit Stylist</h3>
                  <p className="text-[10px] text-[#6E5C57]">Powered by Pakhi&apos;s master tailor measurements</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiFitModal(false)}
                className="p-1 rounded-full text-[#6E5C57] hover:text-[#241816]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCalculateAiFit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6E5C57] font-medium mb-1">
                  Your Bust Measurement (Inches)
                </label>
                <input
                  type="number"
                  min={28}
                  max={54}
                  required
                  value={aiFitBust}
                  onChange={(e) => setAiFitBust(e.target.value)}
                  placeholder="e.g. 36"
                  className="w-full p-2.5 rounded-lg border border-[#E8DCCF] bg-[#F8F3EC] text-xs font-bold text-[#241816]"
                />
              </div>

              <div>
                <label className="block text-[#6E5C57] font-medium mb-1">
                  Preferred Silhouette &amp; Ease
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tailored', label: 'Tailored', sub: '1.5" ease' },
                    { id: 'comfortable', label: 'Royal Fit', sub: '2.5" ease' },
                    { id: 'relaxed', label: 'Relaxed', sub: '3.5" ease' },
                  ].map((pref) => (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => setAiFitPref(pref.id as any)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        aiFitPref === pref.id
                          ? 'border-[#722F3D] bg-[#FAF2F3] text-[#722F3D] font-bold shadow-2xs'
                          : 'border-[#E8DCCF] text-[#6E5C57] hover:border-[#722F3D]'
                      }`}
                    >
                      <span className="block font-semibold">{pref.label}</span>
                      <span className="text-[9px] text-[#6E5C57]">{pref.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculatingFit}
                className="w-full py-2.5 bg-[#722F3D] hover:bg-[#541F28] text-[#FFFFFF] font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {isCalculatingFit ? (
                  <span>Analyzing measurements...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#DFC394]" />
                    <span>Calculate Ideal Size</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Recommendation Result */}
            {aiFitResult && (
              <div className="p-4 rounded-xl bg-[#FAF2F3] border border-[#722F3D]/20 space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#6E5C57]">Recommended Size:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#722F3D] text-[#FFFFFF] font-bold text-xs">
                    Size {aiFitResult.recommendedSize} ({aiFitResult.confidence} Match)
                  </span>
                </div>
                <p className="text-[11px] text-[#6E5C57] leading-relaxed">
                  {aiFitResult.explanation}
                </p>
                <div className="pt-2 border-t border-[#722F3D]/10 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSize(aiFitResult.recommendedSize);
                      setShowAiFitModal(false);
                    }}
                    className="w-full py-2 bg-[#722F3D] text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#541F28] transition-colors"
                  >
                    Select Size {aiFitResult.recommendedSize} &amp; Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onSelectCategory={(cat) => router.push(`/category/${cat}`)} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onSearchClick={() => setIsSearchOpen(true)} />
    </div>
  );
}
