import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/admin/customers — List all customers (admin)
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        memberId: true,
        tier: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { total: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to include totalOrders and totalSpent
    const result = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      memberId: c.memberId,
      tier: c.tier,
      phone: c.phone,
      joinedDate: c.createdAt.toISOString().split('T')[0],
      totalOrders: c._count.orders,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
