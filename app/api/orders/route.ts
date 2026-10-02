import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, sanitizeObject, sanitizeInput } from '@/lib/security';

export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: {
        items: true,
        payments: true,
        statusHistory: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local-client';
    const rateLimit = checkRateLimit(`order_${ip}`, 15, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many order requests. Please try again shortly.' },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const body = sanitizeObject(rawBody);
    const { items, address, paymentMethod, couponCode, paymentDetails } = body;

    if (!items || !items.length || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required order details' },
        { status: 400 }
      );
    }

    const method = (paymentMethod || 'UPI').toUpperCase();

    // 1. Calculate price and validate stock from database values
    let subtotal = 0;
    const orderItemsData: {
      productVariantId?: string;
      productNameSnapshot: string;
      variantSnapshot: string;
      priceSnapshot: number;
      quantity: number;
    }[] = [];

    const stockDeductions: { variantId: string; quantity: number }[] = [];

    for (const item of items) {
      let itemPrice = 0;
      let itemName = '';
      let variantDesc = '';
      let variantId: string | undefined = undefined;
      const qty = Number(item.quantity) || 1;

      // Try looking up variant by ID if provided
      if (item.productVariantId) {
        const variant = await db.productVariant.findUnique({
          where: { id: item.productVariantId },
          include: { product: true },
        });
        if (variant) {
          if (variant.stock < qty) {
            return NextResponse.json(
              {
                success: false,
                error: `Insufficient stock for ${variant.product.name} (${variant.size || variant.color || 'Standard'}). Only ${variant.stock} left.`,
              },
              { status: 400 }
            );
          }
          itemPrice = variant.price;
          itemName = variant.product.name;
          variantDesc = `${variant.color || ''} ${variant.size || ''}`.trim();
          variantId = variant.id;
          stockDeductions.push({ variantId: variant.id, quantity: qty });
        }
      }

      // If no variant found yet, check product by slug or ID
      if (!itemPrice) {
        const prod = await db.product.findFirst({
          where: {
            OR: [
              { id: item.productId || '' },
              { slug: item.slug || '' },
            ],
          },
          include: { variants: true },
        });

        if (prod) {
          itemPrice = prod.salePrice;
          itemName = prod.name;
          variantDesc = `${item.selectedColor || ''} ${item.selectedSize || ''}`.trim();

          // Match variant if size/color provided
          const matchedVariant = prod.variants.find(
            (v) =>
              (!item.selectedSize || v.size === item.selectedSize) &&
              (!item.selectedColor || v.color === item.selectedColor)
          );

          if (matchedVariant) {
            variantId = matchedVariant.id;
            if (matchedVariant.stock >= qty) {
              stockDeductions.push({ variantId: matchedVariant.id, quantity: qty });
            }
          }
        }
      }

      // Safe fallback to client-sent price if demo item not in seed DB
      if (!itemPrice) {
        itemPrice = Number(item.price) || 999;
        itemName = item.name || 'Ethnic Wear Piece';
        variantDesc = `${item.selectedColor || ''} ${item.selectedSize || ''}`.trim();
      }

      subtotal += itemPrice * qty;

      orderItemsData.push({
        productVariantId: variantId,
        productNameSnapshot: itemName,
        variantSnapshot: variantDesc,
        priceSnapshot: itemPrice,
        quantity: qty,
      });
    }

    // 2. Server-side coupon verification
    let discount = 0;
    let validatedCouponId: string | null = null;

    if (couponCode) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      const coupon = await db.coupon.findUnique({
        where: { code: cleanCoupon },
      });

      if (coupon && subtotal >= coupon.minimumOrder) {
        if (!coupon.expiresAt || new Date() <= coupon.expiresAt) {
          if (coupon.type === 'PERCENTAGE') {
            discount = Math.round((subtotal * coupon.value) / 100);
            if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
              discount = coupon.maximumDiscount;
            }
          } else {
            discount = coupon.value;
          }
          validatedCouponId = coupon.id;
        }
      }
    } else if (subtotal >= 2000) {
      // Automatic festive threshold privilege
      discount = 200;
    }

    discount = Math.min(discount, subtotal);

    // 3. Shipping fee calculation (Free above ₹999 as stated in banner)
    const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // 4. COD Rule Enforcement (Section 10 of Blueprint: Maximum COD order value is ₹5,000)
    if (method === 'COD' && total > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orders above ₹5,000 are not eligible for Cash on Delivery for insurance reasons. Please choose UPI or Card payment.',
        },
        { status: 400 }
      );
    }

    // 5. Generate unique Order Number
    const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentStatus = method === 'COD' ? 'PENDING' : 'PAID';
    const isPaidOnline = method !== 'COD';

    // 6. Run atomic Prisma transaction
    const createdOrder = await db.$transaction(async (tx) => {
      // A. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          subtotal,
          discount,
          shippingFee,
          total,
          paymentMethod: method,
          paymentStatus,
          orderStatus: 'CONFIRMED',
          addressSnapshot: JSON.stringify(address),
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: [
              {
                oldStatus: 'PENDING',
                newStatus: 'CONFIRMED',
                changedBy: 'Checkout Service (Automated)',
              },
            ],
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      // B. Create Payment Record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          gateway: method === 'COD' ? 'MANUAL_COD' : 'RAZORPAY_SIMULATED',
          gatewayOrderId: `pay_order_${Date.now()}`,
          gatewayPaymentId: isPaidOnline
            ? paymentDetails?.transactionId || `pay_${Math.random().toString(36).substring(2, 10)}`
            : null,
          amount: total,
          currency: 'INR',
          status: isPaidOnline ? 'SUCCESS' : 'PENDING',
          method,
        },
      });

      // C. Deduct Stock & Record Inventory Transactions
      for (const deduction of stockDeductions) {
        await tx.productVariant.update({
          where: { id: deduction.variantId },
          data: { stock: { decrement: deduction.quantity } },
        });

        await tx.inventoryTransaction.create({
          data: {
            variantId: deduction.variantId,
            type: 'SALE_DEDUCTION',
            quantity: -deduction.quantity,
            reference: orderNumber,
          },
        });
      }

      // D. Increment coupon usage count if used
      if (validatedCouponId) {
        await tx.coupon.update({
          where: { id: validatedCouponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...createdOrder,
          estimatedDelivery: '3 - 5 Business Days',
          courierPartner: 'Blue Dart Express',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order securely' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, orderStatus } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or orderStatus' },
        { status: 400 }
      );
    }

    const currentOrder = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
        statusHistory: {
          create: {
            oldStatus: currentOrder.orderStatus,
            newStatus: orderStatus,
            changedBy: 'Admin (Operations)',
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

