'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuthStore } from '@/stores/useAuthStore';
import { Menu, ExternalLink, LogOut, ShieldAlert } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isHydrated, logoutAdmin } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on /admin/login, don't wrap with dashboard chrome
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isHydrated && !isAdmin && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAdmin, isHydrated, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Guard view during hydration or if not admin
  if (!isHydrated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-accent mb-4 animate-pulse" />
        <span className="font-label text-xs uppercase tracking-[0.25em] text-accent mb-2">
          SECURITY PROTOCOL
        </span>
        <h1 className="font-display text-2xl uppercase tracking-wider text-on-surface mb-2">
          AUTHENTICATING OPERATOR
        </h1>
        <p className="font-body text-xs text-on-surface-variant max-w-sm mb-6">
          Verifying clearance credentials. Unauthorized requests are rejected.
        </p>
        <Link
          href="/admin/login"
          className="font-label text-xs uppercase tracking-widest text-on-accent bg-accent px-5 py-2.5 font-bold hover:bg-[#b0f516]"
        >
          Proceed to Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface text-on-surface">
      {/* Mobile Top App Bar (< lg screens) */}
      <div className="lg:hidden h-14 bg-surface-container-low border-b border-outline px-gutter-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="p-2 border border-outline text-on-surface hover:text-accent touch-manipulation min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Open Admin Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display text-title-md uppercase text-on-surface">
              DUSK RIOT
            </span>
            <span className="bg-accent text-on-accent font-label text-[10px] uppercase px-1.5 py-0.5 font-bold">
              OPS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              router.push('/admin/login');
            }}
            className="font-label text-[11px] uppercase text-red-400 border border-outline px-2.5 py-1.5 flex items-center gap-1 hover:border-red-500"
            title="Log Out Admin"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <Link
            href="/"
            className="font-label text-[11px] uppercase text-accent border border-outline px-2.5 py-1.5 flex items-center gap-1 hover:border-accent"
          >
            <span>Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Sidebar (static on desktop, off-canvas on mobile) */}
      <AdminSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
