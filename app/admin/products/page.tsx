'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { Search, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will remove it from the storefront catalog.`)) {
      deleteProduct(id);
      showToast(`DELETED ${name.toUpperCase()} FROM CATALOG`, 'info');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="PRODUCT CATALOG"
        subtitle="GARMENT INVENTORY ARCHITECTURE"
        actions={
          <Link
            href="/admin/products/new"
            className="bg-accent text-on-accent font-label text-label-sm uppercase px-3 py-2 border border-accent hover:bg-primary hover:text-on-primary flex items-center gap-1.5 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Garment</span>
          </Link>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl flex flex-col gap-gutter-lg">
        {/* Toolbar (Stitch Reference) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md bg-surface-container border border-outline p-gutter-md">
          <div className="flex items-center gap-gutter-sm flex-1">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
            <input
              type="search"
              placeholder="FILTER BY SKU OR GARMENT NAME..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-on-surface font-label text-label-sm uppercase border-0 focus:ring-0 focus:outline-none"
            />
          </div>
          <span className="font-label text-label-sm uppercase text-on-surface-variant tabular-nums">
            {filteredProducts.length} ACTIVE GARMENTS
          </span>
        </div>

        {/* Product Table (Stitch Reference) */}
        <div className="bg-surface-container border border-outline overflow-x-auto scrollbar-none">
          <table className="w-full text-left font-label text-label-sm uppercase border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant">
                <th className="p-gutter-md">Garment</th>
                <th className="p-gutter-md">SKU</th>
                <th className="p-gutter-md">Category</th>
                <th className="p-gutter-md">Price</th>
                <th className="p-gutter-md">Stock</th>
                <th className="p-gutter-md">Status</th>
                <th className="p-gutter-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

                return (
                  <tr key={p.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="p-gutter-md">
                      <div className="flex items-center gap-gutter-md">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-16 object-cover border border-outline shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-title text-title-md uppercase text-on-surface truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            {p.variants.length} Sizes // {p.fit}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-gutter-md text-accent font-bold tabular-nums">{p.sku}</td>
                    <td className="p-gutter-md text-on-surface-variant">{p.category}</td>
                    <td className="p-gutter-md text-on-surface font-semibold tabular-nums">
                      {formatPrice(p.price)}
                    </td>
                    <td className="p-gutter-md">
                      <span
                        className={`tabular-nums font-bold ${
                          totalStock === 0
                            ? 'text-error'
                            : totalStock <= 10
                            ? 'text-yellow-400'
                            : 'text-on-surface'
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-gutter-md">
                      <span
                        className={`px-2 py-0.5 border text-[10px] ${
                          p.status === 'PUBLISHED'
                            ? 'bg-surface text-accent border-accent'
                            : 'bg-surface text-on-surface-variant border-outline'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-gutter-md text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          title="View on storefront"
                          className="p-1.5 border border-outline hover:border-accent text-on-surface-variant hover:text-accent"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          title="Edit garment"
                          className="p-1.5 border border-outline hover:border-accent text-on-surface-variant hover:text-accent"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Delete garment"
                          className="p-1.5 border border-outline hover:border-error text-on-surface-variant hover:text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
