'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/components/ui/Toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('MEMBER ACCESS LOGGED. WELCOME TO DUSK RIOT.', 'success');
  };

  return (
    <footer className="border-t border-outline bg-surface-container-low mt-auto">
      {/* Manifesto Callout Strip */}
      <div className="border-b border-outline bg-surface-container">
        <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-gutter-xl grid grid-cols-1 md:grid-cols-12 gap-gutter-lg items-center">
          <div className="md:col-span-8 flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-accent tracking-widest">
              MANIFESTO // NIGHT DIVISION
            </span>
            <p className="font-display text-title-lg md:text-headline-md uppercase text-on-surface">
              WEAR YOUR REBELLION. BUILT TO AGE WITH RAW CHARACTER.
            </p>
          </div>
          <div className="md:col-span-4 flex items-center md:justify-end gap-gutter-md">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-accent text-on-accent font-label text-label-lg uppercase px-gutter-lg py-3 border border-accent hover:bg-primary hover:text-on-primary transition-colors"
            >
              Shop All Drops
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-gutter-xl">
        {/* Col 1: Wordmark & Statement (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter-md">
          <Link href="/" className="font-display text-headline-lg uppercase text-on-surface">
            DUSK RIOT
          </Link>
          <p className="font-body text-body-md text-on-surface-variant max-w-sm">
            Independent streetwear label engineered from custom-milled heavyweight cotton and technical ripstop. Handled in limited numbered drops.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 bg-accent inline-block"></span>
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              DISPATCH FROM NYC STUDIO LAB
            </span>
          </div>
        </div>

        {/* Col 2: Collections & Drops (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-gutter-sm">
          <span className="font-label text-label-sm uppercase text-accent tracking-wider">
            Collections
          </span>
          <ul className="flex flex-col gap-2 font-label text-label-sm uppercase text-on-surface-variant">
            <li>
              <Link href="/collections/drop-04" className="hover:text-on-surface transition-colors">
                Drop 04 // Now Live
              </Link>
            </li>
            <li>
              <Link href="/collections/lookbook" className="hover:text-on-surface transition-colors">
                After Hours Lookbook
              </Link>
            </li>
            <li>
              <Link href="/category/hoodies-fleece" className="hover:text-on-surface transition-colors">
                Hoodies & Fleece
              </Link>
            </li>
            <li>
              <Link href="/category/outerwear" className="hover:text-on-surface transition-colors">
                Outerwear Tech
              </Link>
            </li>
            <li>
              <Link href="/collections/archive" className="hover:text-on-surface transition-colors">
                Studio Archive
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Services (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-gutter-sm">
          <span className="font-label text-label-sm uppercase text-accent tracking-wider">
            Client Services
          </span>
          <ul className="flex flex-col gap-2 font-label text-label-sm uppercase text-on-surface-variant">
            <li>
              <Link href="/tracking/DR-90482" className="hover:text-on-surface transition-colors">
                Parcel Telemetry
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-on-surface transition-colors">
                Member Account
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-on-surface transition-colors">
                Order History
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-on-surface transition-colors">
                Garment Architecture
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-on-surface transition-colors">
                Studio Inquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dispatch Newsletter (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter-md">
          <span className="font-label text-label-sm uppercase text-accent tracking-wider">
            Nocturnal Wire // Priority Access
          </span>
          <p className="font-body text-body-md text-on-surface-variant">
            Subscribe for secret password drops, private showroom invitations, and restock bulletins.
          </p>

          {subscribed ? (
            <div className="p-3 bg-surface border border-accent text-accent font-label text-label-sm uppercase">
              ✓ Dispatches armed. Check inbox for secret passkey.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="YOUR.EMAIL@DOMAIN.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface text-on-surface placeholder:text-on-surface-variant font-label text-label-sm uppercase px-gutter-md py-3 border border-outline focus:border-accent focus:ring-0 focus:outline-none flex-1"
              />
              <button
                type="submit"
                className="bg-accent text-on-accent font-label text-label-sm uppercase px-gutter-md py-3 border border-accent hover:bg-primary hover:text-on-primary transition-colors shrink-0"
              >
                Join Wire
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sub-footer Legal & System Bar */}
      <div className="border-t border-outline bg-surface">
        <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-4 flex flex-col sm:flex-row items-center justify-between gap-gutter-md font-label text-label-sm uppercase text-on-surface-variant">
          <span>© 2026 DUSK RIOT LABEL CORP. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-gutter-lg">
            <span>SPEC: 480GSM FRENCH TERRY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
