'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useOrderStore } from '@/stores/useOrderStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Eye, Truck, CheckCircle2, RotateCcw } from 'lucide-react';
import { OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.trackingNumber.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, orderNumber: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(
      `ORDER #${orderNumber} STATUS UPDATED TO ${newStatus} // LIVE SYNCED`,
      'success'
    );
  };

  const statusOptions: OrderStatus[] = [
    'PLACED',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="DISPATCH ORDERS"
        subtitle="FULFILLMENT QUEUE & COURIER WAYBILL TELEMETRY"
        actions={
          <span className="font-label text-label-sm uppercase bg-surface-container px-3 py-1.5 border border-outline text-accent tabular-nums">
            {orders.length} LOGGED DISPATCHES
          </span>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl flex flex-col gap-gutter-lg">
        {/* Toolbar & Filters (Stitch Reference) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md bg-surface-container border border-outline p-gutter-md">
          <div className="flex items-center gap-gutter-sm flex-1">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
            <input
              type="search"
              placeholder="SEARCH BY ORDER #, CUSTOMER, OR WAYBILL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-on-surface font-label text-label-sm uppercase border-0 focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-label text-label-sm uppercase text-on-surface-variant">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-label text-label-sm uppercase px-3 py-1.5 border border-outline focus:border-accent"
            >
              <option value="all">All Statuses ({orders.length})</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table (Stitch Reference) */}
        <div className="bg-surface-container border border-outline overflow-x-auto scrollbar-none">
          <table className="w-full text-left font-label text-label-sm uppercase border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant">
                <th className="p-gutter-md">Order ID</th>
                <th className="p-gutter-md">Date</th>
                <th className="p-gutter-md">Customer</th>
                <th className="p-gutter-md">Destination</th>
                <th className="p-gutter-md">Total</th>
                <th className="p-gutter-md">Fulfillment Status</th>
                <th className="p-gutter-md">Carrier Waybill</th>
                <th className="p-gutter-md text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-high transition-colors">
                  <td className="p-gutter-md font-bold text-accent tabular-nums">
                    {order.orderNumber}
                  </td>
                  <td className="p-gutter-md text-on-surface-variant">{formatDate(order.createdAt)}</td>
                  <td className="p-gutter-md text-on-surface">
                    <div className="flex flex-col">
                      <span className="font-bold">{order.customerName}</span>
                      <span className="text-[10px] text-on-surface-variant lowercase">
                        {order.customerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="p-gutter-md text-on-surface-variant">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </td>
                  <td className="p-gutter-md text-on-surface font-semibold tabular-nums">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-gutter-md">
                    {/* Live status switcher that updates customer tracking immediately */}
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, order.orderNumber, e.target.value as OrderStatus)
                      }
                      className={`font-label text-label-sm uppercase px-2 py-1 border text-xs font-bold bg-surface cursor-pointer focus:outline-none ${
                        order.status === 'DELIVERED'
                          ? 'border-outline text-on-surface-variant'
                          : order.status === 'CANCELLED'
                          ? 'border-error text-error'
                          : 'border-accent text-accent'
                      }`}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-gutter-md text-on-surface-variant tabular-nums">
                    <span className="font-mono text-xs">{order.trackingNumber}</span>
                  </td>
                  <td className="p-gutter-md text-right">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      <span>Slip</span>
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
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
