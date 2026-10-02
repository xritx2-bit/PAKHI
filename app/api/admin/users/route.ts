import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';

// 1. GET: List all administrators
export async function GET() {
  try {
    const admins = await db.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER', 'FULFILLMENT_STAFF'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: admins });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve administrator directory' },
      { status: 500 }
    );
  }
}

// 2. POST: Create a new administrator
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and security password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existing = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `An account with email ${cleanEmail} already exists` },
        { status: 409 }
      );
    }

    const assignedRole = role || 'OPS_MANAGER';
    const hashedPassword = hashPassword(password);

    const newAdmin = await db.user.create({
      data: {
        name,
        email: cleanEmail,
        phone: phone || null,
        role: assignedRole,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: newAdmin }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create new administrator' },
      { status: 500 }
    );
  }
}

// 3. PATCH: Change Password or Update Admin Profile
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, newPassword, currentPassword, name, role, phone } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Admin userId is required' },
        { status: 400 }
      );
    }

    const admin = await db.user.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin account not found' },
        { status: 404 }
      );
    }

    // ACTION A: CHANGE PASSWORD / PIN
    if (action === 'CHANGE_PASSWORD' || newPassword) {
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json(
          { success: false, error: 'New password/PIN must be at least 4 characters' },
          { status: 400 }
        );
      }

      // If current password provided, verify it
      if (currentPassword && !verifyPassword(currentPassword, admin.passwordHash)) {
        return NextResponse.json(
          { success: false, error: 'Current password does not match' },
          { status: 403 }
        );
      }

      const updated = await db.user.update({
        where: { id: userId },
        data: {
          passwordHash: hashPassword(newPassword),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Password successfully updated',
        data: updated,
      });
    }

    // ACTION B: UPDATE PROFILE & ROLE
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;

    const updated = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin profile updated',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update administrator' },
      { status: 500 }
    );
  }
}

// 4. DELETE: Revoke Admin Access
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Admin userId parameter is required' },
        { status: 400 }
      );
    }

    // Ensure we don't delete the only superadmin
    const superAdminCount = await db.user.count({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    });

    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Admin account not found' },
        { status: 404 }
      );
    }

    if (
      (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN') &&
      superAdminCount <= 1
    ) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the primary administrator. At least one Super Admin is required.' },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: `Access revoked for ${targetUser.name}`,
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke administrator access' },
      { status: 500 }
    );
  }
}
