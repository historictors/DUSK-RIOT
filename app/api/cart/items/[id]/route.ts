import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// PUT /api/cart/items/[id] — Update quantity
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { quantity } = await request.json();
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: params.id } });
      return NextResponse.json({ success: true });
    }

    const item = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: { product: true, variant: true },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE /api/cart/items/[id] — Remove item
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.cartItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
