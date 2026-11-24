import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/admin/dashboard — Dashboard stats
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [totalProducts, totalCustomers, totalOrders, orders, lowStock, recentOrders] =
      await Promise.all([
        prisma.product.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.order.count(),
        prisma.order.findMany({
          where: { status: { in: ['DELIVERED', 'SHIPPED', 'OUT_FOR_DELIVERY'] } },
          select: { total: true },
        }),
        prisma.productVariant.findMany({
          where: { stock: { lt: 5 } },
          include: { product: { select: { name: true } } },
          take: 10,
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } }, items: true },
        }),
      ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      lowStockVariants: lowStock,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
