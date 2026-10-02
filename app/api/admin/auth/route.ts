import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, generateAdminToken } from '@/lib/auth';
import { checkRateLimit, sanitizeInput } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'admin-auth-ip';
    const rateLimit = checkRateLimit(`admin-login:${ip}`, 6, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many administrative login attempts. Please wait 60 seconds.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();

    // Look up admin in database
    let admin = await db.user.findFirst({
      where: {
        email: cleanEmail,
        role: { in: ['OWNER', 'ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER', 'FULFILLMENT_STAFF'] },
      },
    });

    // If initial seed admin doesn't exist yet, auto-create it with secure PBKDF2 hash
    if (!admin && cleanEmail === 'admin@pakhiscollection.com') {
      admin = await db.user.create({
        data: {
          name: 'Pakhi Administration',
          email: 'admin@pakhiscollection.com',
          phone: '+91 99999 88888',
          role: 'SUPER_ADMIN',
          passwordHash: hashPassword('admin123'),
        },
      });
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'No administrative staff account found with this email' },
        { status: 401 }
      );
    }

    // Verify password against stored PBKDF2 / SHA-256 hash or setup PIN
    const isValid = verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect administrative security credential or PIN' },
        { status: 401 }
      );
    }

    // Transparently upgrade legacy sha256 hashes to modern PBKDF2
    if (!admin.passwordHash || !admin.passwordHash.startsWith('pbkdf2$')) {
      try {
        await db.user.update({
          where: { id: admin.id },
          data: { passwordHash: hashPassword(password) },
        });
      } catch (err) {
        console.warn('Silent hash upgrade deferred:', err);
      }
    }

    // Generate signed cryptographic admin session token
    const token = generateAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return NextResponse.json({
      success: true,
      token,
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
