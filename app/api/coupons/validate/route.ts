import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// POST /api/coupons/validate — Validate coupon code
export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, subtotal } = await request.json();
    const cleaned = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({ where: { code: cleaned } });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code.' });
    }
    if (!coupon.active) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active.' });
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, error: 'Coupon usage limit reached.' });
    }
    if (new Date(coupon.expiry) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired.' });
    }
    if (subtotal < coupon.minOrder) {
      return NextResponse.json({ valid: false, error: `Minimum order of $${coupon.minOrder} required.` });
    }

    return NextResponse.json({ valid: true, coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
