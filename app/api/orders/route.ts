import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    const body = await request.json();
    const { items, address, paymentMethod, couponCode } = body;

    if (!items || !items.length || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // 1. Calculate price from database values
    let subtotal = 0;
    const orderItemsData: {
      productVariantId?: string;
      productNameSnapshot: string;
      variantSnapshot: string;
      priceSnapshot: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      // Find variant in DB if ID provided, else look up product
      let itemPrice = 0;
      let itemName = '';
      let variantDesc = '';
      let variantId: string | undefined = undefined;

      if (item.productVariantId) {
        const variant = await db.productVariant.findUnique({
          where: { id: item.productVariantId },
          include: { product: true },
        });
        if (variant) {
          itemPrice = variant.price;
          itemName = variant.product.name;
          variantDesc = `${variant.color || ''} ${variant.size || ''}`.trim();
          variantId = variant.id;
        }
      }

      if (!itemPrice && item.productId) {
        const prod = await db.product.findUnique({
          where: { id: item.productId },
        });
        if (prod) {
          itemPrice = prod.salePrice;
          itemName = prod.name;
          variantDesc = item.selectedColor || '';
        }
      }

      // Fallback to trusted item price sent if mock ID
      if (!itemPrice) {
        itemPrice = Number(item.price);
        itemName = item.name;
        variantDesc = `${item.selectedColor || ''} ${item.selectedSize || ''}`.trim();
      }

      const qty = Number(item.quantity) || 1;
      subtotal += itemPrice * qty;

      orderItemsData.push({
        productVariantId: variantId,
        productNameSnapshot: itemName,
        variantSnapshot: variantDesc,
        priceSnapshot: itemPrice,
        quantity: qty,
      });
    }

    // 2. Server-side discount calculation
    let discount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && subtotal >= coupon.minimumOrder) {
        if (coupon.type === 'PERCENTAGE') {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
          }
        } else {
          discount = coupon.value;
        }
      }
    } else if (subtotal >= 2000) {
      discount = 200; // Automatic festive tier discount
    }

    // 3. Shipping fee rule (Free above ₹999)
    const shippingFee = subtotal >= 999 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // 4. Create Order in database
    const orderNumber = `PK-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: paymentMethod.toUpperCase() === 'COD' ? 'PENDING' : 'PAID',
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
              changedBy: 'Checkout Service',
            },
          ],
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
