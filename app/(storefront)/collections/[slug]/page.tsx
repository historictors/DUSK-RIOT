'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProductStore } from '@/stores/useProductStore';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ArrowLeft } from 'lucide-react';

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const collections = useProductStore((state) => state.collections);
  const products = useProductStore((state) => state.products);

  const collection = collections.find((c) => c.slug === slug);
  const collectionProducts = products.filter(
    (p) => p.collectionSlug === slug || slug === 'drop-04'
  );

  return (
    <div className="bg-surface min-h-screen">
      {/* Collection Hero */}
      <div className="relative border-b border-outline bg-surface overflow-hidden min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] flex items-end">
        {collection?.bannerImage && (
          <img
            src={collection.bannerImage}
            alt={collection.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section flex flex-col gap-gutter-xs sm:gap-gutter-sm">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 font-label text-label-sm uppercase text-on-surface-variant hover:text-accent w-fit mb-1 min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="bg-accent text-on-accent font-label text-[11px] sm:text-label-sm uppercase px-2 py-0.5 font-bold">
              {collection?.status || 'COLLECTION'}
            </span>
            <span className="font-label text-[11px] sm:text-label-sm uppercase text-on-surface tracking-widest font-mono">
              {collection?.season || 'FW26'}
            </span>
          </div>

          <h1 className="font-display text-display-xl-mobile sm:text-display-xl uppercase text-on-surface tracking-tight">
            {collection?.name || 'Drop 04 // Nocturnal Signal'}
          </h1>

          <p className="font-body text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl text-pretty">
            {collection?.description ||
              'Heavyweight silhouettes built for late-night concrete. Limited edition numbered garment runs.'}
          </p>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-gutter-md sm:pb-gutter-lg border-b border-outline mb-gutter-md sm:mb-gutter-xl gap-3">
          <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
            CURATED CAPSULE GARMENTS ({collectionProducts.length})
          </span>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className={`font-label text-[11px] sm:text-label-sm uppercase px-3 py-1.5 border transition-colors whitespace-nowrap touch-manipulation ${
                  c.slug === slug
                    ? 'bg-accent text-on-accent border-accent font-semibold'
                    : 'bg-surface-container text-on-surface-variant border-outline hover:text-on-surface'
                }`}
              >
                {c.code}
              </Link>
            ))}
          </div>
        </div>

        {/* 2-column mobile, 3-column desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
