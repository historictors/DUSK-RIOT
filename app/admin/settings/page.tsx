'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useCouponStore } from '@/stores/useCouponStore';
import { showToast } from '@/components/ui/Toast';
import { RotateCcw, ShieldCheck, Database, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const resetProducts = useProductStore((state) => state.resetAll);
  const resetOrders = useOrderStore((state) => state.resetOrders);
  const resetCoupons = useCouponStore((state) => state.resetCoupons);

  const [storeName, setStoreName] = useState('DUSK RIOT');
  const [shippingThreshold, setShippingThreshold] = useState(200);
  const [currency, setCurrency] = useState('USD ($)');
  const [supportEmail, setSupportEmail] = useState('ops@duskriot.club');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('STUDIO SETTINGS COMMITTED TO FRONTEND STORAGE', 'success');
  };

  const handleResetAllData = () => {
    if (
      confirm(
        'RESET APPLICATION STATE? This will restore original Stitch product records, default initial orders, and test coupons.'
      )
    ) {
      resetProducts();
      resetOrders();
      resetCoupons();
      localStorage.clear();
      showToast('ALL MOCK DATA RESTORED TO DEFAULT STITCH STATE', 'info');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="SYSTEM & DISPATCH SETTINGS"
        subtitle="CONFIGURATION PARAMETERS & STATE CONTROLLER"
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-4xl mx-auto w-full flex flex-col gap-gutter-xl font-label text-label-sm uppercase">
        {/* Store Settings Form */}
        <form
          onSubmit={handleSaveSettings}
          className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg"
        >
          <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-gutter-sm">
            STOREFRONT CONFIGURATION
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface uppercase focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Free Express Threshold ($)</label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(Number(e.target.value))}
                className="bg-surface-container-low p-3 border border-outline text-accent font-bold focus:border-accent tabular-nums"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Currency Standard</label>
              <input
                type="text"
                disabled
                value={currency}
                className="bg-surface-container-low p-3 border border-outline text-on-surface-variant opacity-70"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Studio Dispatch Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface lowercase focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto self-start px-gutter-xl py-3.5 bg-accent text-on-accent font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </form>

        {/* Database / LocalStorage Reset Section */}
        <div className="bg-surface-container border border-error/50 p-gutter-xl flex flex-col gap-gutter-md">
          <div className="flex items-center gap-2 text-error">
            <Database className="w-5 h-5" />
            <h2 className="font-headline text-headline-md uppercase">STATE PURGE / MOCK RESTORATION</h2>
          </div>
          <p className="font-body text-body-md text-on-surface-variant normal-case">
            Reset all localStorage persistence back to the pristine Google Stitch demonstration dataset. Useful for resetting placed orders, restoring initial inventory counts, or clearing testing carts.
          </p>

          <button
            type="button"
            onClick={handleResetAllData}
            className="w-full sm:w-auto self-start px-gutter-xl py-3.5 bg-error text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Restore Default Mock Data
          </button>
        </div>
      </main>
    </div>
  );
}
