import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/collections/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: { products: { include: { variants: true, category: true } } },
    });
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    return NextResponse.json(collection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

// PUT /api/collections/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        ...(body.slug && { slug: body.slug }),
        ...(body.name && { name: body.name }),
        ...(body.code !== undefined && { code: body.code }),
        ...(body.season !== undefined && { season: body.season }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.bannerImage !== undefined && { bannerImage: body.bannerImage }),
        ...(body.status && { status: body.status }),
      },
    });
    return NextResponse.json(collection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

// DELETE /api/collections/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.collection.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
