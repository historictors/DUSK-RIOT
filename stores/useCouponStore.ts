import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Coupon } from '@/types';
import { INITIAL_COUPONS } from '@/data/mockData';

interface CouponState {
  coupons: Coupon[];
  isHydrated: boolean;
  setHydrated: (val: boolean) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => Coupon;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (
    code: string,
    subtotal: number
  ) => { valid: boolean; coupon?: Coupon; error?: string };
  incrementCouponUsage: (id: string) => void;
  resetCoupons: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: INITIAL_COUPONS,
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),

      addCoupon: (couponData) => {
        const newCoupon: Coupon = {
          ...couponData,
          id: `coup-${Date.now()}`,
          code: couponData.code.trim().toUpperCase(),
          usedCount: 0,
        };
        set((state) => ({
          coupons: [newCoupon, ...state.coupons],
        }));
        return newCoupon;
      },

      updateCoupon: (id, updates) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...updates,
                  code: updates.code ? updates.code.trim().toUpperCase() : c.code,
                }
              : c
          ),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      validateCoupon: (code, subtotal) => {
        const cleaned = code.trim().toUpperCase();
        const found = get().coupons.find((c) => c.code === cleaned);

        if (!found) {
          return { valid: false, error: 'Invalid coupon code.' };
        }
        if (!found.active) {
          return { valid: false, error: 'This coupon is no longer active.' };
        }
        if (found.usedCount >= found.usageLimit) {
          return { valid: false, error: 'Coupon usage limit has been reached.' };
        }
        if (new Date(found.expiry) < new Date()) {
          return { valid: false, error: 'This coupon has expired.' };
        }
        if (subtotal < found.minOrder) {
          return {
            valid: false,
            error: `Minimum order amount of $${found.minOrder} required for this code.`,
          };
        }

        return { valid: true, coupon: found };
      },

      incrementCouponUsage: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, usedCount: c.usedCount + 1 } : c
          ),
        }));
      },

      resetCoupons: () => {
        set({ coupons: INITIAL_COUPONS });
      },
    }),
    {
      name: 'dusk_riot_coupons_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
