'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatPrice } from '@/lib/utils';
import { Search, Users, Mail, Phone, MapPin, Award } from 'lucide-react';

export default function AdminCustomersPage() {
  const allCustomers = useAuthStore((state) => state.allCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = allCustomers.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.memberId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="CUSTOMER DOSSIERS"
        subtitle="DUSK RIOT CLUB MEMBERSHIP & SPENDING ROSTER"
        actions={
          <span className="font-label text-label-sm uppercase bg-surface-container px-3 py-1.5 border border-outline text-accent tabular-nums">
            {allCustomers.length} VERIFIED MEMBERS
          </span>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl flex flex-col gap-gutter-lg">
        {/* Search Toolbar */}
        <div className="flex items-center gap-gutter-sm bg-surface-container border border-outline p-gutter-md">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="search"
            placeholder="FILTER BY MEMBER ID, NAME, OR EMAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-on-surface font-label text-label-sm uppercase border-0 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Customer Table */}
        <div className="bg-surface-container border border-outline overflow-x-auto scrollbar-none">
          <table className="w-full text-left font-label text-label-sm uppercase border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant">
                <th className="p-gutter-md">Member Ref</th>
                <th className="p-gutter-md">Customer Name</th>
                <th className="p-gutter-md">Contact</th>
                <th className="p-gutter-md">Club Tier</th>
                <th className="p-gutter-md">Orders Placed</th>
                <th className="p-gutter-md">Lifetime Spent</th>
                <th className="p-gutter-md">Default Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredCustomers.map((cust) => {
                const defaultAddr =
                  cust.addresses.find((a) => a.isDefault) || cust.addresses[0];

                return (
                  <tr key={cust.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="p-gutter-md font-bold text-accent tabular-nums">
                      {cust.memberId}
                    </td>
                    <td className="p-gutter-md font-bold text-on-surface text-base">
                      {cust.name}
                    </td>
                    <td className="p-gutter-md text-on-surface-variant lowercase">
                      <div className="flex flex-col">
                        <span className="text-on-surface">{cust.email}</span>
                        <span className="text-[10px] text-on-surface-variant">{cust.phone}</span>
                      </div>
                    </td>
                    <td className="p-gutter-md">
                      <span className="bg-surface text-accent border border-accent px-2 py-0.5 text-[10px] font-bold">
                        {cust.tier}
                      </span>
                    </td>
                    <td className="p-gutter-md font-headline text-headline-md text-on-surface tabular-nums">
                      {cust.totalOrders}
                    </td>
                    <td className="p-gutter-md text-accent font-semibold tabular-nums">
                      {formatPrice(cust.totalSpent)}
                    </td>
                    <td className="p-gutter-md text-on-surface-variant">
                      {defaultAddr ? (
                        <div className="flex flex-col text-[11px]">
                          <span>{defaultAddr.addressLine}</span>
                          <span>
                            {defaultAddr.city}, {defaultAddr.postalCode}
                          </span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/40">No address recorded</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
