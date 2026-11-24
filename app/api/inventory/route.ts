import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/inventory — List all variants with stock (admin)
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const variants = await prisma.productVariant.findMany({
      include: { product: { select: { id: true, name: true, sku: true, images: true } } },
      orderBy: [{ product: { name: 'asc' } }, { size: 'asc' }],
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
