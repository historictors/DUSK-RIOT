export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductVariant {
  id: string;
  sku: string;
  size: GarmentSize;
  color: string;
  colorHex: string;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  categorySlug: string;
  collection: string;
  collectionSlug: string;
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  materials: string;
  gsm?: string;
  fit: string;
  care: string;
  images: string[];
  featured: boolean;
  isNewArrival?: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  variants: ProductVariant[];
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  code: string;
  season: string;
  description: string;
  bannerImage: string;
  status: 'LIVE' | 'ARCHIVE' | 'UPCOMING';
  itemCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  size: GarmentSize;
  color: string;
  quantity: number;
  price: number;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  memberId: string;
  tier: string;
  phone: string;
  addresses: CustomerAddress[];
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderTimelineEvent {
  step: number;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: CustomerAddress;
  shippingMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: 'DEMO_SIMULATION';
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
  timeline: OrderTimelineEvent[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minOrder: number;
  expiry: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  description: string;
}
