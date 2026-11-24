'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Filter, SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import { GarmentSize } from '@/types';

export default function ShopPage() {
  const products = useProductStore((state) => state.products);
  const categories = useProductStore((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileDrawerOpen]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
          return false;
        }
        if (selectedSize !== 'all') {
          const hasSize = product.variants.some(
            (v) => v.size === selectedSize && (!inStockOnly || v.stock > 0)
          );
          if (!hasSize) return false;
        }
        if (product.price > maxPrice) {
          return false;
        }
        if (inStockOnly) {
          const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
          if (totalStock <= 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSize, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setMaxPrice(350);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    maxPrice < 350 ||
    inStockOnly;

  return (
    <div className="bg-surface overflow-x-hidden min-h-screen">
      {/* Shop Header Banner */}
      <div className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-4 sm:py-gutter-xl flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-gutter-md">
          <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
            <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
              DISPATCH CATALOG // COMPLETE ROSTER
            </span>
            <h1 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              SHOP ALL GARMENTS
            </h1>
          </div>
          <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant bg-surface-container px-2 sm:px-gutter-md py-1 sm:py-2 border border-outline tabular-nums w-fit">
            {filteredProducts.length} GARMENTS AVAILABLE
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-4 sm:py-section">
        {/* Controls Toolbar */}
        <div className="flex items-center justify-between gap-2 sm:gap-gutter-md pb-3 sm:pb-gutter-lg border-b border-outline mb-4 sm:mb-gutter-xl">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container border border-outline text-on-surface font-label text-xs sm:text-label-sm uppercase hover:border-primary shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-accent" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            )}
          </button>

          {/* Quick Active Filter Pills on Tablet/Desktop */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap min-w-0">
            {hasActiveFilters && (
              <>
                <span className="font-label text-label-sm uppercase text-on-surface-variant">
                  Active:
                </span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 font-label text-[11px] uppercase px-2 py-1 bg-surface-container text-accent border border-outline">
                    {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3 hover:text-on-surface" />
                    </button>
                  </span>
                )}
                {selectedSize !== 'all' && (
                  <span className="inline-flex items-center gap-1 font-label text-[11px] uppercase px-2 py-1 bg-surface-container text-accent border border-outline">
                    Size: {selectedSize}
                    <button onClick={() => setSelectedSize('all')}>
                      <X className="w-3 h-3 hover:text-on-surface" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 font-label text-[11px] uppercase px-2 py-1 bg-surface-container text-accent border border-outline">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3 hover:text-on-surface" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="font-label text-xs uppercase text-on-surface-variant hover:text-error flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <span className="hidden xs:inline font-label text-xs sm:text-label-sm uppercase text-on-surface-variant">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container text-on-surface font-label text-xs sm:text-label-sm uppercase px-2 sm:px-3 py-2 border border-outline focus:border-accent focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low</option>
              <option value="price-desc">Price: High</option>
            </select>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filter + 2-Col Mobile Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:flex lg:col-span-3 bg-surface-container border border-outline p-gutter-lg flex-col gap-gutter-xl sticky top-20">
            <div className="flex items-center justify-between border-b border-outline pb-gutter-sm">
              <span className="font-label text-label-sm uppercase text-accent tracking-widest font-mono">
                GARMENT FILTERS
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="font-label text-label-sm uppercase text-on-surface-variant hover:text-error"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-gutter-sm">
              <span className="font-label text-label-sm uppercase text-on-surface font-semibold">
                Categories
              </span>
              <div className="flex flex-col gap-1.5 font-label text-label-sm uppercase">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`text-left py-1.5 px-2 border transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-accent text-on-accent border-accent font-bold'
                      : 'text-on-surface-variant border-transparent hover:text-on-surface'
                  }`}
                >
                  All Garments ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categorySlug === cat.slug).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left py-1.5 px-2 border transition-colors flex justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-accent text-on-accent border-accent font-bold'
                          : 'text-on-surface-variant border-transparent hover:text-on-surface'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="tabular-nums">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col gap-gutter-sm border-t border-outline pt-gutter-md">
              <span className="font-label text-label-sm uppercase text-on-surface font-semibold">
                Garment Size
              </span>
              <div className="grid grid-cols-4 gap-1">
                {(['all', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 font-label text-label-sm uppercase border text-center transition-colors ${
                      selectedSize === sz
                        ? 'bg-accent text-on-accent border-accent font-bold'
                        : 'bg-surface-container-low text-on-surface-variant border-outline hover:border-primary hover:text-on-surface'
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-gutter-sm border-t border-outline pt-gutter-md">
              <div className="flex items-center justify-between font-label text-label-sm uppercase">
                <span className="text-on-surface font-semibold">Max Price</span>
                <span className="text-accent tabular-nums font-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="350"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-accent bg-surface-container-low cursor-pointer"
              />
              <div className="flex justify-between font-label text-[11px] text-on-surface-variant">
                <span>$50</span>
                <span>$350</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="flex items-center justify-between border-t border-outline pt-gutter-md">
              <label
                htmlFor="desktop-instock"
                className="font-label text-label-sm uppercase text-on-surface cursor-pointer"
              >
                In Stock Units Only
              </label>
              <input
                id="desktop-instock"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-accent bg-surface-container-low border-outline rounded-none focus:ring-0 cursor-pointer"
              />
            </div>
          </aside>

          {/* Product Grid (9 cols on desktop, 2-col on mobile!) */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container border border-outline p-8 sm:p-16 text-center flex flex-col items-center justify-center gap-gutter-md">
                <span className="font-headline text-lg sm:text-headline-lg uppercase text-on-surface">
                  NO GARMENTS FOUND
                </span>
                <p className="font-body text-xs sm:text-body-md text-on-surface-variant max-w-sm">
                  No streetwear silhouettes match your active filters. Try resetting filters or widening price thresholds.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 bg-accent text-on-accent font-label text-xs sm:text-label-lg uppercase px-gutter-lg py-2.5 sm:py-3 border border-accent hover:bg-primary hover:text-on-primary font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-surface/85 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <aside className="relative ml-auto w-full max-w-xs h-full bg-surface-container border-l border-outline p-gutter-md flex flex-col justify-between z-10 overflow-y-auto">
            <div className="flex flex-col gap-gutter-lg">
              <div className="flex items-center justify-between border-b border-outline pb-3">
                <span className="font-label text-label-sm uppercase text-accent font-mono tracking-wider">
                  FILTER SILHOUETTES
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 border border-outline hover:border-accent text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-2">
                <span className="font-label text-xs uppercase text-on-surface font-bold">
                  Categories
                </span>
                <div className="flex flex-col gap-1 font-label text-xs uppercase">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-left py-2 px-2.5 border ${
                      selectedCategory === 'all'
                        ? 'bg-accent text-on-accent border-accent font-bold'
                        : 'bg-surface-container-low text-on-surface-variant border-outline'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`text-left py-2 px-2.5 border ${
                        selectedCategory === c.slug
                          ? 'bg-accent text-on-accent border-accent font-bold'
                          : 'bg-surface-container-low text-on-surface-variant border-outline'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="flex flex-col gap-2 border-t border-outline pt-3">
                <span className="font-label text-xs uppercase text-on-surface font-bold">
                  Size
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(['all', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 font-label text-xs uppercase border text-center ${
                        selectedSize === sz
                          ? 'bg-accent text-on-accent border-accent font-bold'
                          : 'bg-surface-container-low text-on-surface-variant border-outline'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="flex flex-col gap-2 border-t border-outline pt-3">
                <div className="flex justify-between font-label text-xs uppercase">
                  <span className="text-on-surface font-bold">Max Price</span>
                  <span className="text-accent font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="350"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              {/* In stock */}
              <div className="flex items-center justify-between border-t border-outline pt-3 font-label text-xs uppercase">
                <span className="text-on-surface font-bold">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-accent bg-surface-container-low border-outline"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-outline pt-4 mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 bg-accent text-on-accent font-label text-xs uppercase font-bold text-center"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-3 border border-outline text-on-surface-variant font-label text-xs uppercase"
                >
                  Reset
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
