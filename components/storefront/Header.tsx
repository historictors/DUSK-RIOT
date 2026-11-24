'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { SearchModal } from './SearchModal';
import { Menu, X, ShoppingBag, Heart, Search, User, ShieldCheck, ArrowRight, LogIn, LogOut, UserPlus } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { isAuthenticated, currentUser, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Drop 04', href: '/collections/drop-04' },
    { label: 'Categories', href: '/category/hoodies-fleece' },
    { label: 'Lookbook', href: '/collections/lookbook' },
    { label: 'Archive', href: '/collections/archive' },
  ];

  return (
    <>
      {/* Top Utility Ticker */}
      <div className="bg-surface-container-low border-b border-outline px-3 sm:px-gutter-md md:px-page-margin py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-gutter-sm min-w-0">
          <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent shrink-0 animate-pulse" />
          <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface tracking-wider sm:tracking-widest truncate">
            DROP 04 // NOW LIVE — WORLDWIDE DISPATCH
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-label text-[10px] sm:text-label-sm uppercase text-on-surface-variant tracking-wider sm:tracking-widest">
            FREE EXPRESS SHIPPING OVER $200
          </span>
        </div>
      </div>

      {/* Primary Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-gutter-md md:px-page-margin h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-gutter-lg">
          {/* Left: Brand Wordmark + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-gutter-md min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-surface-container-low text-on-surface border border-outline transition-colors hover:border-primary hover:text-accent shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="font-display text-xl sm:text-headline-md uppercase tracking-tight text-on-surface hover:text-accent transition-colors duration-state-change truncate"
            >
              DUSK RIOT
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-gutter-lg lg:gap-gutter-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-label text-label-lg uppercase tracking-wider py-1 transition-colors duration-state-change ${
                    isActive
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-on-surface hover:text-accent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Wishlist + Account + Bag */}
          <div className="flex items-center gap-1 sm:gap-gutter-sm shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search catalog"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-surface text-on-surface border border-outline transition-colors hover:border-primary hover:text-accent"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Saved wishlist"
              className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-surface text-on-surface border border-outline transition-colors hover:border-primary hover:text-accent"
            >
              <Heart className="w-4 h-4" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center bg-accent text-on-accent font-label text-[10px] w-4 h-4 font-bold tabular-nums">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Customer Authentication / Profile Action */}
            {mounted && (
              isAuthenticated && currentUser ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/account"
                    className="inline-flex items-center gap-1 sm:gap-1.5 h-8 sm:h-10 px-2 sm:px-3 bg-surface-container border border-outline hover:border-accent text-on-surface hover:text-accent transition-colors font-label text-[11px] sm:text-xs uppercase"
                    title="View Account Profile"
                  >
                    <User className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="hidden sm:inline font-bold truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="sm:hidden font-bold">Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      showToast('SESSION TERMINATED // LOGGED OUT', 'info');
                    }}
                    className="h-8 sm:h-10 px-2 sm:px-2.5 bg-surface text-on-surface-variant hover:text-red-400 border border-outline hover:border-red-500 transition-colors font-label text-[10px] sm:text-[11px] uppercase"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:hidden" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-1 h-8 sm:h-10 px-2.5 sm:px-3 bg-surface text-on-surface hover:text-accent border border-outline hover:border-accent transition-colors font-label text-[11px] sm:text-xs uppercase tracking-wider"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth"
                    className="hidden sm:inline-flex items-center gap-1 h-8 sm:h-10 px-3 bg-accent text-on-accent font-bold border border-accent hover:bg-[#b0f516] transition-colors font-label text-xs uppercase tracking-wider"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )
            )}

            {/* Shopping Bag Button */}
            <Link
              href="/cart"
              aria-label={`Shopping bag with ${cartItemCount} items`}
              className={`inline-flex items-center gap-1 sm:gap-gutter-sm h-8 sm:h-10 px-2 sm:px-gutter-md bg-surface-container-low text-on-surface border transition-colors ${
                pathname === '/cart' ? 'border-accent' : 'border-outline hover:border-primary'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-label text-label-lg uppercase tracking-wider">
                Bag
              </span>
              <span className="inline-flex items-center justify-center bg-accent text-on-accent font-label text-[10px] sm:text-label-sm px-1 sm:px-1.5 py-0.5 tabular-nums font-bold">
                {mounted ? (cartItemCount < 10 ? `0${cartItemCount}` : cartItemCount) : '00'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-surface/85 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-80 max-w-[85vw] h-full bg-surface-container-low border-r border-outline p-gutter-md sm:p-gutter-lg flex flex-col justify-between z-10 overflow-y-auto">
            <div className="flex flex-col gap-gutter-lg">
              <div className="flex items-center justify-between border-b border-outline pb-3">
                <span className="font-display text-headline-md uppercase text-on-surface">
                  DUSK RIOT
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex items-center justify-center w-10 h-10 bg-surface text-on-surface border border-outline hover:border-accent hover:text-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col font-headline uppercase" aria-label="Mobile links">
                <Link
                  href="/shop"
                  className="py-3 text-headline-md text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>Shop All Garments</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/collections/drop-04"
                  className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>Drop 04 — Live</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                <Link
                  href="/category/hoodies-fleece"
                  className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>Hoodies & Fleece</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                <Link
                  href="/category/outerwear"
                  className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>Outerwear & Shells</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                <Link
                  href="/category/pants-bottoms"
                  className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>Pants & Cargos</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                <Link
                  href="/collections/lookbook"
                  className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>After Hours Lookbook</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                <Link
                  href="/collections/archive"
                  className="py-3 text-headline-md text-on-surface-variant hover:text-on-surface border-b border-outline flex items-center justify-between"
                >
                  <span>Studio Archive</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                {mounted && (
                  isAuthenticated && currentUser ? (
                    <>
                      <Link
                        href="/account"
                        className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span>Member Profile</span>
                          <span className="font-mono text-[10px] text-accent uppercase">{currentUser.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                          showToast('LOGGED OUT', 'info');
                        }}
                        className="py-3 text-headline-md text-red-400 hover:text-red-300 border-b border-outline flex items-center justify-between text-left"
                      >
                        <span>Logout Session</span>
                        <LogOut className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth"
                        className="py-3 text-headline-md text-accent border-b border-outline flex items-center justify-between font-bold"
                      >
                        <span>Sign In / Member Login</span>
                        <LogIn className="w-4 h-4 text-accent" />
                      </Link>
                      <Link
                        href="/auth"
                        className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                      >
                        <span>Register New Account</span>
                        <UserPlus className="w-4 h-4 text-on-surface-variant" />
                      </Link>
                    </>
                  )
                )}
                <Link
                  href="/tracking/DR-90482"
                  className="py-3 text-headline-md text-on-surface hover:text-accent border-b border-outline flex items-center justify-between"
                >
                  <span>Track Parcel Telemetry</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
              </nav>
            </div>

            <div className="border-t border-outline pt-4 mt-6 flex flex-col gap-1">
              <span className="font-label text-label-sm uppercase text-on-surface-variant">
                INDEPENDENT STREETWEAR LABEL
              </span>
              <span className="font-label text-label-sm uppercase text-accent font-bold">
                WEAR YOUR REBELLION.
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* Quick Search Dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
