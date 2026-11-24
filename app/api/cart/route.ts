import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// GET /api/cart — Get current user's cart
export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: { include: { variants: true } },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// DELETE /api/cart — Clear cart
export async function DELETE() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
