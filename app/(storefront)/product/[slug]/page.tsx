'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { ProductCard } from '@/components/storefront/ProductCard';
import { DuskImage } from '@/components/ui/DuskImage';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { GarmentSize } from '@/types';
import {
  ShoppingBag,
  Heart,
  Ruler,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
  Share2,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const products = useProductStore((state) => state.products);
  const product = products.find((p) => p.slug === slug) || products[0];

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<GarmentSize>(
    (product?.variants[0]?.size as GarmentSize) || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mainActionsRef.current) {
        const rect = mainActionsRef.current.getBoundingClientRect();
        // If bottom of main actions is above the viewport, show sticky bar
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return notFound();
  }

  const inWishlist = isInWishlist(product.id);

  const activeVariant =
    product.variants.find((v) => v.size === selectedSize) || product.variants[0];

  const stock = activeVariant?.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Selected variant is currently out of stock.', 'error');
      return;
    }
    addItem(product, activeVariant, quantity);
    showToast(
      `ADDED ${quantity}x ${product.name.toUpperCase()} (SIZE ${selectedSize}) TO BAG`,
      'success'
    );
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    if (!inWishlist) {
      showToast(`SAVED ${product.name.toUpperCase()} TO WISHLIST`);
    } else {
      showToast(`REMOVED ${product.name.toUpperCase()} FROM WISHLIST`, 'info');
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  return (
    <div className="bg-surface overflow-x-hidden min-h-screen pb-16 lg:pb-0">
      {/* Breadcrumb Strip */}
      <div className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-gutter-sm font-label text-[10px] sm:text-label-sm uppercase overflow-x-auto whitespace-nowrap">
          <Link href="/shop" className="text-on-surface-variant hover:text-accent shrink-0">
            Shop All
          </Link>
          <span className="text-on-surface-variant shrink-0">/</span>
          <Link
            href={`/category/${product.categorySlug}`}
            className="text-on-surface-variant hover:text-accent shrink-0"
          >
            {product.category}
          </Link>
          <span className="text-on-surface-variant shrink-0">/</span>
          <span className="text-accent truncate font-mono">{product.sku}</span>
        </div>
      </div>

      {/* Main 7 / 5 Editorial Product Grid */}
      <section className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-4 sm:py-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Left 7 Columns: Garment Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-2 sm:gap-gutter-md">
            {/* Primary Image View */}
            <div className="aspect-[3/4] bg-surface-container border border-outline overflow-hidden relative group">
              <DuskImage
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                aspectRatio="3/4"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-surface/90 border border-outline px-2 py-0.5 sm:py-1 font-label text-[9px] sm:text-[11px] uppercase text-accent tracking-widest font-mono">
                ANGLE {selectedImageIndex + 1} / {product.images.length || 1}
              </div>
            </div>

            {/* Thumbnail Strip (Horizontal Touch Scroll on Mobile) */}
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-gutter-sm overflow-x-auto pb-1">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 sm:w-20 aspect-[3/4] bg-surface-container border overflow-hidden shrink-0 transition-colors ${
                      selectedImageIndex === idx
                        ? 'border-accent ring-1 ring-accent'
                        : 'border-outline hover:border-primary'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right 5 Columns: Spec & Action Panel */}
          <div className="lg:col-span-5 bg-surface-container border border-outline p-4 sm:p-gutter-xl flex flex-col gap-4 sm:gap-gutter-lg lg:sticky lg:top-20">
            {/* Header Block */}
            <div className="flex flex-col gap-1.5 sm:gap-gutter-sm border-b border-outline pb-3 sm:pb-gutter-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
                  DROP 04 // SKU {activeVariant.sku || product.sku}
                </span>
                <span
                  className={`font-label text-[10px] sm:text-label-sm uppercase px-1.5 sm:px-2 py-0.5 border font-semibold ${
                    stock > 0
                      ? 'bg-surface text-accent border-accent'
                      : 'bg-surface text-error border-error'
                  }`}
                >
                  {stock > 0 ? `IN STOCK (${stock})` : 'OUT OF STOCK'}
                </span>
              </div>

              <h1 className="font-headline text-xl sm:text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
                {product.name}
              </h1>

              <div className="flex items-baseline justify-between pt-1">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="font-headline text-xl sm:text-headline-md text-on-surface tabular-nums font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="font-label text-xs sm:text-label-md line-through text-on-surface-variant tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant">
                  {activeVariant.color || 'OBSIDIAN'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-xs sm:text-body-md text-on-surface-variant text-pretty leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface font-semibold">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-label text-xs sm:text-label-sm uppercase text-accent hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Garment size">
                {(['S', 'M', 'L', 'XL'] as GarmentSize[]).map((sz) => {
                  const variant = product.variants.find((v) => v.size === sz);
                  const isAvailable = variant ? variant.stock > 0 : true;
                  const isSelected = selectedSize === sz;

                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz)}
                      className={`font-label text-sm sm:text-label-lg uppercase py-2.5 sm:py-3 border transition-colors min-h-[44px] ${
                        isSelected
                          ? 'bg-accent text-on-accent border-accent font-bold'
                          : isAvailable
                          ? 'bg-surface-container-low text-on-surface-variant border-outline hover:border-primary hover:text-on-surface'
                          : 'bg-surface-container-low text-on-surface-variant/30 border-outline/50 line-through cursor-not-allowed'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between border-t border-outline pt-3 sm:pt-gutter-md">
              <span className="font-label text-xs sm:text-label-sm uppercase text-on-surface font-semibold">
                Quantity
              </span>
              <div className="inline-flex items-center border border-outline bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-accent font-bold text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 sm:px-4 font-label text-sm sm:text-label-md tabular-nums text-on-surface font-bold">
                  {quantity < 10 ? `0${quantity}` : quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= stock}
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-accent font-bold text-lg disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons Container */}
            <div ref={mainActionsRef} className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent text-on-accent font-label text-sm sm:text-label-lg uppercase tracking-wider px-4 sm:px-gutter-xl py-3.5 sm:py-4 border border-accent hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  {isOutOfStock
                    ? 'Out of Stock'
                    : `Add to Bag — ${formatPrice(product.price * quantity)}`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-label text-xs sm:text-label-lg uppercase tracking-wider px-4 sm:px-gutter-xl py-3 sm:py-3.5 border border-outline hover:border-primary transition-colors"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'text-accent fill-current' : ''}`} />
                <span>{inWishlist ? 'In Your Wishlist' : 'Save to Wishlist'}</span>
              </button>
            </div>

            {/* Specifications Strip */}
            <div className="border-t border-outline pt-3 sm:pt-gutter-md flex flex-col gap-3 font-label text-xs sm:text-label-sm uppercase">
              <div className="flex flex-col gap-1.5 text-on-surface-variant">
                <span className="text-on-surface font-bold">Garment Specifications:</span>
                {product.details?.map((d, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-accent">•</span>
                    <span>{d}</span>
                  </div>
                ))}
                <div className="flex items-start gap-1.5">
                  <span className="text-accent">•</span>
                  <span>Fabric: {product.materials}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-accent">•</span>
                  <span>Fit: {product.fit}</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-2 border-t border-outline pt-3 text-[10px] sm:text-xs font-label uppercase text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Express Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Numbered Run</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Silhouettes (2-Col Mobile Grid) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-outline bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-8 sm:py-section">
            <div className="border-b border-outline pb-3 sm:pb-gutter-lg mb-4 sm:mb-gutter-xl flex items-end justify-between">
              <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
                  COMPLEMENTARY SILHOUETTES
                </span>
                <h2 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
                  COMPLETE THE LOOK
                </h2>
              </div>
              <Link
                href="/shop"
                className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-accent"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Bag Bar (Shows on Mobile when scrolled past hero buttons) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-surface-container/95 backdrop-blur-md border-t border-outline p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-12 shrink-0">
              <DuskImage
                src={product.images[0]}
                alt={product.name}
                aspectRatio="3/4"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title text-xs uppercase text-on-surface truncate font-semibold">
                {product.name}
              </span>
              <div className="flex items-center gap-1.5 font-label text-[10px] uppercase">
                <span className="text-accent font-bold tabular-nums">
                  {formatPrice(product.price)}
                </span>
                <span className="text-on-surface-variant">Size {selectedSize}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-4 py-2.5 bg-accent text-on-accent font-label text-xs uppercase font-bold tracking-wider shrink-0 disabled:opacity-40"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
      )}

      {/* Size Guide Modal (Mobile Responsive) */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog">
          <div
            className="fixed inset-0 bg-surface/90 backdrop-blur-md"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-surface-container border border-outline p-4 sm:p-gutter-xl shadow-2xl z-10 flex flex-col gap-3 sm:gap-gutter-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline pb-3">
              <div className="flex flex-col">
                <span className="font-label text-[10px] uppercase text-accent tracking-widest font-mono">
                  MEASUREMENT MATRIX
                </span>
                <h3 className="font-headline text-lg sm:text-headline-md uppercase text-on-surface">
                  DUSK RIOT BOXY FIT GUIDE
                </h3>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1.5 border border-outline hover:border-accent text-on-surface hover:text-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body text-xs sm:text-body-md text-on-surface-variant">
              All garments are engineered with relaxed streetwear proportions and dropped shoulders. Measurements in inches.
            </p>

            <div className="overflow-x-auto border border-outline">
              <table className="w-full text-left font-label text-xs sm:text-label-sm uppercase border-collapse">
                <thead>
                  <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant">
                    <th className="p-2 sm:p-2.5">Size</th>
                    <th className="p-2 sm:p-2.5">Chest</th>
                    <th className="p-2 sm:p-2.5">Length</th>
                    <th className="p-2 sm:p-2.5">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface divide-y divide-outline-variant">
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold text-accent">S</td>
                    <td className="p-2 sm:p-2.5">23.5"</td>
                    <td className="p-2 sm:p-2.5">27.0"</td>
                    <td className="p-2 sm:p-2.5">24.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold text-accent">M</td>
                    <td className="p-2 sm:p-2.5">25.0"</td>
                    <td className="p-2 sm:p-2.5">28.0"</td>
                    <td className="p-2 sm:p-2.5">25.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold text-accent">L</td>
                    <td className="p-2 sm:p-2.5">26.5"</td>
                    <td className="p-2 sm:p-2.5">29.0"</td>
                    <td className="p-2 sm:p-2.5">26.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold text-accent">XL</td>
                    <td className="p-2 sm:p-2.5">28.0"</td>
                    <td className="p-2 sm:p-2.5">30.0"</td>
                    <td className="p-2 sm:p-2.5">27.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="mt-2 w-full py-3 bg-accent text-on-accent font-label text-xs uppercase font-bold"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
