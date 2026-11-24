'use client';

import React from 'react';
import Link from 'next/link';
import { useProductStore } from '@/stores/useProductStore';
import { ProductCard } from '@/components/storefront/ProductCard';
import { DuskImage } from '@/components/ui/DuskImage';
import { ArrowRight, Sparkles, Shield, Cpu, Flame } from 'lucide-react';

export default function HomePage() {
  const products = useProductStore((state) => state.products);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 6);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* 1. Full-Bleed Hero Campaign Section (Mobile-First Responsive) */}
      <section className="relative border-b border-outline bg-surface overflow-hidden">
        <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[760px] flex items-end">
          <img
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=80"
            alt="DUSK RIOT Drop 04 campaign models in oversized obsidian hoodies in a concrete underpass"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/65 to-surface/20 sm:bg-surface/60 backdrop-blur-[1px]" />

          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-gutter-md md:px-page-margin py-8 sm:py-section">
            <div className="max-w-3xl flex flex-col gap-3 sm:gap-gutter-lg">
              <div className="flex items-center gap-2 sm:gap-gutter-md flex-wrap">
                <span className="inline-flex items-center justify-center bg-surface text-accent border border-accent font-label text-[10px] sm:text-label-sm uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-widest font-bold">
                  FW26 // DROP 04
                </span>
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface tracking-widest">
                  LIMITED NUMBERED RUN
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-display-xl-mobile md:text-display-xl uppercase text-on-surface tracking-tight text-balance leading-none sm:leading-tight">
                NOT MADE TO FIT IN.
              </h1>

              <p className="font-body text-sm sm:text-body-lg text-on-surface max-w-prose text-pretty leading-relaxed">
                Streetwear for those who refuse to follow the crowd. Heavyweight 480GSM French terry, boxy distressed graphic tees, and matte technical outerwear cut for late-night concrete.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-gutter-md pt-2">
                <Link
                  href="/collections/drop-04"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-accent text-on-accent font-label text-label-md sm:text-label-lg uppercase tracking-wider px-6 sm:px-gutter-xl py-3 sm:py-3.5 border border-accent transition-colors duration-state-change hover:bg-primary hover:text-on-primary hover:border-primary font-bold text-center"
                >
                  EXPLORE THE DROP
                </Link>

                <Link
                  href="/collections/lookbook"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-surface/90 text-on-surface font-label text-label-md sm:text-label-lg uppercase tracking-wider px-6 sm:px-gutter-xl py-3 sm:py-3.5 border border-outline transition-colors duration-state-change hover:border-primary hover:bg-surface-container-high text-center"
                >
                  Explore Lookbook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Asymmetric Editorial Split (7 / 5 Grid - Mobile Optimized) */}
      <section id="editorial" className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-gutter-md md:px-page-margin py-8 sm:py-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-stretch">
            {/* Left 7 Columns: Manifesto & Garment Architecture */}
            <div className="lg:col-span-7 bg-surface-container border border-outline p-4 sm:p-gutter-xl flex flex-col justify-between gap-6 sm:gap-gutter-xl">
              <div className="flex flex-col gap-3 sm:gap-gutter-lg">
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
                  LABEL MANIFESTO // INDEPENDENT STREETWEAR
                </span>

                <h2 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface text-balance">
                  WEAR YOUR REBELLION.
                </h2>

                <p className="font-body text-sm sm:text-body-lg text-on-surface-variant max-w-prose text-pretty leading-relaxed">
                  Born in the concrete alleys after midnight, DUSK RIOT rejects seasonal excess and disposable trends. Every silhouette is engineered from custom-milled heavyweight cotton and ripstop nylon—built to age with raw character.
                </p>
              </div>

              {/* Spec Strip */}
              <div className="grid grid-cols-3 border-t border-outline pt-4 sm:pt-gutter-lg gap-2 sm:gap-gutter-lg">
                <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
                  <span className="font-headline text-lg sm:text-headline-md uppercase text-on-surface tabular-nums font-bold">
                    480 GSM
                  </span>
                  <span className="font-label text-[9px] sm:text-label-sm uppercase text-on-surface-variant leading-tight">
                    FRENCH TERRY
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
                  <span className="font-headline text-lg sm:text-headline-md uppercase text-on-surface font-bold">
                    BOXY CUT
                  </span>
                  <span className="font-label text-[9px] sm:text-label-sm uppercase text-on-surface-variant leading-tight">
                    DROP SHOULDER
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
                  <span className="font-headline text-lg sm:text-headline-md uppercase text-accent font-bold">
                    NYC-01
                  </span>
                  <span className="font-label text-[9px] sm:text-label-sm uppercase text-on-surface-variant leading-tight">
                    LIMITED BATCH
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Visual Image Grid */}
            <div className="lg:col-span-5 bg-surface-container border border-outline overflow-hidden flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <DuskImage
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
                  alt="Editorial styling view"
                  aspectRatio="4/5"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-4 bg-surface/85 backdrop-blur-sm border border-outline flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent font-bold">LOOK 03</span>
                    <span className="font-title text-xs sm:text-title-md uppercase text-on-surface font-semibold">OBSIDIAN SUITE</span>
                  </div>
                  <Link
                    href="/product/obsidian-heavyweight-hoodie"
                    className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface hover:text-accent flex items-center gap-1 font-bold"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Drops Grid (2-Column Mobile Streetwear Grid) */}
      <section className="border-b border-outline bg-surface">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-8 sm:py-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-gutter-md border-b border-outline pb-3 sm:pb-gutter-lg mb-4 sm:mb-gutter-xl">
            <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
              <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
                DISPATCH // HIGHEST DEMAND
              </span>
              <h2 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
                FEATURED DROPS
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-accent flex items-center gap-1"
            >
              View Full Catalog ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category Architecture Grid */}
      <section className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-8 sm:py-section">
          <div className="border-b border-outline pb-3 sm:pb-gutter-lg mb-4 sm:mb-gutter-xl flex items-end justify-between">
            <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
              <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
                GARMENT ARCHITECTURE
              </span>
              <h2 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
                BROWSE BY CATEGORY
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-gutter-lg">
            {/* Hoodies */}
            <Link
              href="/category/hoodies-fleece"
              className="group relative aspect-[16/9] sm:aspect-[3/4] bg-surface-container border border-outline overflow-hidden flex flex-col justify-end p-4 sm:p-gutter-xl"
            >
              <DuskImage
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
                alt="Hoodies & Fleece"
                aspectRatio="auto"
                containerClassName="absolute inset-0 border-0"
                className="group-hover:scale-105 transition-transform duration-image-hover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <div className="relative z-10 flex flex-col gap-0.5 sm:gap-1">
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent font-bold">01 // HEAVYWEIGHT</span>
                <span className="font-headline text-lg sm:text-headline-lg uppercase text-on-surface">HOODIES & FLEECE</span>
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant">Explore 480GSM Terrys →</span>
              </div>
            </Link>

            {/* Outerwear */}
            <Link
              href="/category/outerwear"
              className="group relative aspect-[16/9] sm:aspect-[3/4] bg-surface-container border border-outline overflow-hidden flex flex-col justify-end p-4 sm:p-gutter-xl"
            >
              <DuskImage
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
                alt="Outerwear"
                aspectRatio="auto"
                containerClassName="absolute inset-0 border-0"
                className="group-hover:scale-105 transition-transform duration-image-hover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <div className="relative z-10 flex flex-col gap-0.5 sm:gap-1">
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent font-bold">02 // TECHNICAL</span>
                <span className="font-headline text-lg sm:text-headline-lg uppercase text-on-surface">OUTERWEAR</span>
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant">Explore Ripstop Shells →</span>
              </div>
            </Link>

            {/* Bottoms & Cargos */}
            <Link
              href="/category/pants-bottoms"
              className="group relative aspect-[16/9] sm:aspect-[3/4] bg-surface-container border border-outline overflow-hidden flex flex-col justify-end p-4 sm:p-gutter-xl"
            >
              <DuskImage
                src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
                alt="Pants & Bottoms"
                aspectRatio="auto"
                containerClassName="absolute inset-0 border-0"
                className="group-hover:scale-105 transition-transform duration-image-hover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <div className="relative z-10 flex flex-col gap-0.5 sm:gap-1">
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent font-bold">03 // ARTICULATED</span>
                <span className="font-headline text-lg sm:text-headline-lg uppercase text-on-surface">PANTS & CARGOS</span>
                <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant">Explore Parachute Cuts →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Full Grid (2-Column Mobile) */}
      <section className="border-b border-outline bg-surface">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin py-8 sm:py-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-gutter-md border-b border-outline pb-3 sm:pb-gutter-lg mb-4 sm:mb-gutter-xl">
            <div className="flex flex-col gap-0.5 sm:gap-gutter-xs">
              <span className="font-label text-[10px] sm:text-label-sm uppercase text-accent tracking-widest font-mono">
                FRESH OFF DISPATCH LINE
              </span>
              <h2 className="font-display text-2xl sm:text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
                ALL RECENT ARRIVALS
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-label text-xs sm:text-label-sm uppercase text-on-surface-variant hover:text-accent"
            >
              Filter & Sort All Items →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-gutter-md lg:gap-gutter-lg">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
