import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, orderItemId, reason, pickupAddress } = body;

    if (!orderId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Order ID and return reason are required' },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify 7-day return window
    if (order.orderStatus !== 'DELIVERED') {
      return NextResponse.json(
        { success: false, error: 'Returns can only be requested once an order is delivered.' },
        { status: 400 }
      );
    }

    const deliveryEvent = order.statusHistory.find((h) => h.newStatus === 'DELIVERED');
    const deliveryTime = deliveryEvent ? new Date(deliveryEvent.createdAt).getTime() : new Date(order.updatedAt).getTime();
    const daysSinceDelivery = (Date.now() - deliveryTime) / (1000 * 3600 * 24);

    if (daysSinceDelivery > 7) {
      return NextResponse.json(
        {
          success: false,
          error: 'The 7-day return and exchange window for this delivery has expired as per boutique policy.',
        },
        { status: 400 }
      );
    }

    // Determine target order item
    const targetItem = orderItemId
      ? order.items.find((i) => i.id === orderItemId)
      : order.items[0];

    const refundAmount = targetItem ? targetItem.priceSnapshot * targetItem.quantity : order.total;

    // Transaction: Create return record, update order status, record history, and notify
    const returnRecord = await db.$transaction(async (tx) => {
      // Ensure valid customer user ID for relational integrity
      let customerUserId = order.userId;
      if (!customerUserId) {
        let guestUser = await tx.user.findFirst({ where: { email: 'guest@pakhiscollection.com' } });
        if (!guestUser) {
          guestUser = await tx.user.create({
            data: {
              name: 'Guest Customer',
              email: 'guest@pakhiscollection.com',
              role: 'CUSTOMER',
            },
          });
        }
        customerUserId = guestUser.id;
      }

      // 1. Create Return record
      const ret = await tx.return.create({
        data: {
          orderItemId: targetItem?.id || order.items[0]?.id || 'unknown-item',
          userId: customerUserId,
          reason,
          status: 'REQUESTED',
          refundAmount,
        },
      });

      // 2. Update Order status
      await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: 'RETURN_REQUESTED' },
      });

      // 3. Record status history audit
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          oldStatus: order.orderStatus,
          newStatus: 'RETURN_REQUESTED',
          changedBy: 'Customer (Return Desk)',
        },
      });

      // 4. Create Notification if userId exists
      if (order.userId) {
        await tx.notification.create({
          data: {
            userId: order.userId,
            type: 'REFUND',
            title: `Return Request Received: #${order.orderNumber}`,
            message: `Your return request for ₹${refundAmount.toLocaleString('en-IN')} has been logged. Blue Dart reverse pickup will be scheduled shortly.`,
          },
        });
      }

      return ret;
    });

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully. Doorstep pickup will be arranged within 48-72 hours.',
      data: {
        returnId: returnRecord.id,
        status: returnRecord.status,
        refundAmount: returnRecord.refundAmount,
      },
    });
  } catch (error) {
    console.error('Error initiating return request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process return request' },
      { status: 500 }
    );
  }
}
