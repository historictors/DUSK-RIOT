import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// POST /api/orders/[id]/cancel — Cancel order
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const order = await prisma.order.findFirst({
      where: { OR: [{ id: params.id }, { orderNumber: params.id }] },
      include: { items: true },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Cannot cancel this order' }, { status: 400 });
    }

    // Update status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });

    // Restore stock
    for (const item of order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    // Add cancellation timeline entry
    const count = await prisma.orderTimeline.count({ where: { orderId: order.id } });
    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        step: count + 1,
        title: 'Order Cancelled & Restocked',
        location: 'System',
        timestamp: new Date().toLocaleString(),
        completed: true,
      },
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
