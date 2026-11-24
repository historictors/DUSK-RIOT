'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { showToast } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Collection } from '@/types';

export default function AdminCollectionsPage() {
  const { collections, products, addCollection, updateCollection, deleteCollection } = useProductStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [slug, setSlug] = useState('');
  const [season, setSeason] = useState('FW26');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'LIVE' | 'ARCHIVE' | 'UPCOMING'>('LIVE');
  const [bannerImage, setBannerImage] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCode('DR-05');
    setSlug('');
    setSeason('SS27');
    setDescription('');
    setStatus('LIVE');
    setBannerImage('https://lh3.googleusercontent.com/aida/ALJJyrCiH4f-jD8fZM7EqzjBTD5Aa1OONf71lmxtzKsR2lOx9YYOJ229EiO-c56zId3cxYYkObO6hhdWY6toHt_Ob3THVWIngC5J6WwxQf7CYjZM0RD7Ojjl3LuqECvQfDaNXmgw0YlHLcgOb2WoPwgTUa1S2AV5LAGDPfOkFvoqnf47diMejJ0-Z_E2ltVrbA7DQKCdBX08IpWidMEAJj9Cj0Y7k8MXDoPDR0fCgF_7IwmhMK3yliZc_SKz');
    setModalOpen(true);
  };

  const handleOpenEdit = (col: Collection) => {
    setEditingId(col.id);
    setName(col.name);
    setCode(col.code);
    setSlug(col.slug);
    setSeason(col.season);
    setDescription(col.description);
    setStatus(col.status);
    setBannerImage(col.bannerImage);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingId) {
      updateCollection(editingId, {
        name,
        code,
        slug: formattedSlug,
        season,
        description,
        status,
        bannerImage,
      });
      showToast(`UPDATED COLLECTION // ${name.toUpperCase()}`, 'success');
    } else {
      addCollection({
        name,
        code,
        slug: formattedSlug,
        season,
        description,
        status,
        bannerImage,
      });
      showToast(`NEW COLLECTION REGISTERED // ${name.toUpperCase()}`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, colName: string) => {
    if (confirm(`Archive collection ${colName}?`)) {
      deleteCollection(id);
      showToast(`DELETED COLLECTION ${colName.toUpperCase()}`, 'info');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="COLLECTIONS & RUNS"
        subtitle="CAPSULE & NUMBERED EDITION RELEASES"
        actions={
          <button
            onClick={handleOpenAdd}
            className="bg-accent text-on-accent font-label text-label-sm uppercase px-3 py-2 border border-accent hover:bg-primary font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Collection
          </button>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-6xl mx-auto w-full flex flex-col gap-gutter-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          {collections.map((col) => {
            const count = products.filter((p) => p.collectionSlug === col.slug || col.slug === 'drop-04').length;

            return (
              <div
                key={col.id}
                className="bg-surface-container border border-outline flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[16/9] bg-surface-container-low overflow-hidden">
                  <img src={col.bannerImage} alt={col.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-surface text-accent border border-accent font-label text-[10px] uppercase px-1.5 py-0.5 font-bold">
                    {col.status}
                  </div>
                  <div className="absolute top-2 right-2 bg-surface/90 border border-outline font-label text-[10px] uppercase px-2 py-0.5 text-on-surface">
                    {col.season}
                  </div>
                </div>

                <div className="p-gutter-md flex flex-col gap-2 font-label text-label-sm uppercase">
                  <div className="flex items-center justify-between">
                    <span className="text-accent text-xs font-bold">{col.code}</span>
                    <span className="text-on-surface-variant">{count} Silhouettes</span>
                  </div>
                  <h3 className="font-title text-title-lg text-on-surface">{col.name}</h3>
                  <p className="font-body text-body-md text-on-surface-variant lowercase normal-case">
                    {col.description}
                  </p>
                </div>

                <div className="p-gutter-md border-t border-outline flex items-center justify-between font-label text-label-sm uppercase">
                  <Link
                    href={`/collections/${col.slug}`}
                    target="_blank"
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Storefront View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 border border-outline hover:border-accent text-on-surface-variant hover:text-accent"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id, col.name)}
                      className="p-1.5 border border-outline hover:border-error text-on-surface-variant hover:text-error"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-surface/85 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-container border border-outline p-gutter-xl shadow-2xl z-10 flex flex-col gap-gutter-md font-label text-label-sm uppercase">
            <h3 className="font-headline text-headline-md text-on-surface border-b border-outline pb-2">
              {editingId ? 'Edit Collection' : 'Register Collection'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Collection Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-surface-container-low p-2.5 border border-outline text-accent uppercase focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant">Season</label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface focus:border-accent"
                >
                  <option value="LIVE">LIVE</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ARCHIVE">ARCHIVE</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface normal-case focus:border-accent resize-none font-body text-body-md"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent text-on-accent font-bold"
                >
                  Save Collection
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-3 border border-outline text-on-surface hover:text-error"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
