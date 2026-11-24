'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  Truck,
  Users,
  TicketPercent,
  BarChart3,
  Settings,
  ExternalLink,
  Layers,
  FolderTree,
  X,
  LogOut,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutAdmin } = useAuthStore();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Shirt },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Collections', href: '/admin/collections', icon: Layers },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Orders', href: '/admin/orders', icon: Truck },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons', href: '/admin/coupons', icon: TicketPercent },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col">
        {/* Brand Bar */}
        <div className="h-14 sm:h-16 px-gutter-md sm:px-gutter-lg border-b border-outline flex items-center justify-between">
          <Link
            href="/admin"
            onClick={handleNavClick}
            className="font-display text-title-lg sm:text-headline-md uppercase text-on-surface"
          >
            DUSK RIOT
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-accent text-on-accent font-label text-[10px] sm:text-label-sm uppercase px-1.5 py-0.5 font-bold">
              OPS
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface border border-outline"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Admin Navigation Links */}
        <nav aria-label="Admin navigation" className="flex flex-col p-gutter-sm sm:p-gutter-md gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-2.5 font-label text-xs sm:text-label-sm uppercase tracking-wider transition-colors border touch-manipulation min-h-[42px] ${
                  isActive
                    ? 'bg-surface-container border-accent text-accent font-semibold'
                    : 'border-transparent text-on-surface hover:bg-surface-container hover:text-accent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Switcher */}
      <div className="p-gutter-md border-t border-outline flex flex-col gap-gutter-sm bg-surface">
        <button
          type="button"
          onClick={() => {
            logoutAdmin();
            router.push('/admin/login');
          }}
          className="flex items-center justify-between px-gutter-md py-2.5 bg-red-950/20 border border-red-900/50 text-red-400 hover:border-red-500 hover:text-red-300 font-label text-xs sm:text-label-sm uppercase transition-colors min-h-[42px]"
        >
          <span>Exit / Log Out</span>
          <LogOut className="w-4 h-4" />
        </button>
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center justify-between px-gutter-md py-2.5 bg-surface-container border border-outline text-on-surface hover:border-accent hover:text-accent font-label text-xs sm:text-label-sm uppercase transition-colors min-h-[42px]"
        >
          <span>View Storefront</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
        <span className="font-label text-[10px] sm:text-[11px] uppercase text-on-surface-variant px-gutter-xs">
          STUDIO OPS // NYC-01 LIVE
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar (Visible on >= lg) */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-surface-container-low border-r border-outline flex-col shrink-0">
        {navContent}
      </aside>

      {/* Mobile Off-Canvas Drawer (Visible on < lg when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-surface/85 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside
            className="fixed inset-y-0 left-0 w-72 bg-surface-container-low border-r border-outline z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
