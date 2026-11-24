import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Customer, CustomerAddress } from '@/types';
import { INITIAL_CUSTOMERS } from '@/data/mockData';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
  token?: string;
}

interface AuthState {
  currentUser: Customer | null;
  adminUser: AdminUser | null;
  allCustomers: Customer[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrated: boolean;
  setHydrated: (val: boolean) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string; customer?: Customer }>;
  logout: () => void;
  logoutAdmin: () => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<CustomerAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateProfile: (updates: Partial<Customer>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null, // NOT logged in by default
      adminUser: null,
      allCustomers: INITIAL_CUSTOMERS,
      isAuthenticated: false,
      isAdmin: false,
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),

      login: async (email, password) => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!password || password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        // 1. Try real database API authentication first
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: trimmedEmail, password }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              set({
                currentUser: {
                  ...data.user,
                  totalOrders: 0,
                  totalSpent: 0,
                },
                isAuthenticated: true,
              });
              return { success: true };
            }
          } else {
            const errData = await res.json().catch(() => null);
            if (errData?.error && !errData.error.includes('temporarily unavailable')) {
              // Real DB returned a credential rejection
              return { success: false, error: errData.error };
            }
          }
        } catch {
          // Fall through to fallback demo credentials if DB is unconfigured
        }

        // 2. Demo credential verification fallback (for academic/offline demo testing)
        // Checks known demo accounts with explicit matching password
        const found = get().allCustomers.find(
          (c) => c.email.toLowerCase() === trimmedEmail
        );

        if (found && (password === 'password123' || password === 'dusk2026')) {
          set({
            currentUser: found,
            isAuthenticated: true,
          });
          return { success: true };
        }

        return {
          success: false,
          error: 'ACCESS DENIED // Invalid email or password. Verify credentials or register a new member account.',
        };
      },

      loginAdmin: async (email, password) => {
        const trimmedEmail = email.trim().toLowerCase();

        // Strict admin verification
        if (trimmedEmail === 'admin@duskriot.com' && password === 'admin123') {
          const adminData: AdminUser = {
            id: 'admin-sys',
            name: 'DUSK RIOT SYS ADMIN',
            email: 'admin@duskriot.com',
            role: 'ADMIN',
          };
          set({
            adminUser: adminData,
            isAdmin: true,
          });
          return { success: true };
        }

        return {
          success: false,
          error: 'ACCESS DENIED // Invalid administrator credentials.',
        };
      },

      register: async (name, email, password) => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!name.trim()) {
          return { success: false, error: 'Full name is required' };
        }

        if (!password || password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        // 1. Try real database API registration first
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim(), email: trimmedEmail, password }),
          });

          if (res.ok) {
            const created = await res.json();
            const newCustomer: Customer = {
              id: created.id,
              name: created.name,
              email: created.email,
              memberId: created.memberId,
              tier: 'RECRUIT // TIER 01',
              phone: '+1 (555) 000-0000',
              joinedDate: new Date().toISOString().split('T')[0],
              totalOrders: 0,
              totalSpent: 0,
              addresses: [],
            };

            set((state) => ({
              allCustomers: [newCustomer, ...state.allCustomers],
              currentUser: newCustomer,
              isAuthenticated: true,
            }));

            return { success: true, customer: newCustomer };
          } else {
            const errData = await res.json().catch(() => null);
            if (errData?.error && !errData.error.includes('failed')) {
              return { success: false, error: errData.error };
            }
          }
        } catch {
          // Fall through to local registration fallback
        }

        // 2. Client fallback registration
        const existing = get().allCustomers.find(
          (c) => c.email.toLowerCase() === trimmedEmail
        );

        if (existing) {
          return { success: false, error: 'An account with this email already exists' };
        }

        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: name.trim().toUpperCase(),
          email: trimmedEmail,
          memberId: `DR-${Math.floor(1000 + Math.random() * 9000)}`,
          tier: 'RECRUIT // TIER 01',
          phone: '+1 (555) 000-0000',
          joinedDate: new Date().toISOString().split('T')[0],
          totalOrders: 0,
          totalSpent: 0,
          addresses: [],
        };

        set((state) => ({
          allCustomers: [newCustomer, ...state.allCustomers],
          currentUser: newCustomer,
          isAuthenticated: true,
        }));

        return { success: true, customer: newCustomer };
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },

      logoutAdmin: () => {
        set({
          adminUser: null,
          isAdmin: false,
        });
      },

      addAddress: (addrData) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const newAddr: CustomerAddress = {
          ...addrData,
          id: `addr-${Date.now()}`,
        };

        const updatedAddresses = addrData.isDefault
          ? currentUser.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
          : [...currentUser.addresses, newAddr];

        const updatedUser = { ...currentUser, addresses: updatedAddresses };
        set((state) => ({
          currentUser: updatedUser,
          allCustomers: state.allCustomers.map((c) => (c.id === updatedUser.id ? updatedUser : c)),
        }));
      },

      updateAddress: (id, updates) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const updatedAddresses = currentUser.addresses.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        );
        const updatedUser = { ...currentUser, addresses: updatedAddresses };

        set((state) => ({
          currentUser: updatedUser,
          allCustomers: state.allCustomers.map((c) => (c.id === updatedUser.id ? updatedUser : c)),
        }));
      },

      deleteAddress: (id) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const updatedAddresses = currentUser.addresses.filter((a) => a.id !== id);
        const updatedUser = { ...currentUser, addresses: updatedAddresses };

        set((state) => ({
          currentUser: updatedUser,
          allCustomers: state.allCustomers.map((c) => (c.id === updatedUser.id ? updatedUser : c)),
        }));
      },

      setDefaultAddress: (id) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const updatedAddresses = currentUser.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));
        const updatedUser = { ...currentUser, addresses: updatedAddresses };

        set((state) => ({
          currentUser: updatedUser,
          allCustomers: state.allCustomers.map((c) => (c.id === updatedUser.id ? updatedUser : c)),
        }));
      },

      updateProfile: (updates) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        set((state) => ({
          currentUser: updatedUser,
          allCustomers: state.allCustomers.map((c) => (c.id === updatedUser.id ? updatedUser : c)),
        }));
      },
    }),
    {
      name: 'dusk_riot_auth_v3',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
