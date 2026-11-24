'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProductStore } from '@/stores/useProductStore';
import { ProductCard } from '@/components/storefront/ProductCard';
import { DuskImage } from '@/components/ui/DuskImage';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const categories = useProductStore((state) => state.categories);
  const products = useProductStore((state) => state.products);

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  if (!category && categories.length > 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-gutter-md py-section text-center">
        <h1 className="font-display text-headline-lg uppercase text-on-surface">Category Not Found</h1>
        <p className="mt-2 text-on-surface-variant font-body text-body-md">The requested garment division does not exist.</p>
        <Link href="/shop" className="mt-4 inline-block text-accent underline font-label text-label-sm uppercase">
          Return to All Garments
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Category Hero Banner */}
      <div className="relative border-b border-outline bg-surface-container overflow-hidden min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] flex items-end">
        {category?.image && (
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-gutter-xl flex flex-col gap-gutter-xs sm:gap-gutter-sm">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 font-label text-label-sm uppercase text-on-surface-variant hover:text-accent w-fit mb-1 min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Silhouettes
          </Link>
          <span className="font-label text-label-sm uppercase text-accent tracking-widest text-[11px] sm:text-xs">
            GARMENT DIVISION // ARCHIVE
          </span>
          <h1 className="font-display text-display-lg-mobile sm:text-display-lg uppercase text-on-surface">
            {category?.name || 'Category'}
          </h1>
          <p className="font-body text-body-md sm:text-body-lg text-on-surface-variant max-w-xl text-pretty">
            {category?.description}
          </p>
        </div>
      </div>

      {/* Category Sibling Navigation Strip */}
      <div className="border-b border-outline bg-surface-container-low overflow-x-auto scrollbar-none">
        <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-2.5 sm:py-3 flex items-center gap-2 sm:gap-gutter-md whitespace-nowrap min-w-max">
          <span className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant font-mono">Divisions:</span>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className={`font-label text-[11px] sm:text-label-sm uppercase px-3 py-1.5 border transition-colors touch-manipulation ${
                c.slug === slug
                  ? 'bg-accent text-on-accent border-accent font-semibold'
                  : 'bg-surface text-on-surface-variant border-outline hover:text-on-surface hover:border-primary'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Garments Grid - Mobile First 2-column layout */}
      <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section">
        <div className="flex items-center justify-between pb-gutter-md sm:pb-gutter-lg border-b border-outline mb-gutter-md sm:mb-gutter-xl">
          <span className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface-variant tabular-nums">
            {categoryProducts.length} GARMENTS IN DIVISION
          </span>
          <Link href="/shop" className="font-label text-[11px] sm:text-label-sm uppercase text-accent hover:underline">
            View All Silhouettes →
          </Link>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center gap-4">
            <span className="font-headline text-headline-md uppercase text-on-surface">
              NO ACTIVE GARMENTS IN THIS CATEGORY
            </span>
            <Link
              href="/shop"
              className="bg-accent text-on-accent font-label text-label-sm uppercase px-gutter-lg py-3"
            >
              Explore Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
