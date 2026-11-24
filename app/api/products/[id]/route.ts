import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/products/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: true, category: true, collection: true },
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT /api/products/[id] — Update product (admin)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();

    // If variants are provided, delete existing and recreate
    if (body.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(body.slug && { slug: body.slug }),
        ...(body.name && { name: body.name }),
        ...(body.sku && { sku: body.sku }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.collectionId !== undefined && { collectionId: body.collectionId || null }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.details && { details: body.details }),
        ...(body.materials !== undefined && { materials: body.materials }),
        ...(body.gsm !== undefined && { gsm: body.gsm }),
        ...(body.fit !== undefined && { fit: body.fit }),
        ...(body.care !== undefined && { care: body.care }),
        ...(body.images && { images: body.images }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.isNewArrival !== undefined && { isNewArrival: body.isNewArrival }),
        ...(body.status && { status: body.status }),
        ...(body.tags && { tags: body.tags }),
        ...(body.variants && {
          variants: {
            create: body.variants.map((v: any) => ({
              sku: v.sku,
              size: v.size,
              color: v.color,
              colorHex: v.colorHex,
              stock: v.stock || 0,
              price: v.price,
            })),
          },
        }),
      },
      include: { variants: true, category: true, collection: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Delete product (admin)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
