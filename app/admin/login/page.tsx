'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { showToast } from '@/components/ui/Toast';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdmin } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated as admin, redirect to dashboard
  React.useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('OPERATOR ID & PASSWORD REQUIRED', 'error');
      return;
    }

    setIsLoading(true);
    const result = await loginAdmin(email, password);
    setIsLoading(false);

    if (result.success) {
      showToast('SECURITY CLEARANCE VERIFIED // WELCOME OPERATOR', 'success');
      router.push('/admin');
    } else {
      showToast(result.error || 'ACCESS DENIED', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-on-surface flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Storefront</span>
        </Link>
        <span className="font-label text-[11px] uppercase tracking-widest text-[#555] border border-[#222] px-2.5 py-1">
          INTERNAL CONSOLE ONLY
        </span>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-[#121212] border border-[#282828] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          {/* Subtle Security Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

          {/* Heading */}
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <div className="w-12 h-12 bg-[#1b1b1b] border border-[#333] flex items-center justify-center text-accent mb-2">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-label text-[10px] uppercase tracking-[0.25em] text-accent">
              RESTRICTED AREA // LEVEL 03
            </span>
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-on-surface">
              ADMINISTRATOR ACCESS
            </h1>
            <p className="font-body text-xs text-on-surface-variant max-w-xs">
              Direct administrative route. Authorized personnel only. All access attempts are logged and audited.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-accent" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@duskriot.com"
                autoComplete="email"
                className="bg-[#181818] text-on-surface border border-[#333] px-3.5 py-2.5 font-mono text-sm placeholder:text-[#555] focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span>Access Key</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-[#181818] text-on-surface border border-[#333] px-3.5 py-2.5 font-mono text-sm placeholder:text-[#555] focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-accent text-on-accent font-label text-xs uppercase tracking-widest font-bold py-3.5 border border-accent hover:bg-[#b0f516] active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>VERIFYING CLEARANCE...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>AUTHORIZE SESSION</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-[#222] text-center">
            <span className="font-mono text-[10px] text-[#666] uppercase tracking-wider">
              SYS-ENV: NEON-POSTGRES-ACADEMIC
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-[#444] font-label text-[11px] uppercase tracking-widest">
        DUSK RIOT BRAND CORP // ZERO-TRUST AUTH PROTOCOL
      </div>
    </div>
  );
}
