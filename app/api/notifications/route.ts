import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    // If no userId supplied, find the primary customer
    if (!userId) {
      const customer = await db.user.findFirst({
        where: { role: 'CUSTOMER' },
      });
      userId = customer?.id || null;
    }

    if (!userId) {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'notif-welcome',
            type: 'PROMO',
            title: "Welcome to Pakhi's Collection",
            message: 'Explore our heirloom Banarasi silk sarees and designer kurtas with free shipping on orders above ₹999.',
            read: false,
            createdAt: new Date().toISOString(),
          },
        ],
        unreadCount: 1,
      });
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAllAsRead, userId } = body;

    if (markAllAsRead && userId) {
      await db.notification.updateMany({
        where: { userId },
        data: { read: true },
      });
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID required' },
        { status: 400 }
      );
    }

    const updated = await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification status' },
      { status: 500 }
    );
  }
}
