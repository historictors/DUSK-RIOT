'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { formatPrice } from '@/lib/utils';
import { BarChart3, TrendingUp, DollarSign, Package, Percent } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const totalGarmentsSold = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="STUDIO ANALYTICS"
        subtitle="COMMERCE PERFORMANCE & SILHOUETTE TRAFFIC"
        actions={
          <span className="font-label text-label-sm uppercase bg-surface-container px-3 py-1.5 border border-outline text-accent tabular-nums">
            REAL-TIME DATA ENGINE ACTIVE
          </span>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-6xl mx-auto w-full flex flex-col gap-gutter-xl font-label text-label-sm uppercase">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-1">
            <span className="text-on-surface-variant flex items-center justify-between">
              <span>Gross Sales</span>
              <DollarSign className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-accent tabular-nums">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[10px] text-on-surface-variant">+28.4% vs previous capsule</span>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-1">
            <span className="text-on-surface-variant flex items-center justify-between">
              <span>Total Units Dispatched</span>
              <Package className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-on-surface tabular-nums">
              {totalGarmentsSold} Units
            </span>
            <span className="text-[10px] text-on-surface-variant">Across all sizing tiers</span>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-1">
            <span className="text-on-surface-variant flex items-center justify-between">
              <span>Average Order Value</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-on-surface tabular-nums">
              {formatPrice(avgOrderValue)}
            </span>
            <span className="text-[10px] text-accent">High cart basket density</span>
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-2">
            SALES VOLUME BY DIVISION
          </h2>

          <div className="flex flex-col gap-4">
            {[
              { name: 'Hoodies & Fleece (480GSM)', pct: 54, rev: '$18,420' },
              { name: 'Technical Outerwear', pct: 28, rev: '$9,580' },
              { name: 'Pants & Tactical Bottoms', pct: 12, rev: '$4,100' },
              { name: 'Tees & Modular Accessories', pct: 6, rev: '$2,050' },
            ].map((div, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between font-label text-label-sm">
                  <span className="text-on-surface font-bold">{div.name}</span>
                  <span className="text-accent tabular-nums">{div.rev} ({div.pct}%)</span>
                </div>
                <div className="h-3 w-full bg-surface-container-low border border-outline overflow-hidden">
                  <div
                    style={{ width: `${div.pct}%` }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Demanded Silhouettes Table */}
        <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-md">
          <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-2">
            BEST-SELLING EDITORIAL GARMENTS
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline text-on-surface-variant text-[11px]">
                <th className="py-2">Garment</th>
                <th className="py-2">SKU</th>
                <th className="py-2">Price</th>
                <th className="py-2">Sell-Through Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {products.slice(0, 4).map((p, idx) => (
                <tr key={p.id}>
                  <td className="py-2.5 flex items-center gap-2">
                    <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover" />
                    <span className="font-bold text-on-surface">{p.name}</span>
                  </td>
                  <td className="py-2.5 text-accent">{p.sku}</td>
                  <td className="py-2.5 tabular-nums">{formatPrice(p.price)}</td>
                  <td className="py-2.5 text-accent font-bold tabular-nums">
                    {98 - idx * 7}% Sold
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
