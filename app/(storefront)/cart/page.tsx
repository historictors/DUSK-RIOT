'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useCouponStore } from '@/stores/useCouponStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { DuskImage } from '@/components/ui/DuskImage';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, LogIn, Lock } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const {
    items,
    appliedCoupon,
    shippingMethod,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    getItemCount,
  } = useCartStore();

  const { validateCoupon } = useCouponStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const res = validateCoupon(promoCodeInput, subtotal);
    if (!res.valid || !res.coupon) {
      setPromoError(res.error || 'Invalid code');
      showToast(res.error || 'Invalid coupon code', 'error');
      return;
    }

    applyCoupon(res.coupon);
    setPromoCodeInput('');
    showToast(`PROMO ${res.coupon.code} APPLIED!`, 'success');
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Promo code removed', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="bg-surface min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border border-outline bg-surface-container flex items-center justify-center text-accent mb-4">
          <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
          DISPATCH QUEUE EMPTY
        </span>
        <h1 className="font-display text-2xl sm:text-display-lg uppercase text-on-surface mt-1">
          YOUR BAG IS EMPTY
        </h1>
        <p className="font-body text-xs sm:text-body-md text-on-surface-variant max-w-sm mt-2 mb-6">
          No silhouettes are currently queued for dispatch. Explore our FW26 release to arm your collection.
        </p>
        <Link
          href="/shop"
          className="bg-accent text-on-accent font-label text-xs sm:text-label-lg uppercase px-6 sm:px-gutter-xl py-3 sm:py-3.5 border border-accent hover:bg-primary hover:text-on-primary transition-colors font-bold"
        >
          Explore Drop 04
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface overflow-x-hidden min-h-screen">
      <section className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-4 sm:py-section">
        {/* Header Strip */}
        <div className="border-b border-outline pb-3 sm:pb-gutter-lg mb-4 sm:mb-gutter-xl flex items-end justify-between gap-2">
          <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
            <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
              YOUR SELECTION // {itemCount} {itemCount === 1 ? 'GARMENT' : 'GARMENTS'}
            </span>
            <h1 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              SHOPPING BAG
            </h1>
          </div>
          <Link
            href="/shop"
            className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-accent underline shrink-0"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Line Items List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-gutter-md">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-surface-container border border-outline p-3 sm:p-gutter-md flex gap-3 sm:gap-gutter-lg items-start sm:items-stretch"
              >
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="w-20 sm:w-28 md:w-32 aspect-[3/4] bg-surface-container-low border border-outline overflow-hidden shrink-0 block"
                >
                  <DuskImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    aspectRatio="3/4"
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info & Quantity Actions */}
                <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-gutter-md min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-label text-[9px] sm:text-label-sm uppercase text-on-surface-variant font-mono">
                        SKU: {item.product.sku}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-title text-sm sm:text-title-lg uppercase text-on-surface hover:text-accent truncate font-semibold"
                      >
                        {item.product.name}
                      </Link>
                      <span className="font-body text-xs sm:text-body-md text-on-surface-variant">
                        Size: {item.size} // {item.color}
                      </span>
                    </div>

                    <span className="font-headline text-base sm:text-headline-md text-on-surface tabular-nums font-bold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity Stepper & Remove Button */}
                  <div className="flex items-center justify-between border-t border-outline pt-2 sm:pt-gutter-sm mt-auto">
                    <div className="inline-flex items-center border border-outline bg-surface-container-low">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-accent font-bold text-base"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-2.5 sm:px-3 font-label text-xs sm:text-label-sm tabular-nums text-on-surface font-semibold">
                        {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-accent font-bold text-base"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> <span>Remove</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Order Summary & Checkout (4 cols) */}
          <aside className="lg:col-span-4 bg-surface-container border border-outline p-4 sm:p-gutter-xl flex flex-col gap-4 sm:gap-gutter-lg lg:sticky lg:top-20">
            <h2 className="font-headline text-lg sm:text-headline-md uppercase text-on-surface border-b border-outline pb-2">
              ORDER SUMMARY
            </h2>

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-2 font-label text-xs sm:text-label-sm uppercase">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-on-surface tabular-nums font-semibold">{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-accent">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Promo ({appliedCoupon.code})
                  </span>
                  <span className="tabular-nums font-bold">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-on-surface-variant">
                <span>Courier Dispatch</span>
                <span className={shippingFee === 0 ? 'text-accent font-bold' : 'text-on-surface'}>
                  {shippingFee === 0 ? 'FREE EXPRESS' : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-outline pt-3 text-on-surface">
                <span className="font-headline text-base sm:text-headline-md">ESTIMATED TOTAL</span>
                <span className="font-headline text-lg sm:text-headline-md text-accent tabular-nums font-bold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Promo Code Input Form */}
            <div className="border-t border-outline pt-3 flex flex-col gap-1.5">
              <span className="font-label text-xs uppercase text-on-surface font-semibold">Promo Code</span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-surface border border-accent font-label text-xs uppercase text-accent">
                  <span>Applied: {appliedCoupon.code}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-on-surface-variant hover:text-error text-[10px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.G. DUSK20"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-label text-xs uppercase px-3 py-2 border border-outline focus:border-accent focus:outline-none min-h-[42px]"
                  />
                  <button
                    type="submit"
                    className="bg-surface-container-low text-on-surface hover:text-accent font-label text-xs uppercase px-3 py-2 border border-outline hover:border-accent transition-colors font-bold min-h-[42px]"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <span className="font-label text-[10px] uppercase text-error">{promoError}</span>
              )}
            </div>

            {/* Shipping Tier Radios */}
            <div className="border-t border-outline pt-3 flex flex-col gap-1.5">
              <span className="font-label text-xs uppercase text-on-surface font-semibold">
                Delivery Tier
              </span>
              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-center justify-between p-2.5 border cursor-pointer font-label text-xs uppercase transition-colors min-h-[44px] ${
                  shippingMethod === 'express'
                    ? 'bg-surface border-accent text-accent font-bold'
                    : 'bg-surface-container-low border-outline text-on-surface-variant'
                }`}
              >
                <span>Express Courier (1–2 Days)</span>
                <span>{subtotal >= 200 ? 'FREE' : '$15.00'}</span>
              </label>

              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-center justify-between p-2.5 border cursor-pointer font-label text-xs uppercase transition-colors min-h-[44px] ${
                  shippingMethod === 'standard'
                    ? 'bg-surface border-accent text-accent font-bold'
                    : 'bg-surface-container-low border-outline text-on-surface-variant'
                }`}
              >
                <span>Standard Ground (3–5 Days)</span>
                <span>FREE</span>
              </label>
            </div>

            {/* Authentication Notice for Guests */}
            {isHydrated && !isAuthenticated && (
              <div className="p-3 bg-surface-container border border-outline flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span className="font-label text-[11px] uppercase tracking-wider font-bold">
                    MEMBER ACCESS REQUIRED
                  </span>
                </div>
                <p className="font-body text-[11px] text-on-surface-variant">
                  Orders require a verified customer account. Please sign in or register before checking out.
                </p>
                <Link
                  href="/auth"
                  className="w-full text-center py-2 bg-surface border border-outline hover:border-accent text-accent font-label text-xs uppercase font-bold tracking-wider transition-colors"
                >
                  Sign In / Register
                </Link>
              </div>
            )}

            {/* Checkout Action */}
            <Link
              href={isAuthenticated ? '/checkout' : '/auth'}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-label text-xs sm:text-label-lg uppercase tracking-wider px-4 sm:px-gutter-xl py-3.5 sm:py-4 border border-accent hover:bg-primary hover:text-on-primary font-bold text-center min-h-[48px]"
            >
              <span>{isAuthenticated ? 'Proceed to Dispatch' : 'Sign In to Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <span className="font-label text-[10px] uppercase text-center text-on-surface-variant">
              SIMULATED CHECKOUT // NO CARD COLLECTED
            </span>
          </aside>
        </div>
      </section>
    </div>
  );
}
