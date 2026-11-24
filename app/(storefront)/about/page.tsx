'use client';

import React from 'react';
import Link from 'next/link';
import { DuskImage } from '@/components/ui/DuskImage';

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Manifesto Hero Header */}
      <div className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section flex flex-col gap-gutter-xs sm:gap-gutter-sm">
          <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
            LABEL DOSSIER // ORIGIN STORY
          </span>
          <h1 className="font-display text-display-xl-mobile md:text-display-xl uppercase text-on-surface">
            BREAK THE ORDINARY.
          </h1>
          <p className="font-body text-body-md sm:text-body-lg text-on-surface max-w-2xl text-pretty">
            DUSK RIOT is an independent streetwear label founded on the refusal to compromise. We design heavy, unyielding garments engineered for nocturnal life and raw brutalist landscapes.
          </p>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-lg sm:py-section flex flex-col gap-gutter-xl sm:gap-section">
        {/* Editorial 7 / 5 Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg sm:gap-gutter-xl items-center">
          <div className="lg:col-span-7 flex flex-col gap-gutter-md sm:gap-gutter-lg">
            <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent font-mono">01 // GARMENT ARCHITECTURE</span>
            <h2 className="font-display text-display-lg-mobile md:text-display-lg uppercase text-on-surface">
              HEAVYWEIGHT COTTON. METICULOUS DESTRUCTION.
            </h2>
            <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
              Every DUSK RIOT piece begins in our textile development lab. Rather than sourcing off-the-shelf blanks, we custom mill 480GSM loopback French terry, 310GSM combed jersey, and high-tensile ripstop cordura. Each garment is garment-dyed in small batches and hand-distressed with abrasive grinding wheels to achieve an authentic worn-in mineral patina.
            </p>
            <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
              We reject rapid seasonal turnover. When a drop releases, each silhouette is strictly numbered. Once archived, the colorway and graphic placement are permanently locked in our vault.
            </p>
          </div>

          <div className="lg:col-span-5 w-full">
            <DuskImage
              src="https://lh3.googleusercontent.com/aida/ALJJyrCiH4f-jD8fZM7EqzjBTD5Aa1OONf71lmxtzKsR2lOx9YYOJ229EiO-c56zId3cxYYkObO6hhdWY6toHt_Ob3THVWIngC5J6WwxQf7CYjZM0RD7Ojjl3LuqECvQfDaNXmgw0YlHLcgOb2WoPwgTUa1S2AV5LAGDPfOkFvoqnf47diMejJ0-Z_E2ltVrbA7DQKCdBX08IpWidMEAJj9Cj0Y7k8MXDoPDR0fCgF_7IwmhMK3yliZc_SKz"
              alt="Dusk Riot studio archive"
              aspectRatio="4/5"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Pillars Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md sm:gap-gutter-lg border-t border-outline pt-gutter-lg sm:pt-section">
          <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-sm sm:gap-gutter-md">
            <span className="font-headline text-headline-lg text-accent tabular-nums">01</span>
            <h3 className="font-title text-title-lg uppercase text-on-surface">NO COMMERCIAL BLANKS</h3>
            <p className="font-body text-body-md text-on-surface-variant">
              Every pattern is drafted in-house with dropped shoulders, wide sleeves, and boxy torso crops tailored specifically for modern streetwear silhouettes.
            </p>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-sm sm:gap-gutter-md">
            <span className="font-headline text-headline-lg text-accent tabular-nums">02</span>
            <h3 className="font-title text-title-lg uppercase text-on-surface">WEATHERPROOF RESISTANCE</h3>
            <p className="font-body text-body-md text-on-surface-variant">
              Outerwear pieces incorporate DWR-coated ripstop fabrics and weather-resistant YKK AquaGuard zips engineered for torrential midnight weather.
            </p>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-sm sm:gap-gutter-md">
            <span className="font-headline text-headline-lg text-accent tabular-nums">03</span>
            <h3 className="font-title text-title-lg uppercase text-on-surface">LIMITED DISPATCHES</h3>
            <p className="font-body text-body-md text-on-surface-variant">
              We produce small, controlled batches to maintain supreme quality control and prevent warehouse deadstock waste.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-gutter-md sm:p-gutter-xl bg-surface-container-low border border-accent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-gutter-md sm:gap-gutter-lg">
          <div className="flex flex-col gap-1">
            <span className="font-label text-[11px] sm:text-label-sm uppercase text-accent tracking-widest">
              JOIN THE REBELLION
            </span>
            <h3 className="font-headline text-headline-md uppercase text-on-surface">
              ARM YOUR WARDROBE WITH DROP 04
            </h3>
          </div>
          <Link
            href="/shop"
            className="w-full sm:w-auto text-center bg-accent text-on-accent font-label text-label-sm sm:text-label-lg uppercase px-gutter-xl py-3.5 border border-accent hover:bg-primary hover:text-on-primary font-bold shrink-0 touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            Explore The Drop
          </Link>
        </div>
      </main>
    </div>
  );
}
