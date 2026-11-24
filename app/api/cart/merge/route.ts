import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// POST /api/cart/merge — Merge guest cart (localStorage) into DB cart after login
export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items } = await request.json();
    if (!items || !Array.isArray(items)) return NextResponse.json({ error: 'Invalid items' }, { status: 400 });

    // Ensure cart exists
    let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.user.id } });
    }

    // Merge each item
    for (const item of items) {
      const existing = await prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId: item.variantId } },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + (item.quantity || 1) },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity || 1,
          },
        });
      }
    }

    // Return updated cart
    const updated = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: { include: { variants: true } }, variant: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to merge cart' }, { status: 500 });
  }
}
