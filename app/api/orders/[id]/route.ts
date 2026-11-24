import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin } from '@/lib/auth-guard';

// GET /api/orders/[id] — Get order details
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
      include: {
        items: true,
        timeline: { orderBy: { step: 'asc' } },
        user: { select: { id: true, name: true, email: true, memberId: true } },
      },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Check ownership (customer can only see own orders, admin can see all)
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — Update order status (admin)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { status, carrier, trackingNumber } = await request.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (carrier) updateData.carrier = carrier;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    // Add timeline entry for status change
    if (status) {
      const timelineMap: Record<string, { title: string; location: string }> = {
        CONFIRMED: { title: 'Order Confirmed', location: 'Verification System' },
        PROCESSING: { title: 'Garments Packed & Sealed', location: 'NYC Studio' },
        SHIPPED: { title: 'In Transit', location: 'Regional Hub' },
        OUT_FOR_DELIVERY: { title: 'With Courier Today', location: 'Local Courier' },
        DELIVERED: { title: 'Delivered & Signed', location: 'Destination' },
        CANCELLED: { title: 'Order Cancelled', location: 'System' },
      };

      const entry = timelineMap[status];
      if (entry) {
        const count = await prisma.orderTimeline.count({ where: { orderId: params.id } });
        await prisma.orderTimeline.create({
          data: {
            orderId: params.id,
            step: count + 1,
            title: entry.title,
            location: entry.location,
            timestamp: new Date().toLocaleString(),
            completed: true,
          },
        });

        // Mark all previous steps as completed
        await prisma.orderTimeline.updateMany({
          where: { orderId: params.id },
          data: { completed: true },
        });
      }
    }

    const updated = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, timeline: { orderBy: { step: 'asc' } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
