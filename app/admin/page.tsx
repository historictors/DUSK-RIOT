'use client';

import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Truck,
  Boxes,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const allCustomers = useAuthStore((state) => state.allCustomers);

  // Compute live metrics from mock data
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'PLACED' || o.status === 'PROCESSING' || o.status === 'CONFIRMED'
  ).length;

  const lowStockCount = products.reduce((count, p) => {
    const hasLowVariant = p.variants.some((v) => v.stock > 0 && v.stock <= 5);
    return hasLowVariant ? count + 1 : count;
  }, 0);

  const outOfStockCount = products.reduce((count, p) => {
    const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
    return totalStock === 0 ? count + 1 : count;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="DUSK RIOT // STUDIO OPS DASHBOARD"
        subtitle="NYC-01 FULFILLMENT & INVENTORY TELEMETRY"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products/new"
              className="bg-accent text-on-accent font-label text-label-sm uppercase px-3 py-2 border border-accent hover:bg-primary hover:text-on-primary flex items-center gap-1.5 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Garment</span>
            </Link>
          </div>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl flex flex-col gap-gutter-xl">
        {/* KPI Metrics Strip (Stitch Reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-on-surface-variant flex items-center justify-between">
              <span>Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-accent tabular-nums">
              {formatPrice(totalRevenue)}
            </span>
            <span className="font-label text-[11px] uppercase text-on-surface-variant">
              Across {orders.length} logged dispatches
            </span>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-on-surface-variant flex items-center justify-between">
              <span>Active Dispatches</span>
              <Truck className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-on-surface tabular-nums">
              {pendingOrders < 10 ? `0${pendingOrders}` : pendingOrders}
            </span>
            <span className="font-label text-label-sm uppercase text-accent">
              Fulfillment queue open
            </span>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-on-surface-variant flex items-center justify-between">
              <span>Stock Telemetry</span>
              <Boxes className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-on-surface tabular-nums">
              {lowStockCount} Low / {outOfStockCount} Out
            </span>
            <span className="font-label text-[11px] uppercase text-error">
              Requires studio restock
            </span>
          </div>

          <div className="bg-surface-container border border-outline p-gutter-lg flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-on-surface-variant flex items-center justify-between">
              <span>Member Roster</span>
              <Users className="w-4 h-4 text-accent" />
            </span>
            <span className="font-headline text-headline-lg text-on-surface tabular-nums">
              {allCustomers.length < 10 ? `0${allCustomers.length}` : allCustomers.length}
            </span>
            <span className="font-label text-[11px] uppercase text-on-surface-variant">
              Dusk Riot Club accounts
            </span>
          </div>
        </div>

        {/* 2-Column Section: Visual Revenue Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-stretch">
          {/* Revenue Chart Visual (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container border border-outline p-gutter-xl flex flex-col justify-between gap-gutter-lg">
            <div className="flex items-center justify-between border-b border-outline pb-gutter-md">
              <div className="flex flex-col">
                <span className="font-label text-label-sm uppercase text-accent tracking-widest">
                  TELEMETRY MATRIX
                </span>
                <h2 className="font-headline text-headline-md uppercase text-on-surface">
                  WEEKLY DISPATCH VOLUME
                </h2>
              </div>
              <span className="font-label text-label-sm uppercase bg-surface-container-low px-2 py-1 text-on-surface-variant border border-outline">
                FW26 RUN
              </span>
            </div>

            {/* Streetwear Stylized Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-outline pb-2">
              {[
                { day: 'MON', val: 45, label: '$2,140' },
                { day: 'TUE', val: 70, label: '$3,820' },
                { day: 'WED', val: 60, label: '$3,150' },
                { day: 'THU', val: 95, label: '$5,400' },
                { day: 'FRI', val: 85, label: '$4,620' },
                { day: 'SAT', val: 100, label: '$6,250' },
                { day: 'SUN', val: 75, label: '$4,100' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="font-label text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {bar.label}
                  </span>
                  <div
                    style={{ height: `${bar.val}%` }}
                    className="w-full bg-surface-container-high group-hover:bg-accent border border-outline transition-colors"
                  />
                  <span className="font-label text-label-sm uppercase text-on-surface-variant">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between font-label text-label-sm uppercase text-on-surface-variant pt-1">
              <span>Peak Dispatch: Saturday (Drop 04 Opening)</span>
              <span className="text-accent">+34.8% vs Drop 03</span>
            </div>
          </div>

          {/* Quick Ops Panel (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-md">
            <h2 className="font-headline text-headline-md uppercase text-on-surface border-b border-outline pb-gutter-sm">
              STUDIO SHORTCUTS
            </h2>

            <div className="flex flex-col gap-2 font-label text-label-sm uppercase">
              <Link
                href="/admin/products/new"
                className="p-3 bg-surface-container-low border border-outline hover:border-accent hover:text-accent flex items-center justify-between transition-colors"
              >
                <span>Add New Garment</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/inventory"
                className="p-3 bg-surface-container-low border border-outline hover:border-accent hover:text-accent flex items-center justify-between transition-colors"
              >
                <span>Adjust Stock Units</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/orders"
                className="p-3 bg-surface-container-low border border-outline hover:border-accent hover:text-accent flex items-center justify-between transition-colors"
              >
                <span>Process Dispatches ({pendingOrders})</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/coupons"
                className="p-3 bg-surface-container-low border border-outline hover:border-accent hover:text-accent flex items-center justify-between transition-colors"
              >
                <span>Manage Promo Codes</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 bg-surface-container-low border border-outline hover:border-error hover:text-error flex items-center justify-between transition-colors"
              >
                <span>Reset Demo Datasets</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Table (Stitch Reference) */}
        <div className="bg-surface-container border border-outline flex flex-col">
          <div className="p-gutter-md border-b border-outline flex items-center justify-between">
            <h2 className="font-headline text-headline-md uppercase text-on-surface">
              RECENT ORDERS LOG
            </h2>
            <Link
              href="/admin/orders"
              className="font-label text-label-sm uppercase text-accent hover:underline flex items-center gap-1"
            >
              View All Orders ({orders.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left font-label text-label-sm uppercase border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant">
                  <th className="p-gutter-md">Order Ref</th>
                  <th className="p-gutter-md">Customer</th>
                  <th className="p-gutter-md">Garments</th>
                  <th className="p-gutter-md">Total</th>
                  <th className="p-gutter-md">Status</th>
                  <th className="p-gutter-md">Waybill</th>
                  <th className="p-gutter-md text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="p-gutter-md font-bold text-accent tabular-nums">
                      {order.orderNumber}
                    </td>
                    <td className="p-gutter-md text-on-surface">
                      <div className="flex flex-col">
                        <span>{order.customerName}</span>
                        <span className="text-[10px] text-on-surface-variant lowercase">
                          {order.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-gutter-md text-on-surface-variant">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="p-gutter-md text-on-surface tabular-nums font-semibold">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-gutter-md">
                      <span
                        className={`px-2 py-0.5 border text-[10px] font-bold ${
                          order.status === 'DELIVERED'
                            ? 'bg-surface text-on-surface-variant border-outline'
                            : order.status === 'CANCELLED'
                            ? 'bg-surface text-error border-error'
                            : 'bg-surface text-accent border-accent'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-gutter-md text-on-surface-variant tabular-nums">
                      {order.trackingNumber}
                    </td>
                    <td className="p-gutter-md text-right">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="text-accent hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
