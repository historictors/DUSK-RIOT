'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { DuskImage } from '@/components/ui/DuskImage';
import { Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items: wishlistIds, removeFromWishlist, clearWishlist } = useWishlistStore();
  const products = useProductStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleMoveToBag = (product: typeof products[0]) => {
    const variant = product.variants[0] || {
      id: 'default',
      sku: product.sku,
      size: 'M',
      color: 'Default',
      colorHex: '#111',
      stock: 10,
      price: product.price,
    };
    addItem(product, variant, 1);
    removeFromWishlist(product.id);
    showToast(`MOVED ${product.name.toUpperCase()} TO BAG`);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="bg-surface min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border border-outline bg-surface-container flex items-center justify-center text-accent mb-4">
          <Heart className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
          VAULT EMPTY
        </span>
        <h1 className="font-display text-display-lg-mobile sm:text-display-lg uppercase text-on-surface mt-1">
          NO SAVED SILHOUETTES
        </h1>
        <p className="font-body text-body-md text-on-surface-variant max-w-sm mt-2 mb-6 text-pretty">
          Save your favorite garments to review sizing, check limited run drops, or order later.
        </p>
        <Link
          href="/shop"
          className="bg-accent text-on-accent font-label text-label-sm sm:text-label-lg uppercase px-6 sm:px-gutter-xl py-3.5 border border-accent hover:bg-primary hover:text-on-primary transition-colors font-bold"
        >
          Browse All Garments
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      <section className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section">
        {/* Header Strip */}
        <div className="border-b border-outline pb-gutter-md sm:pb-gutter-lg mb-gutter-md sm:mb-gutter-xl flex items-end justify-between gap-gutter-md">
          <div className="flex flex-col gap-1">
            <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
              SAVED SILHOUETTES // ARCHIVE
            </span>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              YOUR WISHLIST ({wishlistProducts.length})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearWishlist}
            className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-error underline min-h-[36px] flex items-center"
          >
            Clear Wishlist
          </button>
        </div>

        {/* 2-Column Mobile, 3-Column Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
          {wishlistProducts.map((product) => (
            <article
              key={product.id}
              className="bg-surface-container border border-outline flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden group">
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                  <DuskImage
                    src={product.images[0]}
                    alt={product.name}
                    aspectRatio="3/4"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label="Remove item"
                  className="absolute top-2 right-2 p-2 bg-surface/90 text-on-surface hover:text-error border border-outline z-10 touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2.5 sm:p-gutter-md flex flex-col gap-1.5 sm:gap-gutter-sm border-t border-outline">
                <div className="flex items-center justify-between">
                  <span className="font-label text-[10px] sm:text-[11px] uppercase text-accent font-mono truncate max-w-[50%]">
                    {product.sku}
                  </span>
                  <span className="font-headline text-title-md sm:text-headline-md text-on-surface tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  className="font-title text-title-sm sm:text-title-md uppercase text-on-surface hover:text-accent truncate"
                >
                  {product.name}
                </Link>

                <div className="flex gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(product)}
                    className="flex-1 py-2 sm:py-2.5 bg-accent text-on-accent font-label text-[11px] sm:text-label-sm uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-2 hover:bg-primary hover:text-on-primary transition-colors font-bold touch-manipulation min-h-[38px]"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">Move to Bag</span>
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    className="p-2 sm:p-2.5 bg-surface-container-low border border-outline hover:border-primary text-on-surface flex items-center justify-center shrink-0 min-w-[38px] min-h-[38px]"
                    aria-label="View product details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
