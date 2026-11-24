import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Return sanitized customer data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        memberId: user.memberId,
        tier: user.tier,
        phone: user.phone || '',
        addresses: user.addresses.map((a) => ({
          id: a.id,
          fullName: a.fullName,
          addressLine: a.addressLine,
          city: a.city,
          state: a.state,
          postalCode: a.postalCode,
          country: a.country,
          phone: a.phone,
          isDefault: a.isDefault,
        })),
        role: user.role,
        joinedDate: user.createdAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 500 }
    );
  }
}
