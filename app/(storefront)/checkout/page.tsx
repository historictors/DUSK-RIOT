'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProductStore } from '@/stores/useProductStore';
import { useCouponStore } from '@/stores/useCouponStore';
import { DuskImage } from '@/components/ui/DuskImage';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Lock, LogIn, UserPlus } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    appliedCoupon,
    shippingMethod,
    setShippingMethod,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    clearCart,
  } = useCartStore();

  const { createOrder } = useOrderStore();
  const { currentUser, isAuthenticated, isHydrated } = useAuthStore();
  const { adjustVariantStock, products } = useProductStore();
  const { incrementCouponUsage } = useCouponStore();

  const defaultAddr = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];

  const [fullName, setFullName] = useState(defaultAddr?.fullName || currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [addressLine, setAddressLine] = useState(defaultAddr?.addressLine || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Synchronize with currentUser when hydrated/logged in
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
      if (defaultAddr) {
        if (!addressLine) setAddressLine(defaultAddr.addressLine);
        if (!city) setCity(defaultAddr.city);
        if (!postalCode) setPostalCode(defaultAddr.postalCode);
      }
    }
  }, [currentUser, defaultAddr]);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!isAuthenticated || !currentUser) {
      setValidationError('Authentication required. You must sign in or register before dispatching an order.');
      showToast('Please sign in or create an account to place an order', 'error');
      router.push('/auth');
      return;
    }

    if (!fullName.trim() || !email.trim() || !addressLine.trim() || !city.trim() || !postalCode.trim()) {
      setValidationError('Please complete all dispatch shipping fields.');
      showToast('Missing required dispatch details', 'error');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please provide a valid dispatch email address.');
      showToast('Invalid email address', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your bag is empty. Please add items before checkout.', 'error');
      router.push('/shop');
      return;
    }

    // Check stock availability
    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      const variant = prod?.variants.find((v) => v.id === item.variantId);
      if (variant && variant.stock < item.quantity) {
        setValidationError(
          `Insufficient stock for ${item.product.name} (${item.size}). Only ${variant.stock} available.`
        );
        showToast('Insufficient stock for some garments', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    // Deduct stock from each variant
    items.forEach((item) => {
      adjustVariantStock(item.productId, item.variantId, -item.quantity);
    });

    if (appliedCoupon) {
      incrementCouponUsage(appliedCoupon.id);
    }

    const newOrder = createOrder({
      customerId: currentUser.id,
      customerName: fullName.toUpperCase(),
      customerEmail: email,
      shippingAddress: {
        id: `addr-${Date.now()}`,
        fullName: fullName.toUpperCase(),
        addressLine: addressLine.toUpperCase(),
        city: city.toUpperCase(),
        state: 'NY',
        postalCode,
        country: 'United States',
        phone,
        isDefault: true,
      },
      shippingMethod:
        shippingMethod === 'express' ? 'Express Tracked Courier' : 'Standard Ground',
      items: [...items],
      subtotal,
      discount,
      shippingFee,
      total,
      couponCode: appliedCoupon?.code,
      status: 'PLACED',
      paymentMethod: 'DEMO_SIMULATION',
      carrier: 'DHL Express Tracked',
      trackingNumber: `DRX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: 'Nov 24, 2026',
    });

    clearCart();

    showToast(`DISPATCH LOGGED // ORDER #${newOrder.orderNumber}`, 'success');

    setTimeout(() => {
      router.push(`/order-success/${newOrder.orderNumber}`);
    }, 400);
  };

  return (
    <div className="bg-surface min-h-screen overflow-x-hidden">
      {/* Focused Task Flow Header (Responsive) */}
      <header className="bg-surface border-b border-outline">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-accent shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Bag</span>
          </Link>
          <Link href="/" className="font-display text-lg sm:text-headline-md uppercase tracking-tight text-on-surface truncate">
            DUSK RIOT
          </Link>
          <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-wider sm:tracking-widest shrink-0 font-mono">
            DISPATCH
          </span>
        </div>
      </header>

      {/* Demo Simulation Notice Banner */}
      <div className="bg-accent text-on-accent px-3 py-2 text-center font-label text-[10px] sm:text-label-sm uppercase tracking-wider font-bold">
        ⚡ DEMO CHECKOUT MODE // NO REAL PAYMENT GATEWAY OR CARD REQUIRED
      </div>

      <main className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-4 sm:py-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Left 7 Columns: Shipping & Dispatch Form */}
          <form
            onSubmit={handleSubmitOrder}
            className="lg:col-span-7 bg-surface-container border border-outline p-4 sm:p-gutter-xl flex flex-col gap-4 sm:gap-gutter-xl"
          >
            <div className="border-b border-outline pb-2 sm:pb-gutter-md flex items-center justify-between">
              <h1 className="font-headline text-lg sm:text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
                DISPATCH DETAILS
              </h1>
              <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant font-mono">
                STEP 01 / 01
              </span>
            </div>

            {/* Guest Authentication Gate Banner */}
            {isHydrated && !isAuthenticated && (
              <div className="p-3 sm:p-4 bg-accent/10 border border-accent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <span className="font-label text-xs uppercase text-accent font-bold block">
                      AUTHENTICATION REQUIRED
                    </span>
                    <span className="font-body text-xs text-on-surface-variant">
                      You must sign in or register an account to dispatch an order.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    href="/auth"
                    className="flex-1 sm:flex-initial text-center bg-accent text-on-accent font-label text-xs uppercase px-4 py-2 font-bold hover:bg-[#b0f516] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="flex-1 sm:flex-initial text-center bg-surface-container-low text-on-surface border border-outline font-label text-xs uppercase px-3 py-2 hover:border-accent hover:text-accent transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {validationError && (
              <div className="p-2.5 sm:p-3 bg-surface border border-error text-error font-label text-xs uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Address Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-gutter-md">
              <div className="flex flex-col gap-1">
                <label className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-body text-sm px-3 py-2.5 sm:py-3 border border-outline focus:border-accent focus:outline-none uppercase min-h-[44px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                  Dispatch Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-body text-sm px-3 py-2.5 sm:py-3 border border-outline focus:border-accent focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  autoComplete="street-address"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-body text-sm px-3 py-2.5 sm:py-3 border border-outline focus:border-accent focus:outline-none uppercase min-h-[44px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                  City & State
                </label>
                <input
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-body text-sm px-3 py-2.5 sm:py-3 border border-outline focus:border-accent focus:outline-none uppercase min-h-[44px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  inputMode="numeric"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-body text-sm px-3 py-2.5 sm:py-3 border border-outline focus:border-accent focus:outline-none tabular-nums min-h-[44px]"
                />
              </div>
            </div>

            {/* Shipping Tier Selector */}
            <div className="flex flex-col gap-2 border-t border-outline pt-3 sm:pt-gutter-lg">
              <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface font-bold">
                Shipping Method
              </span>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-center justify-between p-3 border cursor-pointer transition-colors min-h-[48px] ${
                  shippingMethod === 'express'
                    ? 'bg-surface-container-low border-accent'
                    : 'bg-surface-container-low border-outline hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-gutter-md">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="text-accent bg-surface border-outline focus:ring-accent"
                  />
                  <div className="flex flex-col">
                    <span className="font-body text-xs sm:text-title-md uppercase text-on-surface font-bold">
                      Express Tracked Courier
                    </span>
                    <span className="font-body text-[11px] sm:text-body-md text-on-surface-variant">
                      1–2 Business Days with signature
                    </span>
                  </div>
                </div>
                <span className="font-label text-xs sm:text-label-sm uppercase text-accent font-bold">
                  {subtotal >= 200 ? 'FREE' : '$15.00'}
                </span>
              </label>

              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-center justify-between p-3 border cursor-pointer transition-colors min-h-[48px] ${
                  shippingMethod === 'standard'
                    ? 'bg-surface-container-low border-accent'
                    : 'bg-surface-container-low border-outline hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-gutter-md">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="text-accent bg-surface border-outline focus:ring-accent"
                  />
                  <div className="flex flex-col">
                    <span className="font-body text-xs sm:text-title-md uppercase text-on-surface font-bold">
                      Standard Ground
                    </span>
                    <span className="font-body text-[11px] sm:text-body-md text-on-surface-variant">
                      4–6 Business Days
                    </span>
                  </div>
                </div>
                <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant">
                  $0.00
                </span>
              </label>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full inline-flex items-center justify-center bg-accent text-on-accent font-label text-xs sm:text-label-lg uppercase tracking-wider px-4 sm:px-gutter-xl py-3.5 sm:py-4 border border-accent hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-40 font-bold min-h-[48px]"
            >
              <span>{isSubmitting ? 'Arming Dispatch...' : `Confirm Order — ${formatPrice(total)}`}</span>
            </button>
          </form>

          {/* Right 5 Columns: Order Summary */}
          <aside className="lg:col-span-5 bg-surface-container border border-outline p-4 sm:p-gutter-xl flex flex-col gap-3 sm:gap-gutter-lg lg:sticky lg:top-20">
            <h2 className="font-headline text-lg sm:text-headline-md uppercase text-on-surface border-b border-outline pb-2">
              BAG ITEMS ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            {/* Line items list */}
            <div className="flex flex-col gap-2.5 border-b border-outline pb-3 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-16 aspect-[3/4] shrink-0">
                    <DuskImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      aspectRatio="3/4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-body text-xs sm:text-title-md uppercase text-on-surface truncate font-semibold">
                      {item.product.name}
                    </span>
                    <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant">
                      SIZE {item.size} // QTY {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                    </span>
                  </div>
                  <span className="font-label text-xs sm:text-label-sm text-on-surface tabular-nums font-semibold shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-1.5 font-label text-xs sm:text-label-sm uppercase">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface tabular-nums font-semibold">{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-accent">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="tabular-nums font-bold">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-on-surface-variant">
                <span>Courier Dispatch</span>
                <span className={shippingFee === 0 ? 'text-accent font-bold' : 'text-on-surface'}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between border-t border-outline pt-2 font-headline text-base sm:text-headline-md text-on-surface">
                <span>TOTAL DUE</span>
                <span className="text-accent tabular-nums font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 bg-surface-container-low border border-outline text-[11px] sm:text-xs text-on-surface-variant flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                Demonstration checkout. Once placed, an Order ID is generated and parcel tracking telemetry becomes active.
              </span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
