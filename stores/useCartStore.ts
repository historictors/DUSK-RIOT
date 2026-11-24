import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  shippingMethod: 'express' | 'standard';
  isHydrated: boolean;
  setHydrated: (val: boolean) => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setShippingMethod: (method: 'express' | 'standard') => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      shippingMethod: 'express',
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),

      addItem: (product, variant, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.productId === product.id && i.variantId === variant.id
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          const newItem: CartItem = {
            id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            productId: product.id,
            product,
            variantId: variant.id,
            size: variant.size,
            color: variant.color,
            quantity,
            price: variant.price || product.price,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const { appliedCoupon } = get();
        const subtotal = get().getSubtotal();
        if (!appliedCoupon || subtotal <= 0) return 0;

        if (appliedCoupon.type === 'PERCENTAGE') {
          return (subtotal * appliedCoupon.value) / 100;
        }
        if (appliedCoupon.type === 'FIXED') {
          return Math.min(appliedCoupon.value, subtotal);
        }
        return 0;
      },

      getShippingFee: () => {
        const { appliedCoupon, shippingMethod } = get();
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (appliedCoupon?.type === 'FREE_SHIPPING') return 0;
        if (subtotal >= 200) return 0; // Free express shipping unlocked over $200
        if (shippingMethod === 'standard') return 0;
        return 15; // standard express courier fee if under $200
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'dusk_riot_cart_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
