'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { DuskImage } from '@/components/ui/DuskImage';
import { Truck, ArrowLeft, Download, ExternalLink, Package } from 'lucide-react';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  React.useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isHydrated, isAuthenticated, router]);

  const handleDownloadInvoice = (orderNumber: string) => {
    showToast(`DOWNLOADING INVOICE DISPATCH #${orderNumber}`, 'info');
  };

  return (
    <div className="bg-surface min-h-screen">
      <main className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section">
        <div className="border-b border-outline pb-gutter-md sm:pb-gutter-lg mb-gutter-md sm:mb-gutter-xl flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-sm sm:gap-gutter-md">
          <div className="flex flex-col gap-1">
            <Link
              href="/account"
              className="inline-flex items-center gap-1 font-label text-label-sm uppercase text-on-surface-variant hover:text-accent w-fit mb-1 min-h-[36px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
            </Link>
            <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
              DISPATCH ARCHIVE
            </span>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              ORDER HISTORY ({orders.length})
            </h1>
          </div>
          <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant bg-surface-container border border-outline px-3 py-2 w-fit">
            MEMBER RECORD // LIVE
          </span>
        </div>

        {/* Mobile Nav Strip */}
        <nav aria-label="Account navigation mobile" className="lg:hidden w-full flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-outline mb-gutter-lg">
          <Link
            href="/account"
            className="px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs uppercase shrink-0 hover:text-accent"
          >
            Profile & Addresses
          </Link>
          <Link
            href="/account/orders"
            className="px-3 py-2 bg-accent text-on-accent font-label text-xs uppercase font-bold shrink-0"
          >
            Order History ({orders.length})
          </Link>
          <Link
            href={`/tracking/${orders[0]?.orderNumber || 'DR-90482'}`}
            className="px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs uppercase shrink-0 hover:text-accent"
          >
            Track Active
          </Link>
          <Link
            href="/wishlist"
            className="px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs uppercase shrink-0 hover:text-accent"
          >
            Wishlist ({wishlistCount})
          </Link>
        </nav>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="flex flex-col gap-gutter-lg">
            {orders.map((order) => (
              <article
                key={order.id}
                className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-md sm:gap-gutter-lg"
              >
                {/* Header Strip of Order Card */}
                <div className="flex flex-wrap items-center justify-between gap-gutter-sm sm:gap-gutter-md border-b border-outline pb-gutter-md font-label text-label-sm uppercase">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-gutter-md">
                    <span className="font-headline text-headline-md text-on-surface tabular-nums">
                      ORDER #{order.orderNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 border text-xs font-bold ${
                        order.status === 'DELIVERED'
                          ? 'bg-surface text-on-surface-variant border-outline'
                          : order.status === 'CANCELLED'
                          ? 'bg-surface text-error border-error'
                          : 'bg-surface text-accent border-accent'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-gutter-lg text-on-surface-variant text-xs sm:text-label-sm">
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="text-on-surface font-headline text-title-lg tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-sm sm:gap-gutter-md">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 bg-surface-container-low border border-outline"
                    >
                      <div className="w-12 h-16 shrink-0">
                        <DuskImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          aspectRatio="3/4"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title text-title-sm sm:text-title-md uppercase text-on-surface truncate">
                          {item.product.name}
                        </span>
                        <span className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant">
                          Size {item.size} // Qty {item.quantity}
                        </span>
                        <span className="font-label text-[11px] sm:text-label-sm text-accent tabular-nums font-semibold">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions: Track parcel / Download invoice */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-outline pt-gutter-md gap-3">
                  <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant">
                    Waybill: {order.trackingNumber} via {order.carrier}
                  </span>

                  <div className="flex items-center gap-2 sm:gap-gutter-md">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(order.orderNumber)}
                      className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 px-3 py-2 border border-outline"
                    >
                      <Download className="w-3.5 h-3.5" /> Invoice Slip
                    </button>

                    <Link
                      href={`/tracking/${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 bg-accent text-on-accent font-label text-xs sm:text-label-sm uppercase px-3 sm:px-gutter-md py-2 border border-accent hover:bg-primary hover:text-on-primary font-semibold"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Telemetry</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center gap-4 bg-surface-container border border-outline p-gutter-lg">
            <span className="font-headline text-headline-md uppercase text-on-surface">
              NO PREVIOUS DISPATCHES
            </span>
            <p className="text-on-surface-variant max-w-sm font-body text-body-md">
              You haven't placed any orders with DUSK RIOT yet. Browse our current drops to order your first piece.
            </p>
            <Link
              href="/shop"
              className="bg-accent text-on-accent font-label text-label-sm uppercase px-gutter-lg py-3"
            >
              Shop Current Drop
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
