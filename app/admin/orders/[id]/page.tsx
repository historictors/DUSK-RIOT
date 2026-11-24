'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useOrderStore } from '@/stores/useOrderStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, Save, Printer, Truck, ExternalLink, ShieldCheck } from 'lucide-react';
import { OrderStatus } from '@/types';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { getOrderById, getOrderByNumber, updateOrderStatus, updateOrderCourier } = useOrderStore();
  const order = getOrderById(id) || getOrderByNumber(id);

  const [status, setStatus] = useState<OrderStatus>(order?.status || 'SHIPPED');
  const [carrier, setCarrier] = useState(order?.carrier || 'DHL Express Tracked');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || 'DRX-7749201');

  if (!order) {
    return (
      <div className="p-12 text-center">
        <h2 className="font-headline text-headline-lg uppercase text-on-surface">Order Not Found</h2>
        <Link href="/admin/orders" className="text-accent underline mt-4 inline-block">
          Return to Orders
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, status);
    updateOrderCourier(order.id, carrier, trackingNumber);
    showToast(`SAVED TELEMETRY FOR ORDER #${order.orderNumber}`, 'success');
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={`PACKING SLIP // ORDER #${order.orderNumber}`}
        subtitle={`LOGGED: ${formatDate(order.createdAt)} // STATUS: ${order.status}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSlip}
              type="button"
              className="inline-flex items-center gap-1 font-label text-label-sm uppercase px-3 py-1.5 border border-outline hover:border-primary text-on-surface"
            >
              <Printer className="w-3.5 h-3.5" /> Print Slip
            </button>
            <Link
              href={`/tracking/${order.orderNumber}`}
              target="_blank"
              className="inline-flex items-center gap-1 font-label text-label-sm uppercase px-3 py-1.5 bg-accent text-on-accent font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Tracking
            </Link>
          </div>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-5xl mx-auto w-full flex flex-col gap-gutter-xl">
        {/* Top Status & Telemetry Editor */}
        <form
          onSubmit={handleSave}
          className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg font-label text-label-sm uppercase"
        >
          <div className="flex items-center justify-between border-b border-outline pb-gutter-sm">
            <h2 className="font-headline text-headline-md text-on-surface">
              UPDATE FULFILLMENT & CARRIER TELEMETRY
            </h2>
            <button
              type="submit"
              className="bg-accent text-on-accent font-label text-label-sm uppercase px-4 py-2 border border-accent hover:bg-primary font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Telemetry
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
              >
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Carrier</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Waybill Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-accent font-bold focus:border-accent tabular-nums"
              />
            </div>
          </div>
        </form>

        {/* 2-Column: Destination & Order Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-xl font-label text-label-sm uppercase">
          {/* Customer / Address */}
          <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-sm">
            <span className="text-accent tracking-widest border-b border-outline pb-2">
              DISPATCH DESTINATION
            </span>
            <span className="font-bold text-on-surface text-base">
              {order.shippingAddress.fullName}
            </span>
            <span className="text-on-surface-variant">{order.shippingAddress.addressLine}</span>
            <span className="text-on-surface-variant">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </span>
            <span className="text-on-surface-variant">{order.shippingAddress.country}</span>
            <span className="text-on-surface-variant">Phone: {order.shippingAddress.phone}</span>
            <span className="text-on-surface-variant lowercase">Email: {order.customerEmail}</span>
          </div>

          {/* Billing Summary */}
          <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col justify-between gap-gutter-sm">
            <span className="text-accent tracking-widest border-b border-outline pb-2">
              BILLING SPECIFICATION
            </span>
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal:</span>
              <span className="text-on-surface tabular-nums">{formatPrice(order.subtotal)}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-accent">
                <span>Promo Discount ({order.couponCode}):</span>
                <span className="tabular-nums">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Shipping Fee:</span>
              <span className="text-on-surface tabular-nums">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-outline pt-2 text-on-surface font-headline text-headline-md">
              <span>TOTAL:</span>
              <span className="text-accent tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Packing List Items Table */}
        <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-md">
          <h3 className="font-headline text-headline-md uppercase text-on-surface border-b border-outline pb-2">
            GARMENT PACKING LIST ({order.items.length} SILHOUETTES)
          </h3>

          <div className="divide-y divide-outline">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-gutter-md">
                <div className="flex items-center gap-gutter-md">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-18 object-cover border border-outline shrink-0 aspect-[3/4]"
                  />
                  <div className="flex flex-col">
                    <span className="font-title text-title-md uppercase text-on-surface">
                      {item.product.name}
                    </span>
                    <span className="font-label text-label-sm uppercase text-on-surface-variant">
                      SKU: {item.product.sku} // Size: {item.size} // {item.color}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-gutter-xl font-label text-label-sm uppercase">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-headline text-headline-md text-on-surface tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
