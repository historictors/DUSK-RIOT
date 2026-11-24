'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrderStore } from '@/stores/useOrderStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { DuskImage } from '@/components/ui/DuskImage';
import { Truck, ArrowLeft, CheckCircle2, Clock, AlertTriangle, Package, Check } from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const { getOrderById, getOrderByNumber, cancelOrder } = useOrderStore();
  const order = getOrderById(id) || getOrderByNumber(id) || useOrderStore((state) => state.orders[0]);

  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!order) {
    return (
      <div className="max-w-[1440px] mx-auto px-gutter-md py-section text-center">
        <h1 className="font-display text-headline-lg uppercase text-on-surface">Order Not Found</h1>
        <p className="text-on-surface-variant mt-2 font-body text-body-md">No parcel found matching reference #{id}.</p>
        <Link href="/shop" className="text-accent underline mt-4 inline-block font-label text-label-sm uppercase">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    const success = cancelOrder(order.id);
    if (success) {
      showToast(`ORDER #${order.orderNumber} HAS BEEN CANCELLED AND RESTOCKED.`, 'info');
      setConfirmCancel(false);
    } else {
      showToast('Order cannot be cancelled at this stage.', 'error');
    }
  };

  const statusStepMap: Record<string, number> = {
    PLACED: 1,
    CONFIRMED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
    CANCELLED: 0,
  };

  const currentStep = statusStepMap[order.status] ?? 2;

  const steps = [
    { num: '01', title: 'CONFIRMED', subtitle: 'Order Logged', time: order.timeline[0]?.timestamp || 'Nov 18, 21:04 EST' },
    { num: '02', title: 'PACKED', subtitle: 'NYC Studio', time: order.timeline[1]?.timestamp || 'Nov 19, 09:15 EST' },
    { num: '03', title: 'IN TRANSIT', subtitle: 'Regional Hub', time: order.timeline[2]?.timestamp || 'Nov 20, 14:40 EST' },
    { num: '04', title: 'DELIVERED', subtitle: 'Final Drop', time: currentStep >= 4 ? 'Signed & Delivered' : 'Pending signature' },
  ];

  return (
    <div className="bg-surface min-h-screen">
      {/* Ticker Sub-Header (Stitch Reference) */}
      <div className="bg-surface-container-low border-b border-outline px-gutter-md md:px-page-margin py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-label-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="inline-block w-2 h-2 bg-accent shrink-0" />
          <span className="font-label uppercase text-on-surface tracking-widest truncate">
            DISPATCH TRACKING // {order.carrier.toUpperCase()}
          </span>
        </div>
        <span className="font-label uppercase text-accent tracking-widest tabular-nums font-mono">
          WAYBILL #{order.trackingNumber}
        </span>
      </div>

      <main className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section">
        {/* Title Header */}
        <div className="border-b border-outline pb-gutter-md sm:pb-gutter-lg mb-gutter-lg sm:mb-gutter-xl flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-sm sm:gap-gutter-md">
          <div className="flex flex-col gap-1">
            <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest tabular-nums">
              ORDER #{order.orderNumber} // {order.status.replace(/_/g, ' ')}
            </span>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              PARCEL TRACKING
            </h1>
          </div>
          <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface bg-surface-container border border-outline px-3 py-2 tabular-nums w-fit">
            EST. ARRIVAL: {order.estimatedDelivery}
          </span>
        </div>

        {/* Desktop 4-Step Progress Bar */}
        <div className="hidden md:grid md:grid-cols-4 border border-outline bg-surface-container mb-gutter-xl">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep >= stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={step.num}
                className={`p-gutter-lg border-r last:border-r-0 border-outline flex flex-col gap-gutter-xs ${
                  isCompleted ? 'bg-surface-container-high' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-label text-label-sm uppercase font-mono ${
                      isCompleted ? 'text-accent' : 'text-on-surface-variant'
                    }`}
                  >
                    {step.num} // {step.title}
                  </span>
                  {isCompleted && <Check className="w-4 h-4 text-accent" />}
                </div>
                <span className="font-body text-title-md uppercase text-on-surface font-semibold">
                  {step.subtitle}
                </span>
                <span className="font-body text-body-md text-on-surface-variant tabular-nums">
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Connected Progress Timeline */}
        <div className="md:hidden bg-surface-container border border-outline p-gutter-md mb-gutter-lg flex flex-col gap-4">
          <span className="font-label text-[11px] uppercase text-accent tracking-widest border-b border-outline pb-2">
            WAYBILL PROGRESSION
          </span>

          <div className="relative pl-6 flex flex-col gap-4">
            {/* Connecting line */}
            <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-outline" />

            {steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isCompleted = currentStep >= stepNum;
              const isCurrent = currentStep === stepNum;

              return (
                <div key={step.num} className="relative flex flex-col gap-0.5">
                  {/* Step indicator dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 border flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-accent border-accent text-on-accent'
                        : 'bg-surface border-outline text-on-surface-variant'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`font-label text-xs uppercase font-bold tracking-wider ${
                        isCompleted ? 'text-accent' : 'text-on-surface-variant'
                      }`}
                    >
                      {step.num} // {step.title}
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant tabular-nums">
                      {step.time}
                    </span>
                  </div>
                  <span className="font-body text-title-sm uppercase text-on-surface">
                    {step.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column: Carrier Telemetry + Shipment Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Left 7 cols: Telemetry Events */}
          <div className="lg:col-span-7 bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-md">
            <h2 className="font-headline text-headline-md uppercase text-on-surface border-b border-outline pb-gutter-sm">
              CARRIER TELEMETRY
            </h2>

            <div className="flex flex-col gap-gutter-sm sm:gap-gutter-md">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-surface border border-outline">
                  <div
                    className={`w-6 h-6 border flex items-center justify-center shrink-0 mt-0.5 ${
                      event.completed
                        ? 'border-accent text-accent'
                        : 'border-outline text-on-surface-variant'
                    }`}
                  >
                    {event.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-title text-title-sm sm:text-title-md uppercase text-on-surface">
                      {event.title}
                    </span>
                    <span className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                      Location: {event.location}
                    </span>
                  </div>
                  <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tabular-nums shrink-0 font-mono">
                    {event.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Cancel Action (if eligible) */}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <div className="border-t border-outline pt-gutter-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {confirmCancel ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-label text-label-sm uppercase text-error">
                      Confirm cancel?
                    </span>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1.5 bg-error text-white font-label text-label-sm uppercase min-h-[36px]"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(false)}
                      className="px-3 py-1.5 border border-outline text-on-surface font-label text-label-sm uppercase min-h-[36px]"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmCancel(true)}
                    className="font-label text-label-sm uppercase text-on-surface-variant hover:text-error underline text-left min-h-[36px] flex items-center"
                  >
                    Cancel Order & Restock Units
                  </button>
                )}
                <span className="font-label text-[10px] uppercase text-on-surface-variant">
                  Eligible prior to final drop
                </span>
              </div>
            )}
          </div>

          {/* Right 5 cols: Destination & Contents */}
          <div className="lg:col-span-5 flex flex-col gap-gutter-lg">
            {/* Delivery Destination */}
            <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-sm font-label text-label-sm uppercase">
              <span className="text-accent tracking-widest border-b border-outline pb-2 text-[11px] sm:text-label-sm">
                DISPATCH DESTINATION
              </span>
              <span className="text-on-surface font-bold">{order.shippingAddress.fullName}</span>
              <span className="text-on-surface-variant">{order.shippingAddress.addressLine}</span>
              <span className="text-on-surface-variant">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </span>
              <span className="text-on-surface-variant">{order.shippingAddress.country}</span>
              <span className="text-on-surface-variant">Phone: {order.shippingAddress.phone}</span>
            </div>

            {/* Garment contents */}
            <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-md">
              <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest border-b border-outline pb-2">
                SHIPMENT CONTENTS ({order.items.length})
              </span>
              <div className="flex flex-col gap-gutter-sm divide-y divide-outline">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-2 flex items-center gap-3">
                    <div className="w-12 h-16 shrink-0">
                      <DuskImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        aspectRatio="3/4"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="font-body text-title-sm sm:text-title-md uppercase text-on-surface truncate">
                        {item.product.name}
                      </span>
                      <span className="font-label text-[11px] uppercase text-on-surface-variant">
                        Size {item.size} // Qty {item.quantity}
                      </span>
                    </div>
                    <span className="font-label text-label-sm text-on-surface tabular-nums shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline pt-gutter-sm flex justify-between font-headline text-headline-md text-on-surface">
                <span>TOTAL BILLED</span>
                <span className="text-accent tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
