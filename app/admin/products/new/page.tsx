'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { showToast } from '@/components/ui/Toast';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GarmentSize, ProductVariant } from '@/types';

const PRESET_IMAGES = [
  {
    name: 'Obsidian Hoodie (Front)',
    url: 'https://lh3.googleusercontent.com/aida/ALJJyrBfwsSIT28wsgq92Q_bPgaYHYIeoQoIa9K3FbfAEqu3GZzyfu7Z7V4iQsweh9xccmURlopZqqHgv_LV-TVvE4xfbF3XfgXP1DM0VoIsah8PRXS4RUYgLjvPeZY1-3zVW3FziuMWWqJq0D6KQpXcXmZl5cCxu8NxM1zblbE5V94OMcU0JlW0vU6QP7TjaeGVlUgPhvqs6hEVN4LDNyYL0FaZh3iLrVXai0FcA71lZ1nISn8O0XDU',
  },
  {
    name: 'Model Fit (Editorial)',
    url: 'https://lh3.googleusercontent.com/aida/ALJJyrD2hfwVgdk_WNozCH080Ekh3L5Y9e7RmT1-pFMezd8voka_S_wSlk0sgCjCzStO1y9JYrw_TOKvfOHOGCEfyq_jsm4dUNAmXqO6nL9WPjStbQKCd8A15EhdPu0OEEMnaw7dj1lIVlzIYJdI4CIO2Yp4bPLX-S7fIW8nr-Wksu1lebm2rEB9an29WYmuE_qlEel7k9ZZ-uRQjdWVW8ujI2SxFmtojMBJnY324mWZTyxNpDZ4BlgtHttMlqk',
  },
  {
    name: 'Tactical Parachute Cargo',
    url: 'https://lh3.googleusercontent.com/aida/ALJJyrB9heaBxBErpVPUhhHJraWv2jomYyjFgZSc95P27tdGuCLzo3-G4Sv-LpJyg6TerkLzm6xLIZ1v3rugX2g7opNeI2Nl2R4wo3uxxOAjUAx_hfeOmXUHZhhBT9iSaE0uxYWcT4XzkTFbeHZk0ODNS2uAIDNo4x9e4OxoypcoAU_F1EU0xW0R7DU3tOwyGJPISECOdNMjL46LyM9qMaB4KNb-ueNZVq_KpDgEcU9uuS1nsG-XS1w',
  },
  {
    name: 'Sub-Zero Ripstop Parka',
    url: 'https://lh3.googleusercontent.com/aida/ALJJyrCaS9-tnngtFyFl-m0AE6X-VBq9LOiFjXyHxXoEJaBC60uOI_O3QtcICqqpOo2lCQdsvVS2SXzxVczWbxpLghIP2Hd7lPECOSTpkhVqeQyxs3-bAeJudukFsIE-m2HfXB7uojC4CFvJE0qdhCuHE441aURY4ROaFml5CSWJee1aLg4QciWaDd2WoAEfYp0x2jZOnXuyCulsTH0qQQNNr5m2P9rjC4YFKUVQrOOWHA_CpfxpUw',
  },
  {
    name: 'Static Boxy Tee',
    url: 'https://lh3.googleusercontent.com/aida/ALJJyrBlQXRxKDGWRm8dklBPo2D7RyYO0W8YvhHTviDDZOzJcCjYiKzCfWLBAOU7n0eqOvnbMQIUsxiBb1xw-liQou3yOrAC2RhofPA8epMfwFxgTnAkjsC1o4CqY2QaYZAMNyT8NVPQPAY9RBWBpNq8skJbN2TZAiCqOLMt71hVwYJZvk-VRXn1ciULsgZoZTq_utHEnfVhMIHa5V2qCg8O3d-clL6pCior3VWyVRieSHgpiT5Q',
  },
];

