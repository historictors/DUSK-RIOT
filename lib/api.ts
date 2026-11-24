// Client-side API wrapper for DUSK RIOT backend
const API = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // ─── AUTH ───
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ─── PRODUCTS ───
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi<any>(`/products${qs}`);
    },
    get: (id: string) => fetchApi<any>(`/products/${id}`),
    getBySlug: (slug: string) => fetchApi<any>(`/products/slug/${slug}`),
    create: (data: any) => fetchApi<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/products/${id}`, { method: 'DELETE' }),
  },

  // ─── CATEGORIES ───
  categories: {
    list: () => fetchApi<any[]>('/categories'),
    get: (id: string) => fetchApi<any>(`/categories/${id}`),
    create: (data: any) => fetchApi<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/categories/${id}`, { method: 'DELETE' }),
  },

  // ─── COLLECTIONS ───
  collections: {
    list: () => fetchApi<any[]>('/collections'),
    get: (id: string) => fetchApi<any>(`/collections/${id}`),
    create: (data: any) => fetchApi<any>('/collections', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/collections/${id}`, { method: 'DELETE' }),
  },

  // ─── SEARCH ───
  search: (q: string) => fetchApi<any>(`/search?q=${encodeURIComponent(q)}`),

  // ─── CART ───
  cart: {
    get: () => fetchApi<any>('/cart'),
    addItem: (data: { productId: string; variantId: string; quantity?: number }) =>
      fetchApi<any>('/cart/items', { method: 'POST', body: JSON.stringify(data) }),
    updateItem: (id: string, quantity: number) =>
      fetchApi<any>(`/cart/items/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    removeItem: (id: string) => fetchApi<void>(`/cart/items/${id}`, { method: 'DELETE' }),
    clear: () => fetchApi<void>('/cart', { method: 'DELETE' }),
    merge: (items: any[]) => fetchApi<any>('/cart/merge', { method: 'POST', body: JSON.stringify({ items }) }),
  },

  // ─── WISHLIST ───
  wishlist: {
    get: () => fetchApi<any[]>('/wishlist'),
    toggle: (productId: string) =>
      fetchApi<any>('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
    remove: (productId: string) => fetchApi<void>(`/wishlist/${productId}`, { method: 'DELETE' }),
  },

  // ─── ORDERS ───
  orders: {
    list: () => fetchApi<any[]>('/orders'),
    get: (id: string) => fetchApi<any>(`/orders/${id}`),
    create: (data: any) => fetchApi<any>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    cancel: (id: string) => fetchApi<any>(`/orders/${id}/cancel`, { method: 'POST' }),
    updateStatus: (id: string, data: any) =>
      fetchApi<any>(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // ─── INVENTORY ───
  inventory: {
    list: () => fetchApi<any[]>('/inventory'),
    updateStock: (variantId: string, stock: number) =>
      fetchApi<any>(`/inventory/${variantId}`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
  },

  // ─── COUPONS ───
  coupons: {
    list: () => fetchApi<any[]>('/coupons'),
    create: (data: any) => fetchApi<any>('/coupons', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/coupons/${id}`, { method: 'DELETE' }),
    validate: (code: string, subtotal: number) =>
      fetchApi<any>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  },

  // ─── ADDRESSES ───
  addresses: {
    list: () => fetchApi<any[]>('/addresses'),
    create: (data: any) => fetchApi<any>('/addresses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/addresses/${id}`, { method: 'DELETE' }),
  },

  // ─── ADMIN ───
  admin: {
    dashboard: () => fetchApi<any>('/admin/dashboard'),
    orders: (status?: string) => fetchApi<any[]>(`/admin/orders${status ? '?status=' + status : ''}`),
    customers: () => fetchApi<any[]>('/admin/customers'),
  },
};
