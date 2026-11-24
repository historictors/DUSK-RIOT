'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { showToast } from '@/components/ui/Toast';
import { ArrowLeft, Save } from 'lucide-react';
import { ProductVariant } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { products, categories, collections, updateProduct } = useProductStore();
  const product = products.find((p) => p.id === id);

  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug || 'hoodies-fleece');
  const [collectionSlug, setCollectionSlug] = useState(product?.collectionSlug || 'drop-04');
  const [price, setPrice] = useState(product?.price || 165);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product?.originalPrice);
  const [description, setDescription] = useState(product?.description || '');
  const [materials, setMaterials] = useState(product?.materials || '');
  const [gsm, setGsm] = useState(product?.gsm || '480 GSM');
  const [fit, setFit] = useState(product?.fit || '');
  const [imageUrl, setImageUrl] = useState(product?.images[0] || '');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>(product?.status || 'PUBLISHED');
  const [featured, setFeatured] = useState(product?.featured || false);

  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategorySlug(product.categorySlug);
      setCollectionSlug(product.collectionSlug);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice);
      setDescription(product.description);
      setMaterials(product.materials);
      setGsm(product.gsm || '480 GSM');
      setFit(product.fit);
      setImageUrl(product.images[0] || '');
      setStatus(product.status);
      setFeatured(product.featured);
      setVariants(product.variants);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-12 text-center">
        <h2 className="font-headline text-headline-lg uppercase text-on-surface">Garment Not Found</h2>
        <Link href="/admin/products" className="text-accent underline mt-4 inline-block">
          Return to Product Roster
        </Link>
      </div>
    );
  }

  const handleUpdateStock = (variantId: string, newStock: number) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.slug === categorySlug);
    const col = collections.find((c) => c.slug === collectionSlug);

    updateProduct(product.id, {
      name: name.toUpperCase(),
      sku: sku.toUpperCase(),
      category: cat?.name || product.category,
      categorySlug,
      collection: col?.name || product.collection,
      collectionSlug,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      materials,
      gsm,
      fit,
      images: [imageUrl, ...(product.images.slice(1) || [])],
      status,
      featured,
      variants,
    });

    showToast(`UPDATED ${name.toUpperCase()} // SYNCHRONIZED ACROSS STOREFRONT`, 'success');
    router.push('/admin/products');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={`EDIT GARMENT // ${product.sku}`}
        subtitle={product.name}
        actions={
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 font-label text-label-sm uppercase text-on-surface-variant hover:text-accent border border-outline px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-5xl mx-auto w-full">
        <form onSubmit={handleSave} className="flex flex-col gap-gutter-lg sm:gap-gutter-xl">
          <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-md sm:gap-gutter-lg font-label text-label-sm uppercase">
            <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-gutter-sm">
              SPECIFICATIONS & PRICING
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Garment Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface uppercase focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">SKU</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-accent font-bold uppercase focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Category</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Price ($ USD)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent resize-none font-body text-body-md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent text-xs font-mono lowercase"
              />
            </div>
          </div>

          {/* Variant Stock Editing Box */}
          <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg font-label text-label-sm uppercase">
            <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-gutter-sm">
              VARIANT STOCK LEVELS
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-md">
              {variants.map((v) => (
                <div key={v.id} className="p-3 bg-surface-container-low border border-outline flex flex-col gap-2">
                  <span className="font-bold text-accent">Size {v.size}</span>
                  <input
                    type="number"
                    min="0"
                    value={v.stock}
                    onChange={(e) => handleUpdateStock(v.id, Number(e.target.value))}
                    className="p-2 bg-surface text-on-surface border border-outline tabular-nums font-bold"
                  />
                  <span className="text-[10px] text-on-surface-variant">SKU: {v.sku}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-gutter-md">
            <button
              type="submit"
              className="flex-1 py-4 bg-accent text-on-accent font-label text-label-lg uppercase tracking-wider font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
            <Link
              href="/admin/products"
              className="px-gutter-xl py-4 border border-outline text-on-surface font-label text-label-lg uppercase hover:border-error hover:text-error transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
