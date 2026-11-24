'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/stores/useProductStore';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const products = useProductStore((state) => state.products);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4" role="dialog">
      <div className="fixed inset-0 bg-surface/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface-container border border-outline shadow-2xl z-10 flex flex-col overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-outline bg-surface-container-low">
          <Search className="w-5 h-5 text-accent shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="SEARCH GARMENTS, SKUS, OR FABRICS (E.G. 'HOODIE', 'PARKA')..."
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant font-label text-label-md uppercase tracking-wider focus:outline-none focus:ring-0 border-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-accent font-label text-label-sm uppercase px-2 py-1 border border-outline"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestion Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-3">
          {query.trim() === '' ? (
            <div className="flex flex-col gap-3 py-4">
              <span className="font-label text-label-sm uppercase text-accent tracking-widest">
                SUGGESTED DISPATCHES
              </span>
              <div className="flex flex-wrap gap-2">
                {['DROP 04', 'HOODIE', 'PARACHUTE', 'RIPSTOP', 'PARKA', 'FLEECE'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="font-label text-label-sm uppercase px-3 py-1.5 bg-surface-container-low text-on-surface border border-outline hover:border-accent hover:text-accent transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant font-label text-label-sm uppercase text-on-surface-variant">
                <span>Matching Silhouettes ({results.length})</span>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  View All Results <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2 bg-surface-container-low hover:bg-surface border border-outline hover:border-accent transition-colors"
                >
                  <div className="w-14 h-18 bg-surface shrink-0 aspect-[3/4] overflow-hidden border border-outline">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="font-label text-label-sm text-accent uppercase">
                      {product.sku}
                    </span>
                    <span className="font-title text-title-md uppercase text-on-surface truncate">
                      {product.name}
                    </span>
                    <span className="font-label text-label-sm uppercase text-on-surface-variant">
                      {product.category}
                    </span>
                  </div>
                  <span className="font-headline text-headline-md text-on-surface tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <span className="font-headline text-headline-md uppercase text-on-surface">
                NO GARMENTS MATCH "{query.toUpperCase()}"
              </span>
              <span className="font-body text-body-md text-on-surface-variant">
                Try searching for 'hoodie', 'parka', 'cargo', or browse our categories.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
