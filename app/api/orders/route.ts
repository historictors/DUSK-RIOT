import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

// GET /api/orders — Get current user's orders
export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
        timeline: { orderBy: { step: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — Place order
export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    // body: { shippingAddress, shippingMethod, items: [{productId, variantId, quantity}], couponCode? }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Validate items and calculate prices from DB
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of body.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });
      if (!variant) {
        return NextResponse.json({ error: `Variant not found` }, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json({ error: `${variant.product.name} (${variant.size}) is out of stock` }, { status: 400 });
      }
      const lineTotal = variant.price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        productImage: variant.product.images[0] || null,
        variantSku: variant.sku,
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        unitPrice: variant.price,
        totalPrice: lineTotal,
      });
    }

    // 2. Handle coupon
    let discount = 0;
    let shippingFee = subtotal >= 200 ? 0 : 15;

    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.active && new Date(coupon.expiry) > new Date()
        && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minOrder) {
        if (coupon.type === 'PERCENTAGE') discount = (subtotal * coupon.value) / 100;
        else if (coupon.type === 'FIXED') discount = Math.min(coupon.value, subtotal);
        else if (coupon.type === 'FREE_SHIPPING') shippingFee = 0;

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
        await prisma.couponUsage.create({
          data: { couponId: coupon.id, userId: session.user.id },
        });
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);
    const orderNumber = `DR-${Math.floor(10000 + Math.random() * 90000)}`;

    // 3. Create order with items and timeline
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
        shippingAddress: body.shippingAddress || {},
        shippingMethod: body.shippingMethod || 'Express Tracked Courier',
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode: body.couponCode?.trim().toUpperCase() || null,
        status: 'PLACED',
        paymentMethod: 'COD',
        items: { create: orderItems },
        timeline: {
          create: [
            { step: 1, title: 'Order Logged', location: 'Dispatch System', timestamp: new Date().toLocaleString(), completed: true },
            { step: 2, title: 'Packing Garments', location: 'NYC Studio', timestamp: 'Pending', completed: false },
            { step: 3, title: 'In Transit', location: 'Regional Hub', timestamp: 'Estimated 24h', completed: false },
            { step: 4, title: 'Out For Delivery', location: 'Destination', timestamp: 'Estimated 2-3 days', completed: false },
          ],
        },
      },
      include: { items: true, timeline: { orderBy: { step: 'asc' } } },
    });

    // 4. Decrement stock
    for (const item of body.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 5. Clear user's cart
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
