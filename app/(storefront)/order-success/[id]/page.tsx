'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrderStore } from '@/stores/useOrderStore';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2, ArrowRight, Truck, Package, Clock, ExternalLink } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const getOrder = useOrderStore((state) => state.getOrderById);
  const getOrderByNumber = useOrderStore((state) => state.getOrderByNumber);

  const order = getOrder(orderId) || getOrderByNumber(orderId);

  return (
    <div className="bg-surface min-h-[80vh] flex flex-col justify-center">
      <section className="max-w-[800px] w-full mx-auto px-gutter-md md:px-page-margin py-section">
        <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-xl">
          {/* Success Banner */}
          <div className="border-b border-outline pb-gutter-lg flex flex-col items-center text-center gap-gutter-sm">
            <div className="w-16 h-16 bg-surface border border-accent flex items-center justify-center text-accent">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="font-label text-label-sm uppercase text-accent tracking-widest">
              DISPATCH CONFIRMED // LOGGED
            </span>
            <h1 className="font-display text-display-lg uppercase text-on-surface">
              ORDER RECEIVED
            </h1>
            <p className="font-body text-body-md text-on-surface-variant max-w-md">
              Your garments have entered the NYC studio fulfillment pipeline. Waybill telemetry has been generated.
            </p>
          </div>

          {/* Order Details Badge Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-sm bg-surface-container-low border border-outline p-gutter-md font-label text-label-sm uppercase">
            <div className="flex flex-col">
              <span className="text-on-surface-variant">Order Number</span>
              <span className="text-accent font-bold tabular-nums">
                {order?.orderNumber || orderId}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant">Waybill Number</span>
              <span className="text-on-surface tabular-nums">
                {order?.trackingNumber || 'DRX-7749201'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant">Est. Delivery</span>
              <span className="text-on-surface">{order?.estimatedDelivery || '3–5 Days'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant">Amount Paid</span>
              <span className="text-accent font-bold tabular-nums">
                {order ? formatPrice(order.total) : '$0.00'}
              </span>
            </div>
          </div>

          {/* Shipment Items */}
          {order && (
            <div className="flex flex-col gap-gutter-sm">
              <span className="font-label text-label-sm uppercase text-on-surface-variant">
                Shipment Contents ({order.items.length})
              </span>
              <div className="divide-y divide-outline border border-outline bg-surface">
                {order.items.map((item) => (
                  <div key={item.id} className="p-gutter-md flex items-center justify-between gap-gutter-md">
                    <div className="flex items-center gap-gutter-md">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-16 object-cover border border-outline shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="font-body text-title-md uppercase text-on-surface">
                          {item.product.name}
                        </span>
                        <span className="font-label text-label-sm uppercase text-on-surface-variant">
                          Size {item.size} // Qty {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-label text-label-sm text-on-surface tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-gutter-md border-t border-outline pt-gutter-lg">
            <Link
              href={`/tracking/${order?.orderNumber || orderId}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-label text-label-lg uppercase px-gutter-xl py-3.5 border border-accent hover:bg-primary hover:text-on-primary transition-colors text-center"
            >
              <Truck className="w-4 h-4" />
              <span>Track Parcel Telemetry</span>
            </Link>

            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-label text-label-lg uppercase px-gutter-xl py-3.5 border border-outline hover:border-primary transition-colors text-center"
            >
              <span>Return to Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
