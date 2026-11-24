import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// PUT /api/addresses/[id] — Update address
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        ...(body.fullName && { fullName: body.fullName }),
        ...(body.addressLine && { addressLine: body.addressLine }),
        ...(body.city && { city: body.city }),
        ...(body.state && { state: body.state }),
        ...(body.postalCode && { postalCode: body.postalCode }),
        ...(body.country && { country: body.country }),
        ...(body.phone && { phone: body.phone }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE /api/addresses/[id] — Delete address
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.address.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
