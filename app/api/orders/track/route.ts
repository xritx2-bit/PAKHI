import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber || !orderNumber.trim()) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    const cleanNumber = orderNumber.trim().toUpperCase();

    // 1. Look up order in SQLite database
    const order = await db.order.findFirst({
      where: {
        orderNumber: {
          equals: cleanNumber,
        },
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        payments: true,
        user: true,
      },
    });

    if (!order) {
      // Mock fallback for demo order PK-842913
      if (cleanNumber === 'PK-842913' || cleanNumber === 'PK842913') {
        return NextResponse.json({
          success: true,
          data: {
            id: 'ord-mock-default',
            orderNumber: 'PK-842913',
            createdAt: '2026-10-02T08:00:00.000Z',
            orderStatus: 'SHIPPED',
            paymentMethod: 'UPI',
            paymentStatus: 'PAID',
            subtotal: 2698,
            discount: 200,
            shippingFee: 0,
            total: 2498,
            courierPartner: 'Blue Dart Express Air',
            trackingAwb: 'BD-IND-94810294',
            estimatedDelivery: 'Oct 05, 2026 (3–4 Business Days)',
            shippingAddress: {
              name: 'Priya Sharma',
              phone: '+91 98765 43210',
              address: '123, Green Park, Hauz Khas Enclave',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110016',
            },
            items: [
              {
                id: 'item-1',
                productNameSnapshot: 'Royal Blue Banarasi Silk Saree',
                variantSnapshot: 'Royal Blue / Free Size',
                priceSnapshot: 1999,
                quantity: 1,
              },
              {
                id: 'item-2',
                productNameSnapshot: 'Cotton Printed Kurta',
                variantSnapshot: 'Slate Blue / M',
                priceSnapshot: 699,
                quantity: 1,
              },
            ],
            statusHistory: [
              { newStatus: 'CONFIRMED', createdAt: '2026-10-02T08:00:00.000Z', changedBy: 'System' },
              { newStatus: 'PROCESSING', createdAt: '2026-10-02T09:30:00.000Z', changedBy: 'Atelier Varanasi Hub' },
              { newStatus: 'PACKED', createdAt: '2026-10-02T11:15:00.000Z', changedBy: 'Quality Assurance' },
              { newStatus: 'SHIPPED', createdAt: '2026-10-02T12:00:00.000Z', changedBy: 'Blue Dart Express' },
            ],
            isReturnEligible: false,
          },
        });
      }

      return NextResponse.json(
        { success: false, error: `Order ${cleanNumber} not found. Please verify the order reference on your confirmation SMS or email.` },
        { status: 404 }
      );
    }

    // Parse shipping address if stored as JSON string
    let parsedAddress = order.addressSnapshot;
    if (typeof parsedAddress === 'string') {
      try {
        parsedAddress = JSON.parse(parsedAddress);
      } catch {
        // fallback
      }
    }

    // Determine estimated delivery date (3 to 5 days after creation)
    const orderDate = new Date(order.createdAt);
    const estDeliveryDate = new Date(orderDate);
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 4);
    const estDateFormatted = estDeliveryDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Generate courier AWB
    const awb = `BD-IND-${order.orderNumber.replace(/[^0-9]/g, '') || '948201'}`;

    // Return eligibility (7 days from delivery date)
    const isDelivered = order.orderStatus === 'DELIVERED';
    let isReturnEligible = false;
    if (isDelivered) {
      const deliveryEvent = order.statusHistory.find((h) => h.newStatus === 'DELIVERED');
      const deliveryTime = deliveryEvent ? new Date(deliveryEvent.createdAt).getTime() : new Date().getTime();
      const diffDays = (new Date().getTime() - deliveryTime) / (1000 * 3600 * 24);
      isReturnEligible = diffDays <= 7;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingFee: order.shippingFee,
        tax: order.tax,
        total: order.total,
        courierPartner: 'Blue Dart Express Air',
        trackingAwb: awb,
        estimatedDelivery: `${estDateFormatted} (Express Air Transit)`,
        shippingAddress: parsedAddress,
        items: order.items,
        statusHistory: order.statusHistory,
        isReturnEligible,
      },
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order tracking information' },
      { status: 500 }
    );
  }
}
