'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import { Search, Plus, Minus, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function AdminInventoryPage() {
  const { products, setVariantStock, adjustVariantStock } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');

  // Flatten all variants with parent garment references
  const allVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      category: product.category,
    }))
  );

  const filteredVariants = allVariants.filter((v) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.productName.toLowerCase().includes(q) ||
      v.sku.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q);

    if (filterType === 'low') return matchesSearch && v.stock > 0 && v.stock <= 5;
    if (filterType === 'out') return matchesSearch && v.stock === 0;
    return matchesSearch;
  });

  const handleAdjust = (productId: string, variantId: string, delta: number, sku: string) => {
    adjustVariantStock(productId, variantId, delta);
    showToast(`UPDATED STOCK // SKU ${sku} (${delta > 0 ? `+${delta}` : delta})`, 'info');
  };

  const lowStockTotal = allVariants.filter((v) => v.stock > 0 && v.stock <= 5).length;
  const outOfStockTotal = allVariants.filter((v) => v.stock === 0).length;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="INVENTORY CONTROLLER"
        subtitle="VARIANT-LEVEL STOCK MATRIX & DEPLETION TELEMETRY"
        actions={
          <span className="font-label text-label-sm uppercase bg-surface-container px-3 py-1.5 border border-outline text-accent tabular-nums">
            {allVariants.reduce((sum, v) => sum + v.stock, 0)} TOTAL UNITS IN WAREHOUSE
          </span>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl flex flex-col gap-gutter-lg">
        {/* Quick Filter Buttons & Search Toolbar (Stitch Reference) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md bg-surface-container border border-outline p-gutter-md">
          <div className="flex items-center gap-gutter-sm flex-1">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
            <input
              type="search"
              placeholder="FILTER BY SKU, GARMENT, OR VARIANT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-on-surface font-label text-label-sm uppercase border-0 focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 font-label text-label-sm uppercase">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 border transition-colors ${
                filterType === 'all'
                  ? 'bg-accent text-on-accent border-accent font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant border-outline hover:text-on-surface'
              }`}
            >
              All Variants ({allVariants.length})
            </button>
            <button
              onClick={() => setFilterType('low')}
              className={`px-3 py-1.5 border transition-colors ${
                filterType === 'low'
                  ? 'bg-yellow-400 text-black border-yellow-400 font-semibold'
                  : 'bg-surface-container-low text-yellow-400 border-outline hover:border-yellow-400'
              }`}
            >
              Low Stock ({lowStockTotal})
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`px-3 py-1.5 border transition-colors ${
                filterType === 'out'
                  ? 'bg-error text-white border-error font-semibold'
                  : 'bg-surface-container-low text-error border-outline hover:border-error'
              }`}
            >
              Out of Stock ({outOfStockTotal})
            </button>
          </div>
        </div>

        {/* Inventory Matrix Table (Stitch Reference) */}
        <div className="bg-surface-container border border-outline overflow-x-auto scrollbar-none">
          <table className="w-full text-left font-label text-label-sm uppercase border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant">
                <th className="p-gutter-md">Silhouette</th>
                <th className="p-gutter-md">SKU</th>
                <th className="p-gutter-md">Size</th>
                <th className="p-gutter-md">Color</th>
                <th className="p-gutter-md">Stock Level</th>
                <th className="p-gutter-md">Health Status</th>
                <th className="p-gutter-md text-right">Instant Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredVariants.map((v) => {
                const isOut = v.stock === 0;
                const isLow = v.stock > 0 && v.stock <= 5;

                return (
                  <tr key={v.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="p-gutter-md">
                      <div className="flex items-center gap-gutter-md">
                        <img
                          src={v.productImage}
                          alt={v.productName}
                          className="w-10 h-14 object-cover border border-outline shrink-0 aspect-[3/4]"
                        />
                        <span className="font-title text-title-md uppercase text-on-surface">
                          {v.productName}
                        </span>
                      </div>
                    </td>
                    <td className="p-gutter-md text-accent font-bold tabular-nums">{v.sku}</td>
                    <td className="p-gutter-md font-bold text-on-surface">{v.size}</td>
                    <td className="p-gutter-md text-on-surface-variant">{v.color}</td>
                    <td className="p-gutter-md font-headline text-headline-md text-on-surface tabular-nums">
                      {v.stock}
                    </td>
                    <td className="p-gutter-md">
                      {isOut ? (
                        <span className="bg-surface text-error border border-error px-2 py-0.5 text-[10px] font-bold">
                          OUT OF STOCK
                        </span>
                      ) : isLow ? (
                        <span className="bg-surface text-yellow-400 border border-yellow-400 px-2 py-0.5 text-[10px] font-bold">
                          LOW STOCK (≤5)
                        </span>
                      ) : (
                        <span className="bg-surface text-accent border border-accent px-2 py-0.5 text-[10px]">
                          OPTIMAL
                        </span>
                      )}
                    </td>
                    <td className="p-gutter-md text-right">
                      <div className="inline-flex items-center gap-1 border border-outline bg-surface-container-low">
                        <button
                          type="button"
                          onClick={() => handleAdjust(v.productId, v.id, -1, v.sku)}
                          disabled={v.stock <= 0}
                          className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-error disabled:opacity-30 font-bold"
                          title="Decrease Stock"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-accent tabular-nums">
                          {v.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdjust(v.productId, v.id, 1, v.sku)}
                          className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-accent font-bold"
                          title="Increase Stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjust(v.productId, v.id, 10, v.sku)}
                          className="px-2 h-8 text-[10px] text-on-surface-variant hover:text-accent border-l border-outline"
                          title="Restock +10 units"
                        >
                          +10
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
