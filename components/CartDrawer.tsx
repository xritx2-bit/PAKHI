'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export default function CartDrawer({ onOpenCheckout }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#241816]/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#FFFFFF] shadow-2xl flex flex-col border-l border-[#E8DCCF]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DCCF] flex items-center justify-between bg-[#F8F3EC]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#722F3D]" />
              <h2 className="font-serif text-lg font-bold text-[#241816]">
                Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#241816] hover:text-[#722F3D] rounded-full hover:bg-[#E8DCCF]/50 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF2F3] px-5 py-2.5 border-b border-[#722F3D]/10">
            {cartSubtotal >= 999 ? (
              <p className="text-xs font-medium text-[#722F3D] text-center">
                🎉 Congratulations! You have unlocked <strong>FREE Standard Shipping</strong>!
              </p>
            ) : (
              <div>
                <p className="text-xs text-[#6E5C57] text-center mb-1">
                  Add <strong className="text-[#722F3D]">₹{(999 - cartSubtotal).toLocaleString('en-IN')}</strong> more for <strong>FREE Shipping</strong>
                </p>
                <div className="w-full bg-[#E8DCCF] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#722F3D] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartSubtotal / 999) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8DCCF]/60">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#C6A36B] mx-auto stroke-1" />
                <p className="font-serif text-lg text-[#241816] font-medium">Your shopping bag is empty</p>
                <p className="text-xs text-[#6E5C57] max-w-xs mx-auto">
                  Explore our handwoven sarees and designer kurtas to find your perfect festive attire.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-6 py-2 bg-[#722F3D] text-[#F8F3EC] text-xs font-semibold uppercase tracking-wider rounded-md"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#F5EBDD] flex-shrink-0 border border-[#E8DCCF]">
                    <Image src={item.image} alt={item.name} fill className="object-cover object-top" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-sm font-semibold text-[#241816] line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#6E5C57] hover:text-[#722F3D] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#6E5C57] space-y-0.5 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span className="ml-2">Size: {item.selectedSize}</span>}
                        {item.blouseIncluded !== undefined && (
                          <span className="ml-2 block">Blouse: {item.blouseIncluded ? 'Included' : 'None'}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <span className="font-semibold text-sm text-[#241816]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-[#E8DCCF] rounded-md bg-[#F8F3EC]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs hover:text-[#722F3D]"
                        >
                          −
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-[#241816]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs hover:text-[#722F3D]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#F8F3EC] border-t border-[#E8DCCF] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6E5C57]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#241816]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#722F3D]">
                    <span>Discount</span>
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

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 bg-[#722F3D] hover:bg-[#541F28] text-[#F8F3EC] text-sm font-semibold rounded-md shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-[#6E5C57] hover:text-[#722F3D] py-1 transition-colors underline"
              >
                View Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
