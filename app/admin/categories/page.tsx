'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProductStore } from '@/stores/useProductStore';
import { showToast } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProductStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleOpenAdd = () => {
    setEditingCatId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://lh3.googleusercontent.com/aida/ALJJyrBfwsSIT28wsgq92Q_bPgaYHYIeoQoIa9K3FbfAEqu3GZzyfu7Z7V4iQsweh9xccmURlopZqqHgv_LV-TVvE4xfbF3XfgXP1DM0VoIsah8PRXS4RUYgLjvPeZY1-3zVW3FziuMWWqJq0D6KQpXcXmZl5cCxu8NxM1zblbE5V94OMcU0JlW0vU6QP7TjaeGVlUgPhvqs6hEVN4LDNyYL0FaZh3iLrVXai0FcA71lZ1nISn8O0XDU');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCatId) {
      updateCategory(editingCatId, {
        name,
        slug: formattedSlug,
        description,
        image,
      });
      showToast(`UPDATED CATEGORY // ${name.toUpperCase()}`, 'success');
    } else {
      addCategory({
        name,
        slug: formattedSlug,
        description,
        image,
      });
      showToast(`NEW CATEGORY CREATED // ${name.toUpperCase()}`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Delete division ${catName}?`)) {
      deleteCategory(id);
      showToast(`DELETED CATEGORY ${catName.toUpperCase()}`, 'info');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="CATEGORIES & DIVISIONS"
        subtitle="STOREFRONT ARCHITECTURAL TAXONOMY"
        actions={
          <button
            onClick={handleOpenAdd}
            className="bg-accent text-on-accent font-label text-label-sm uppercase px-3 py-2 border border-accent hover:bg-primary font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Category
          </button>
        }
      />

      <main className="flex-1 p-gutter-md md:p-gutter-xl max-w-6xl mx-auto w-full flex flex-col gap-gutter-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categorySlug === cat.slug).length;

            return (
              <div
                key={cat.id}
                className="bg-surface-container border border-outline flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[16/9] bg-surface-container-low overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-surface/90 border border-outline font-label text-[11px] uppercase px-2 py-0.5 text-accent font-bold">
                    {count} Silhouettes
                  </div>
                </div>

                <div className="p-gutter-md flex flex-col gap-2 font-label text-label-sm uppercase">
                  <span className="text-accent text-[11px]">SLUG: /{cat.slug}</span>
                  <h3 className="font-title text-title-lg text-on-surface">{cat.name}</h3>
                  <p className="font-body text-body-md text-on-surface-variant lowercase normal-case">
                    {cat.description}
                  </p>
                </div>

                <div className="p-gutter-md border-t border-outline flex items-center justify-between font-label text-label-sm uppercase">
                  <Link
                    href={`/category/${cat.slug}`}
                    target="_blank"
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Storefront View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 border border-outline hover:border-accent text-on-surface-variant hover:text-accent"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-surface/85 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-container border border-outline p-gutter-xl shadow-2xl z-10 flex flex-col gap-gutter-md font-label text-label-sm uppercase">
            <h3 className="font-headline text-headline-md text-on-surface border-b border-outline pb-2">
              {editingCatId ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface uppercase focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. hoodies-fleece"
                  className="bg-surface-container-low p-2.5 border border-outline text-accent lowercase focus:border-accent"
                />
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

              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant">Banner Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="bg-surface-container-low p-2.5 border border-outline text-on-surface text-xs font-mono lowercase focus:border-accent"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent text-on-accent font-bold"
                >
                  Save Category
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
