'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, Heart, ChevronDown, ChevronUp, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export default function ProductDetailModal({ product, onClose, onOpenCheckout }: ProductDetailModalProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[1] || product.sizes[0] : undefined);
  const [blouseIncluded, setBlouseIncluded] = useState(product.blouseIncluded ?? true);
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openSection, setOpenSection] = useState<'details' | 'fabric' | 'shipping' | 'reviews' | null>('details');

  const isWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      blouseIncluded: product.category === 'sarees' ? blouseIncluded : undefined,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    onOpenCheckout();
  };

  const toggleSection = (section: 'details' | 'fabric' | 'shipping' | 'reviews') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#241816]/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#FFFFFF] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DCCF] text-[#241816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#241816] hover:text-[#722F3D] bg-[#F8F3EC] hover:bg-[#E8DCCF] rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Gallery: Vertical Thumbnails + Main View */}
          <div className="md:col-span-6 flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-[#722F3D] ring-2 ring-[#722F3D]/20' : 'border-[#E8DCCF] opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumb ${idx}`} fill className="object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Main Photo */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F5EBDD] border border-[#E8DCCF] shadow-sm">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover object-top"
                priority
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                  isWish ? 'bg-[#722F3D] text-[#FFFFFF]' : 'bg-[#FFFFFF]/90 text-[#241816] hover:text-[#722F3D]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Product Options & Details */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C6A36B]">
                {product.category} • {product.subcategory}
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#241816] font-bold mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-[#C6A36B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#241816]">{product.rating}</span>
                <span className="text-xs text-[#6E5C57]">({product.reviewCount} reviews)</span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#722F3D]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#6E5C57] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#FAF2F3] text-[#722F3D] border border-[#722F3D]/30 rounded">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color Swatch Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span className="text-[#6E5C57]">Color:</span>
                  <span className="text-[#241816] font-semibold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          isSelected ? 'border-[#722F3D] scale-110 shadow-sm' : 'border-[#E8DCCF] hover:border-[#722F3D]/50'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="block w-full h-full rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Saree: Blouse Included Toggle OR Kurta: Size Selector */}
              {product.category === 'sarees' ? (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span className="text-[#6E5C57]">Blouse:</span>
                    <span className="text-[#241816] font-semibold">{blouseIncluded ? 'Included (0.8m piece)' : 'None'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBlouseIncluded(true)}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                        blouseIncluded
                          ? 'bg-[#722F3D] text-[#F8F3EC] shadow-sm'
                          : 'bg-[#F8F3EC] text-[#241816] hover:bg-[#E8DCCF]'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlouseIncluded(false)}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                        !blouseIncluded
                          ? 'bg-[#722F3D] text-[#F8F3EC] shadow-sm'
                          : 'bg-[#F8F3EC] text-[#241816] hover:bg-[#E8DCCF]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                product.sizes && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-medium mb-2">
                      <span className="text-[#6E5C57]">Select Size:</span>
                      <span className="text-[#722F3D] cursor-pointer hover:underline">Size Guide</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 rounded-md text-xs font-medium border transition-all ${
                            selectedSize === size
                              ? 'bg-[#722F3D] text-[#F8F3EC] border-[#722F3D]'
                              : 'bg-[#FFFFFF] text-[#241816] border-[#E8DCCF] hover:border-[#722F3D]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs text-[#6E5C57] font-medium">Quantity:</span>
                <div className="inline-flex items-center border border-[#E8DCCF] rounded-md bg-[#F8F3EC]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm hover:text-[#722F3D] transition-colors"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-[#241816] min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm hover:text-[#722F3D] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dual Action Buttons matching mockup */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-sm font-semibold rounded-md shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 border-2 border-[#722F3D] text-[#722F3D] hover:bg-[#722F3D] hover:text-[#F8F3EC] text-sm font-semibold rounded-md transition-all shadow-sm"
                >
                  Buy Now
                </button>
              </div>

            </div>

            {/* Collapsible Accordions matching mockup */}
            <div className="border-t border-[#E8DCCF] pt-4 space-y-2 text-sm">
              
              {/* Product Details */}
              <div className="border-b border-[#E8DCCF]/60 pb-2">
                <button
                  type="button"
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between text-left font-medium text-xs uppercase tracking-wider py-1.5 hover:text-[#722F3D]"
                >
                  <span>Product Details</span>
                  {openSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'details' && (
                  <div className="pt-2 pb-1 text-xs text-[#6E5C57] space-y-1.5 font-light">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fabric & Care */}
              <div className="border-b border-[#E8DCCF]/60 pb-2">
                <button
                  type="button"
                  onClick={() => toggleSection('fabric')}
                  className="w-full flex items-center justify-between text-left font-medium text-xs uppercase tracking-wider py-1.5 hover:text-[#722F3D]"
                >
                  <span>Fabric &amp; Care</span>
                  {openSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'fabric' && (
                  <div className="pt-2 pb-1 text-xs text-[#6E5C57] space-y-1">
                    <p><strong className="text-[#241816]">Fabric:</strong> {product.fabric}</p>
                    <p><strong className="text-[#241816]">Care Instructions:</strong> {product.careInstructions}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border-b border-[#E8DCCF]/60 pb-2">
                <button
                  type="button"
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between text-left font-medium text-xs uppercase tracking-wider py-1.5 hover:text-[#722F3D]"
                >
                  <span>Shipping &amp; Returns</span>
                  {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'shipping' && (
                  <div className="pt-2 pb-1 text-xs text-[#6E5C57] space-y-1.5">
                    <p>- Dispatched within 24-48 business hours.</p>
                    <p>- Free standard delivery on orders above Rs.999.</p>
                    <p>- 7-day hassle-free doorstep return &amp; exchange guarantee.</p>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('reviews')}
                  className="w-full flex items-center justify-between text-left font-medium text-xs uppercase tracking-wider py-1.5 hover:text-[#722F3D]"
                >
                  <span>Reviews ({product.reviewCount})</span>
                  {openSection === 'reviews' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'reviews' && (
                  <div className="pt-2 pb-1 text-xs text-[#6E5C57] space-y-2">
                    <div className="bg-[#F8F3EC] p-2.5 rounded-lg border border-[#E8DCCF]/50">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#241816]">Priya S.</span>
                        <div className="flex text-[#C6A36B] text-[10px]">★★★★★</div>
                      </div>
                      <p className="mt-1 text-[11px]">&quot;The zari sheen and pure silk quality exceeded my expectations. Got so many compliments at my sister&apos;s wedding reception!&quot;</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
