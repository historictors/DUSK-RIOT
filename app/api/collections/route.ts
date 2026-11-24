import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/collections — List all collections with product count
export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(collections);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

// POST /api/collections — Create collection (admin)
export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const collection = await prisma.collection.create({
      data: {
        slug: body.slug,
        name: body.name,
        code: body.code || '',
        season: body.season || '',
        description: body.description || '',
        bannerImage: body.bannerImage || '',
        status: body.status || 'LIVE',
      },
    });
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
