import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order, OrderStatus, OrderTimelineEvent } from '@/types';
import { INITIAL_ORDERS } from '@/data/mockData';

interface OrderState {
  orders: Order[];
  isHydrated: boolean;
  setHydrated: (val: boolean) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderCourier: (orderId: string, carrier: string, trackingNumber: string) => void;
  cancelOrder: (orderId: string) => boolean;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  resetOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),

      createOrder: (orderData) => {
        const timestamp = new Date().toISOString();
        const rand = Math.floor(10000 + Math.random() * 90000);
        const orderNumber = `DR-${rand}`;
        const trackingNum = `DRX-${Math.floor(1000000 + Math.random() * 9000000)}`;

        const initialTimeline: OrderTimelineEvent[] = [
          {
            step: 1,
            title: 'Order Logged',
            location: 'Dispatch System',
            timestamp: 'Just now',
            completed: true,
          },
          {
            step: 2,
            title: 'Packing Garments',
            location: 'NYC Studio',
            timestamp: 'Pending queue',
            completed: false,
          },
          {
            step: 3,
            title: 'In Transit',
            location: 'Regional Hub',
            timestamp: 'Estimated 24h',
            completed: false,
          },
          {
            step: 4,
            title: 'Out For Delivery',
            location: 'Destination Address',
            timestamp: 'Estimated 2-3 business days',
            completed: false,
          },
        ];

        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber,
          carrier: orderData.carrier || 'DHL Express Tracked',
          trackingNumber: trackingNum,
          estimatedDelivery: '3–5 Business Days',
          createdAt: timestamp,
          timeline: initialTimeline,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId && o.orderNumber !== orderId) return o;

            const updatedTimeline = [...o.timeline];
            if (status === 'CONFIRMED' || status === 'PROCESSING') {
              if (updatedTimeline[0]) updatedTimeline[0].completed = true;
              if (updatedTimeline[1]) {
                updatedTimeline[1].completed = true;
                updatedTimeline[1].timestamp = 'Verified';
              }
            } else if (status === 'SHIPPED') {
              if (updatedTimeline[0]) updatedTimeline[0].completed = true;
              if (updatedTimeline[1]) updatedTimeline[1].completed = true;
              if (updatedTimeline[2]) {
                updatedTimeline[2].completed = true;
                updatedTimeline[2].timestamp = 'Scanned at departure hub';
              }
            } else if (status === 'OUT_FOR_DELIVERY') {
              if (updatedTimeline[0]) updatedTimeline[0].completed = true;
              if (updatedTimeline[1]) updatedTimeline[1].completed = true;
              if (updatedTimeline[2]) updatedTimeline[2].completed = true;
              if (updatedTimeline[3]) {
                updatedTimeline[3].title = 'With Courier Today';
                updatedTimeline[3].timestamp = 'On vehicle';
              }
            } else if (status === 'DELIVERED') {
              updatedTimeline.forEach((t) => (t.completed = true));
              if (updatedTimeline[3]) {
                updatedTimeline[3].title = 'Delivered & Signed';
                updatedTimeline[3].timestamp = 'Completed';
              }
            } else if (status === 'CANCELLED') {
              updatedTimeline.push({
                step: 5,
                title: 'Order Cancelled & Restocked',
                location: 'NYC Studio',
                timestamp: 'Cancelled by customer/ops',
                completed: true,
              });
            }

            return {
              ...o,
              status,
              timeline: updatedTimeline,
            };
          }),
        }));
      },

      updateOrderCourier: (orderId, carrier, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId || o.orderNumber === orderId
              ? { ...o, carrier, trackingNumber }
              : o
          ),
        }));
      },

      cancelOrder: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!order) return false;
        if (order.status === 'DELIVERED' || order.status === 'CANCELLED') return false;

        get().updateOrderStatus(order.id, 'CANCELLED');
        return true;
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      },

      getOrderByNumber: (orderNumber) => {
        return get().orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
      },

      resetOrders: () => {
        set({ orders: INITIAL_ORDERS });
      },
    }),
    {
      name: 'dusk_riot_orders_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
