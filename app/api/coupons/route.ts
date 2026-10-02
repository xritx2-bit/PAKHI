import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { code: 'asc' },
    });

    const formatted = coupons.map((c) => ({
      ...c,
      isActive: !c.expiresAt || new Date(c.expiresAt) > new Date(),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      type,
      value,
      minimumOrder,
      maximumDiscount,
      usageLimit,
      expiresAt,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Code, type, and value are required' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if code already exists
    const existing = await db.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Coupon ${cleanCode} already exists` },
        { status: 409 }
      );
    }

    const newCoupon = await db.coupon.create({
      data: {
        code: cleanCode,
        type: type === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
        value: Number(value),
        minimumOrder: minimumOrder ? Number(minimumOrder) : 0,
        maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create promo coupon' },
      { status: 500 }
    );
  }
}
