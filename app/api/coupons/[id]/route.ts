import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// PUT /api/coupons/[id] — Update coupon (admin)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        ...(body.code && { code: body.code.trim().toUpperCase() }),
        ...(body.type && { type: body.type }),
        ...(body.value !== undefined && { value: body.value }),
        ...(body.minOrder !== undefined && { minOrder: body.minOrder }),
        ...(body.expiry && { expiry: new Date(body.expiry) }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

// DELETE /api/coupons/[id] — Delete coupon (admin)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
