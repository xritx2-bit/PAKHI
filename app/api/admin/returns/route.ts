import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const returns = await db.return.findMany({
      include: {
        orderItem: {
          include: {
            order: true,
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedReturns = returns.map((ret) => ({
      id: ret.id,
      orderId: ret.orderItem?.orderId || '',
      orderNumber: ret.orderItem?.order?.orderNumber || 'UNKNOWN',
      orderStatus: ret.orderItem?.order?.orderStatus || '',
      orderDate: ret.orderItem?.order?.createdAt || ret.createdAt,
      customer: {
        name: ret.user?.name || 'Valued Customer',
        email: ret.user?.email || 'N/A',
        phone: ret.user?.phone || 'N/A',
      },
      item: {
        name: ret.orderItem?.productNameSnapshot || 'Artisan Garment',
        variant: ret.orderItem?.variantSnapshot || 'Standard',
        price: ret.orderItem?.priceSnapshot || 0,
        quantity: ret.orderItem?.quantity || 1,
        variantId: ret.orderItem?.productVariantId,
      },
      reason: ret.reason,
      status: ret.status,
      refundAmount: ret.refundAmount,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedReturns,
      summary: {
        total: formattedReturns.length,
        requested: formattedReturns.filter((r) => r.status === 'REQUESTED').length,
        approved: formattedReturns.filter((r) => r.status === 'APPROVED').length,
        pickedUp: formattedReturns.filter((r) => r.status === 'PICKED_UP').length,
        refunded: formattedReturns.filter((r) => r.status === 'REFUNDED').length,
        rejected: formattedReturns.filter((r) => r.status === 'REJECTED').length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin returns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve returns list' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { returnId, newStatus, restockItem = true, auditNote, requesterId } = body;

    if (!returnId || !newStatus) {
      return NextResponse.json(
        { success: false, error: 'Return ID and newStatus are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['REQUESTED', 'APPROVED', 'PICKED_UP', 'REFUNDED', 'REJECTED'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify requester admin
    let adminName = 'Operations Staff';
    if (requesterId) {
      const requester = await db.user.findUnique({ where: { id: requesterId } });
      if (requester) {
        adminName = `${requester.name} (${requester.role})`;
      }
    }

    const existingReturn = await db.return.findUnique({
      where: { id: returnId },
      include: {
        orderItem: {
          include: {
            order: true,
            variant: true,
          },
        },
        user: true,
      },
    });

    if (!existingReturn) {
      return NextResponse.json(
        { success: false, error: 'Return request not found' },
        { status: 404 }
      );
    }

    const orderId = existingReturn.orderItem.orderId;
    const orderNumber = existingReturn.orderItem.order.orderNumber;
    const variantId = existingReturn.orderItem.productVariantId;
    const qty = existingReturn.orderItem.quantity;

    // Transaction to update return, order, history, stock, and notification
    const updated = await db.$transaction(async (tx) => {
      // 1. Update Return status
      const ret = await tx.return.update({
        where: { id: returnId },
        data: {
          status: newStatus,
        },
      });

      // 2. Map Return status to Order status
      let mappedOrderStatus: string | null = null;
      if (newStatus === 'APPROVED') mappedOrderStatus = 'RETURN_APPROVED';
      else if (newStatus === 'PICKED_UP') mappedOrderStatus = 'RETURN_PICKED_UP';
      else if (newStatus === 'REFUNDED') mappedOrderStatus = 'REFUNDED';
      else if (newStatus === 'REJECTED') mappedOrderStatus = 'DELIVERED'; // revert to delivered if rejected

      if (mappedOrderStatus) {
        await tx.order.update({
          where: { id: orderId },
          data: {
            orderStatus: mappedOrderStatus,
            ...(newStatus === 'REFUNDED' ? { paymentStatus: 'REFUNDED' } : {}),
          },
        });

        // 3. Status History
        await tx.orderStatusHistory.create({
          data: {
            orderId,
            oldStatus: existingReturn.status,
            newStatus: mappedOrderStatus,
            changedBy: `${adminName}${auditNote ? ` - Note: ${auditNote}` : ''}`,
          },
        });
      }

      // 4. If REFUNDED and restock requested, increment inventory stock
      if (newStatus === 'REFUNDED' && restockItem && variantId) {
        await tx.productVariant.update({
          where: { id: variantId },
          data: {
            stock: {
              increment: qty,
            },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            variantId,
            type: 'RETURN_RESTOCK',
            quantity: qty,
          },
        });
      }

      // 5. Send customer notification
      if (existingReturn.userId) {
        let notifTitle = `Return Update: Order #${orderNumber}`;
        let notifMessage = `Your return request has been updated to ${newStatus}.`;

        if (newStatus === 'APPROVED') {
          notifTitle = `Return Approved: Order #${orderNumber}`;
          notifMessage = `Our logistics partner (Blue Dart Express) has been scheduled for doorstep inspection and reverse pickup within 48 hours.`;
        } else if (newStatus === 'PICKED_UP') {
          notifTitle = `Return Picked Up: Order #${orderNumber}`;
          notifMessage = `The item has been received by our courier partner and is on its way to the Varanasi atelier for verification.`;
        } else if (newStatus === 'REFUNDED') {
          notifTitle = `Refund Processed: ₹${existingReturn.refundAmount.toLocaleString('en-IN')}`;
          notifMessage = `Refund of ₹${existingReturn.refundAmount.toLocaleString('en-IN')} has been initiated to your original payment method. Depending on your bank/UPI, it will reflect in 3–5 business days.`;
        } else if (newStatus === 'REJECTED') {
          notifTitle = `Return Request Status: Order #${orderNumber}`;
          notifMessage = `Your return request could not be approved based on boutique inspection policy. Note: ${auditNote || 'Item not eligible for return.'}`;
        }

        await tx.notification.create({
          data: {
            userId: existingReturn.userId,
            type: 'REFUND',
            title: notifTitle,
            message: notifMessage,
          },
        });
      }

      return ret;
    });

    return NextResponse.json({
      success: true,
      message: `Return request updated to ${newStatus} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating return request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update return request' },
      { status: 500 }
    );
  }
}
