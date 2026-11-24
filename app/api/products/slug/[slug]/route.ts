import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/slug/[slug] — Get product by slug (storefront)
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { variants: true, category: true, collection: true },
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
