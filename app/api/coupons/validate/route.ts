import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local-client';
    const rateLimit = checkRateLimit(`coupon_${ip}`, 20, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { valid: false, error: 'Too many coupon attempts. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Please enter a coupon code' },
        { status: 400 }
      );
    }

    const orderSubtotal = Number(subtotal) || 0;
    const cleanCode = code.trim().toUpperCase();

    const coupon = await db.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: `Coupon code "${cleanCode}" is invalid` },
        { status: 404 }
      );
    }

    // Check expiration if set
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { valid: false, error: `Coupon "${cleanCode}" has expired` },
        { status: 400 }
      );
    }

    // Check minimum order value
    if (orderSubtotal < coupon.minimumOrder) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order value for ${cleanCode} is ₹${coupon.minimumOrder.toLocaleString('en-IN')}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.round((orderSubtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, orderSubtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      message: `Coupon ${coupon.code} applied! Saved ₹${discount.toLocaleString('en-IN')}.`,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error validating coupon' },
      { status: 500 }
    );
  }
}
