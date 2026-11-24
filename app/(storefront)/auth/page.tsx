'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { showToast } from '@/components/ui/Toast';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      showToast(`ACCESS GRANTED // WELCOME BACK, ${email.toUpperCase()}`, 'success');
      router.push('/account');
    } else {
      showToast(result.error || 'Authentication failed', 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please complete all registration fields', 'error');
      return;
    }
    const result = await register(name, email, password);
    if (result.success) {
      showToast(`MEMBER RECORD CREATED // WELCOME ${name.toUpperCase()}`, 'success');
      router.push('/account');
    } else {
      showToast(result.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between bg-surface p-gutter-md md:p-page-margin">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-headline-md uppercase text-on-surface hover:text-accent"
        >
          DUSK RIOT
        </Link>
        <Link
          href="/shop"
          className="font-label text-label-sm uppercase text-on-surface-variant hover:text-accent"
        >
          Return to Storefront
        </Link>
      </div>

      <main className="w-full max-w-md mx-auto my-gutter-xl bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg">
        <div className="flex flex-col gap-gutter-xs">
          <span className="font-label text-label-sm uppercase text-accent tracking-widest">
            MEMBER ACCESS
          </span>
          <h1 className="font-headline text-headline-lg uppercase text-on-surface">
            DUSK RIOT CLUB
          </h1>
        </div>

        {/* Auth Mode Toggle (Stitch Reference) */}
        <div className="grid grid-cols-2 border border-outline bg-surface-container-low" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signin'}
            onClick={() => setActiveTab('signin')}
            className={`py-2.5 font-label text-label-lg uppercase tracking-wider transition-colors ${
              activeTab === 'signin'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'register'}
            onClick={() => setActiveTab('register')}
            className={`py-2.5 font-label text-label-lg uppercase tracking-wider transition-colors ${
              activeTab === 'register'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register
          </button>
        </div>

        {/* Sign In Panel */}
        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="flex flex-col gap-gutter-md">
            <div className="flex flex-col gap-gutter-xs">
              <label className="font-label text-label-sm uppercase text-on-surface-variant">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NAME@DOMAIN.COM"
                className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body text-body-md px-gutter-md py-3 border border-outline focus:border-accent focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <div className="flex items-center justify-between">
                <label className="font-label text-label-sm uppercase text-on-surface-variant">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Demo password is: password123', 'info')}
                  className="font-label text-label-sm uppercase text-on-surface-variant hover:text-accent"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body text-body-md px-gutter-md py-3 border border-outline focus:border-accent focus:ring-0 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-gutter-xs w-full inline-flex items-center justify-center bg-accent text-on-accent font-label text-label-lg uppercase tracking-wider py-3.5 border border-accent hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
            >
              Enter Club
            </button>
          </form>
        ) : (
          /* Register Panel */
          <form onSubmit={handleRegister} className="flex flex-col gap-gutter-md">
            <div className="flex flex-col gap-gutter-xs">
              <label className="font-label text-label-sm uppercase text-on-surface-variant">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="KAI VANCE"
                className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body text-body-md px-gutter-md py-3 border border-outline focus:border-accent focus:ring-0 focus:outline-none uppercase"
              />
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label className="font-label text-label-sm uppercase text-on-surface-variant">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NAME@DOMAIN.COM"
                className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body text-body-md px-gutter-md py-3 border border-outline focus:border-accent focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label className="font-label text-label-sm uppercase text-on-surface-variant">
                Create Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="MIN 8 CHARACTERS"
                className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body text-body-md px-gutter-md py-3 border border-outline focus:border-accent focus:ring-0 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-gutter-xs w-full inline-flex items-center justify-center bg-accent text-on-accent font-label text-label-lg uppercase tracking-wider py-3.5 border border-accent hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
            >
              Create Account
            </button>
          </form>
        )}

        <div className="p-3 bg-surface border border-outline text-xs text-on-surface-variant text-center font-label uppercase">
          Member credentials required. Sign in or register a new identity.
        </div>
      </main>

      <div className="flex items-center justify-between border-t border-outline pt-gutter-md">
        <span className="font-label text-label-sm uppercase text-on-surface-variant">
          BREAK THE ORDINARY.
        </span>
        <span className="font-label text-label-sm uppercase text-on-surface-variant">
          © 2026 DUSK RIOT
        </span>
      </div>
    </div>
  );
}
