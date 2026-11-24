'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCartStore } from '@/stores/useCartStore';
import { showToast } from '@/components/ui/Toast';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DuskImage } from '@/components/ui/DuskImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  const inWishlist = isInWishlist(product.id);
  const primaryVariant = product.variants[0] || {
    id: 'default',
    sku: product.sku,
    size: 'M',
    color: 'Default',
    colorHex: '#111',
    stock: 10,
    price: product.price,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, primaryVariant, 1);
    showToast(`ADDED ${product.name.toUpperCase()} (SIZE ${primaryVariant.size}) TO BAG`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!inWishlist) {
      showToast(`SAVED ${product.name.toUpperCase()} TO WISHLIST`);
    } else {
      showToast(`REMOVED ${product.name.toUpperCase()} FROM WISHLIST`, 'info');
    }
  };

  return (
    <article className="group bg-surface-container border border-outline hover:border-primary transition-all duration-state-change flex flex-col h-full">
      {/* Visual Image container with 3/4 aspect ratio */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[3/4] bg-surface-container-low overflow-hidden block"
      >
        <DuskImage
          src={product.images[0]}
          alt={product.name}
          aspectRatio="3/4"
          className="group-hover:scale-105 transition-transform duration-image-hover ease-image-hover"
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 z-10 max-w-[70%]">
          {product.isNewArrival && (
            <span className="bg-accent text-on-accent font-label text-[9px] sm:text-[11px] uppercase px-1 sm:px-1.5 py-0.5 tracking-wider font-bold truncate">
              NEW DROP
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-surface text-accent border border-accent font-label text-[9px] sm:text-[11px] uppercase px-1 sm:px-1.5 py-0.5 tracking-wider font-semibold truncate">
              SAVE ${(product.originalPrice - product.price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border transition-colors z-10 ${
            inWishlist
              ? 'bg-accent text-on-accent border-accent'
              : 'bg-surface/85 text-on-surface border-outline hover:border-accent hover:text-accent'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover / Accessible */}
        <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 bg-surface/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2 sm:py-2.5 bg-accent text-on-accent font-label text-[11px] sm:text-label-sm uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-primary hover:text-on-primary transition-colors font-bold"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag ({primaryVariant.size})</span>
          </button>
        </div>
      </Link>

      {/* Garment Meta */}
      <div className="p-2 sm:p-gutter-md flex flex-col justify-between gap-1 sm:gap-gutter-sm flex-1 border-t border-outline">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className="flex items-center justify-between gap-1">
            <span className="font-label text-[9px] sm:text-[11px] uppercase text-accent tracking-wider sm:tracking-widest truncate font-mono">
              {product.sku}
            </span>
            <span className="font-label text-[9px] sm:text-[11px] uppercase text-on-surface-variant truncate">
              {product.category}
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="font-title text-xs sm:text-title-md uppercase text-on-surface hover:text-accent transition-colors line-clamp-1 font-semibold"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-1 border-t border-outline-variant">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-headline text-sm sm:text-headline-md text-on-surface tabular-nums font-bold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-label text-[10px] sm:text-label-sm line-through text-on-surface-variant tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="hidden xs:inline font-label text-[9px] sm:text-[11px] uppercase text-on-surface-variant tabular-nums">
            {product.variants.reduce((acc, v) => acc + v.stock, 0)} IN STOCK
          </span>
        </div>
      </div>
    </article>
  );
}