export default function AddProductPage() {
  const router = useRouter();
  const { categories, collections, addProduct } = useProductStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState(`DR-04-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categorySlug, setCategorySlug] = useState('hoodies-fleece');
  const [collectionSlug, setCollectionSlug] = useState('drop-04');
  const [price, setPrice] = useState(165);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState(
    'Oversized boxy cut engineered from custom-milled heavyweight French terry. Distressed raw seam detailing.'
  );
  const [materials, setMaterials] = useState('100% Custom-Milled Heavyweight Cotton');
  const [gsm, setGsm] = useState('480 GSM');
  const [fit, setFit] = useState('Oversized Boxy Streetwear Cut');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [featured, setFeatured] = useState(true);

  // Variant stocks
  const [stockS, setStockS] = useState(10);
  const [stockM, setStockM] = useState(15);
  const [stockL, setStockL] = useState(12);
  const [stockXL, setStockXL] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide a garment title', 'error');
      return;
    }

    const selectedCategory = categories.find((c) => c.slug === categorySlug);
    const selectedCollection = collections.find((c) => c.slug === collectionSlug);

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const variants: ProductVariant[] = [
      { id: `v-${Date.now()}-s`, sku: `${sku}-S`, size: 'S', color: 'Black', colorHex: '#141414', stock: Number(stockS), price: Number(price) },
      { id: `v-${Date.now()}-m`, sku: `${sku}-M`, size: 'M', color: 'Black', colorHex: '#141414', stock: Number(stockM), price: Number(price) },
      { id: `v-${Date.now()}-l`, sku: `${sku}-L`, size: 'L', color: 'Black', colorHex: '#141414', stock: Number(stockL), price: Number(price) },
      { id: `v-${Date.now()}-xl`, sku: `${sku}-XL`, size: 'XL', color: 'Black', colorHex: '#141414', stock: Number(stockXL), price: Number(price) },
    ];

    const created = addProduct({
      slug: slug || `garment-${Date.now()}`,
      name: name.toUpperCase(),
      sku: sku.toUpperCase(),
      category: selectedCategory?.name || 'Hoodies & Fleece',
      categorySlug,
      collection: selectedCollection?.name || 'Drop 04 // Nocturnal Signal',
      collectionSlug,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      details: [
        `${gsm} Custom French Terry`,
        'Reinforced bar-tack distressed stitching',
        'Drop shoulder boxy silhouette',
        'Tonal logo insignia placement',
      ],
      materials,
      gsm,
      fit,
      care: 'Cold wash inside out. Hang dry only.',
      images: [imageUrl, PRESET_IMAGES[1].url],
      featured,
      isNewArrival: true,
      status,
      variants,
      tags: [categorySlug, 'streetwear', 'dusk riot', 'fw26'],
    });

    showToast(`GARMENT ${created.name} CREATED & PUBLISHED TO STOREFRONT!`, 'success');
    router.push('/admin/products');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="ADD NEW GARMENT"
        subtitle="STUDIO FULFILLMENT CATALOG SPECIFICATION"
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-lg sm:gap-gutter-xl">
          {/* Main Info Box */}
          <div className="bg-surface-container border border-outline p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-md sm:gap-gutter-lg font-label text-label-sm uppercase">
            <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-gutter-sm">
              PRIMARY GARMENT SPECIFICATIONS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Garment Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.G. ACID WASH REVERSIBLE BOMBER"
                  className="bg-surface-container-low p-3 border border-outline text-on-surface uppercase focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">SKU Reference</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-accent font-bold uppercase focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Division Category</label>
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
                <label className="text-on-surface-variant">Collection Drop</label>
                <select
                  value={collectionSlug}
                  onChange={(e) => setCollectionSlug(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
                >
                  {collections.map((col) => (
                    <option key={col.id} value={col.slug}>
                      {col.name} ({col.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Price ($ USD)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Compare-at Price ($ USD - Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={originalPrice || ''}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="E.G. 210"
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Garment Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent resize-none font-body text-body-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Fabric Composition</label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Fabric Weight (GSM)</label>
                <input
                  type="text"
                  value={gsm}
                  onChange={(e) => setGsm(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Silhouette Fit</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Imagery & Preview Box */}
          <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg font-label text-label-sm uppercase">
            <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-gutter-sm">
              EDITORIAL IMAGERY
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-on-surface-variant">Garment Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent text-xs font-mono lowercase"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-on-surface-variant">Select from Stitch Studio High-Res Presets:</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`aspect-[3/4] border overflow-hidden p-1 bg-surface-container-low flex flex-col items-center justify-between text-[10px] ${
                      imageUrl === preset.url ? 'border-accent text-accent' : 'border-outline text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-24 object-cover" />
                    <span className="truncate w-full text-center mt-1">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Variant Stocks Box */}
          <div className="bg-surface-container border border-outline p-gutter-xl flex flex-col gap-gutter-lg font-label text-label-sm uppercase">
            <h2 className="font-headline text-headline-md text-on-surface border-b border-outline pb-gutter-sm">
              SIZE VARIANT INVENTORY ALLOCATION
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-md">
              <div className="flex flex-col gap-1">
                <label className="text-accent font-bold">Size S Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stockS}
                  onChange={(e) => setStockS(Number(e.target.value))}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-accent font-bold">Size M Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stockM}
                  onChange={(e) => setStockM(Number(e.target.value))}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-accent font-bold">Size L Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stockL}
                  onChange={(e) => setStockL(Number(e.target.value))}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-accent font-bold">Size XL Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stockXL}
                  onChange={(e) => setStockXL(Number(e.target.value))}
                  className="bg-surface-container-low p-3 border border-outline text-on-surface focus:border-accent tabular-nums font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-outline pt-gutter-md">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="text-accent bg-surface"
                />
                <span className="text-on-surface">Mark as Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'PUBLISHED'}
                  onChange={() => setStatus('PUBLISHED')}
                  className="text-accent bg-surface"
                />
                <span className="text-on-surface">Publish Immediately</span>
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-gutter-md">
            <button
              type="submit"
              className="flex-1 py-4 bg-accent text-on-accent font-label text-label-lg uppercase tracking-wider font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Arm & Publish Garment</span>
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
