import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// PATCH /api/inventory/[variantId] — Update stock (admin)
export async function PATCH(request: Request, { params }: { params: { variantId: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { stock } = await request.json();

    const variant = await prisma.productVariant.update({
      where: { id: params.variantId },
      data: { stock: Math.max(0, stock) },
      include: { product: { select: { id: true, name: true } } },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
