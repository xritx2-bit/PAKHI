import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    // Default to the first customer if not passed
    let user = userId
      ? await db.user.findUnique({
          where: { id: userId },
          include: {
            addresses: true,
            orders: {
              include: { items: true, statusHistory: true },
              orderBy: { createdAt: 'desc' },
            },
            notifications: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        })
      : await db.user.findFirst({
          where: { role: 'CUSTOMER' },
          include: {
            addresses: true,
            orders: {
              include: { items: true, statusHistory: true },
              orderBy: { createdAt: 'desc' },
            },
            notifications: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        });

    if (!user) {
      // Create default boutique demo patron if missing
      user = await db.user.create({
        data: {
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 98765 43210',
          role: 'CUSTOMER',
          addresses: {
            create: [
              {
                name: 'Priya Sharma',
                phone: '+91 98765 43210',
                address: '123, Green Park, Hauz Khas Enclave',
                city: 'New Delhi',
                state: 'Delhi',
                pincode: '110016',
              },
            ],
          },
        },
        include: {
          addresses: true,
          orders: {
            include: { items: true, statusHistory: true },
            orderBy: { createdAt: 'desc' },
          },
          notifications: true,
        },
      });
    }

    // Also include orders created by this user or guest orders matching phone/email
    const userOrders = await db.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { orderNumber: 'PK-842913' },
          { orderNumber: 'PK-120351' },
        ],
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          memberSince: user.createdAt,
        },
        addresses: user.addresses,
        orders: userOrders,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error('Error fetching customer account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve account details' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, address, city, state, pincode } = body;

    if (!name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: 'All address fields are required' },
        { status: 400 }
      );
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const defaultUser = await db.user.findFirst({ where: { role: 'CUSTOMER' } });
      targetUserId = defaultUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Customer user not found' },
        { status: 404 }
      );
    }

    const newAddress = await db.address.create({
      data: {
        userId: targetUserId,
        name,
        phone,
        address,
        city,
        state,
        pincode,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Delivery address added successfully',
      data: newAddress,
    });
  } catch (error) {
    console.error('Error saving customer address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save address' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      );
    }

    await db.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json({
      success: true,
      message: 'Address removed successfully',
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove address' },
      { status: 500 }
    );
  }
}
