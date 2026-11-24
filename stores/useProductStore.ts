import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Category, Collection } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS } from '@/data/mockData';

interface ProductState {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  isHydrated: boolean;
  setHydrated: (val: boolean) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustVariantStock: (productId: string, variantId: string, delta: number) => void;
  setVariantStock: (productId: string, variantId: string, newStock: number) => void;
  addCategory: (cat: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addCollection: (col: Omit<Collection, 'id' | 'itemCount'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  resetAll: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      collections: INITIAL_COLLECTIONS,
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),

      addProduct: (productData) => {
        const id = `prod-${Date.now()}`;
        const newProduct: Product = {
          ...productData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      adjustVariantStock: (productId, variantId, delta) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: p.variants.map((v) => {
                if (v.id !== variantId) return v;
                const newStock = Math.max(0, v.stock + delta);
                return { ...v, stock: newStock };
              }),
            };
          }),
        }));
      },

      setVariantStock: (productId, variantId, newStock) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: p.variants.map((v) => {
                if (v.id !== variantId) return v;
                return { ...v, stock: Math.max(0, newStock) };
              }),
            };
          }),
        }));
      },

      addCategory: (cat) => {
        const id = `cat-${Date.now()}`;
        set((state) => ({
          categories: [...state.categories, { ...cat, id, itemCount: 0 }],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addCollection: (col) => {
        const id = `col-${Date.now()}`;
        set((state) => ({
          collections: [...state.collections, { ...col, id, itemCount: 0 }],
        }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        }));
      },

      resetAll: () => {
        set({
          products: INITIAL_PRODUCTS,
          categories: INITIAL_CATEGORIES,
          collections: INITIAL_COLLECTIONS,
        });
      },
    }),
    {
      name: 'dusk_riot_products_v2',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
