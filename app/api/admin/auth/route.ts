import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Look up admin in database
    let admin = await db.user.findFirst({
      where: {
        email: cleanEmail,
        role: { in: ['ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER', 'FULFILLMENT_STAFF'] },
      },
    });

    // If initial seed admin doesn't exist yet, auto-create it
    if (!admin && cleanEmail === 'admin@pakhiscollection.com') {
      admin = await db.user.create({
        data: {
          name: 'Pakhi Administration',
          email: 'admin@pakhiscollection.com',
          phone: '+91 99999 88888',
          role: 'SUPER_ADMIN',
        },
      });
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'No administrative staff account found with this email' },
        { status: 401 }
      );
    }

    // Verify password against stored hash or default PINs
    const isValid = verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect administrative security credential or PIN' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
      },
    });
  } catch (error) {
    console.error('Error during admin authentication:', error);
    return NextResponse.json(
      { success: false, error: 'Administrative authentication service error' },
      { status: 500 }
    );
  }
}
