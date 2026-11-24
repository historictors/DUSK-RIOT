import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// GET /api/wishlist — Get user's wishlist
export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { variants: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST /api/wishlist — Add to wishlist (toggle)
export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await request.json();

    // Toggle: if exists remove, if not add
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ added: false, productId });
    }

    await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });

    return NextResponse.json({ added: true, productId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
