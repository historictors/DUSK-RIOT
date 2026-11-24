'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/stores/useProductStore';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Search, X, SlidersHorizontal } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const products = useProductStore((state) => state.products);
  const categories = useProductStore((state) => state.categories);

  const searchResults = useMemo(() => {
    return products.filter((product) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'all' || product.categorySlug === selectedCategory;

      return matchesQuery && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="bg-surface min-h-screen">
      {/* Search Header Banner */}
      <div className="border-b border-outline bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-section flex flex-col gap-gutter-lg">
          <div className="flex flex-col gap-gutter-xs">
            <span className="font-label text-label-sm uppercase text-accent tracking-widest">
              DISPATCH SEARCH MATRIX
            </span>
            <h1 className="font-display text-display-xl-mobile md:text-display-lg uppercase text-on-surface">
              SEARCH RESULTS
            </h1>
          </div>

          {/* Interactive Search Input Box */}
          <div className="flex items-center gap-3 p-3 bg-surface border border-outline focus-within:border-accent">
            <Search className="w-5 h-5 text-accent shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH BY GARMENT NAME, SKU, OR FABRIC..."
              className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant font-label text-label-md uppercase tracking-wider focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`font-label text-label-sm uppercase px-3 py-1.5 border transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-accent text-on-accent border-accent font-semibold'
                  : 'bg-surface text-on-surface-variant border-outline hover:text-on-surface'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`font-label text-label-sm uppercase px-3 py-1.5 border transition-colors ${
                  selectedCategory === c.slug
                    ? 'bg-accent text-on-accent border-accent font-semibold'
                    : 'bg-surface text-on-surface-variant border-outline hover:text-on-surface'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <main className="max-w-[1440px] mx-auto px-gutter-md md:px-page-margin py-section">
        <div className="border-b border-outline pb-gutter-md mb-gutter-xl flex items-center justify-between font-label text-label-sm uppercase text-on-surface-variant">
          <span>
            {searchResults.length} Silhouettes Found {searchTerm ? `for "${searchTerm.toUpperCase()}"` : ''}
          </span>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-accent underline">
              Clear Search
            </button>
          )}
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-4 bg-surface-container border border-outline">
            <span className="font-headline text-headline-md uppercase text-on-surface">
              NO MATCHING GARMENTS FOUND
            </span>
            <p className="font-body text-body-md text-on-surface-variant max-w-sm">
              We couldn't locate any garments matching your query. Check your spelling or browse through our complete shop catalog.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-accent text-on-accent font-label text-label-sm uppercase px-gutter-lg py-3 font-semibold"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface p-12 text-center text-on-surface font-label uppercase">
          Loading Search Matrix...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
