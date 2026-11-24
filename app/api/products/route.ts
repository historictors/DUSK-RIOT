import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/products — List products with filtering, sorting, pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const categoryId = searchParams.get('categoryId');
    const collectionId = searchParams.get('collectionId');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (collectionId) where.collectionId = collectionId;
    if (featured === 'true') where.featured = true;
    if (status) where.status = status;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { variants: true, category: true, collection: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products — Create product (admin)
export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        name: body.name,
        sku: body.sku,
        categoryId: body.categoryId,
        collectionId: body.collectionId || null,
        price: body.price,
        originalPrice: body.originalPrice || null,
        description: body.description || '',
        details: body.details || [],
        materials: body.materials || '',
        gsm: body.gsm || null,
        fit: body.fit || '',
        care: body.care || '',
        images: body.images || [],
        featured: body.featured || false,
        isNewArrival: body.isNewArrival || false,
        status: body.status || 'DRAFT',
        tags: body.tags || [],
        variants: {
          create: (body.variants || []).map((v: any) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            stock: v.stock || 0,
            price: v.price,
          })),
        },
      },
      include: { variants: true, category: true, collection: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
