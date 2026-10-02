import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';

// Helper to securely get and verify the requester's identity from the database
async function getRequester(request: Request, bodyRequesterId?: string) {
  const requesterId = bodyRequesterId || request.headers.get('x-admin-id');
  if (!requesterId) return null;
  return await db.user.findUnique({
    where: { id: requesterId },
  });
}

// 1. GET: List all administrators
export async function GET() {
  try {
    const admins = await db.user.findMany({
      where: {
        role: { in: ['OWNER', 'ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER', 'FULFILLMENT_STAFF'] },
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

// 2. POST: Create a new administrator (OWNER ONLY)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, phone, password, requesterId } = body;

    // Validate that requester is the Store Owner
    const requester = await getRequester(request, requesterId);
    if (!requester || requester.role !== 'OWNER') {
      return NextResponse.json(
        {
          success: false,
          error: 'Access Denied: Only the Store Owner has permission to add new staff or administrators.',
        },
        { status: 403 }
      );
    }

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

    // Role cannot be duplicate OWNER
    const assignedRole = role === 'OWNER' ? 'SUPER_ADMIN' : (role || 'OPS_MANAGER');
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

// 3. PATCH: Change Password or Update Permissions / Role
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      action,
      newPassword,
      currentPassword,
      name,
      role,
      phone,
      requesterId,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Target admin userId is required' },
        { status: 400 }
      );
    }

    const requester = await getRequester(request, requesterId);
    if (!requester) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Requester identity missing or invalid' },
        { status: 401 }
      );
    }

    const targetAdmin = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, error: 'Target administrator account not found' },
        { status: 404 }
      );
    }

    // ==========================================
    // ACTION A: CHANGE PASSWORD / PIN
    // ==========================================
    if (action === 'CHANGE_PASSWORD' || newPassword) {
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json(
          { success: false, error: 'New password/PIN must be at least 4 characters' },
          { status: 400 }
        );
      }

      // Check permission: An admin cannot change another admin's password!
      const isSelf = requester.id === targetAdmin.id;
      const isOwner = requester.role === 'OWNER';

      if (!isSelf && !isOwner) {
        return NextResponse.json(
          {
            success: false,
            error: "Access Denied: Administrators cannot change another administrator's password. Only the Store Owner has this authority.",
          },
          { status: 403 }
        );
      }

      // If user is changing their own password, verify current password
      if (isSelf && currentPassword) {
        if (!verifyPassword(currentPassword, targetAdmin.passwordHash)) {
          return NextResponse.json(
            { success: false, error: 'Current password does not match' },
            { status: 403 }
          );
        }
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
        message: isSelf
          ? 'Your password was successfully updated'
          : `Password reset successfully for ${targetAdmin.name}`,
        data: updated,
      });
    }

    // ==========================================
    // ACTION B: UPDATE ROLE / PERMISSIONS (OWNER ONLY)
    // ==========================================
    if (role && role !== targetAdmin.role) {
      if (requester.role !== 'OWNER') {
        return NextResponse.json(
          {
            success: false,
            error: "Access Denied: Administrators cannot change another administrator's permissions or role. Only the Store Owner can assign roles.",
          },
          { status: 403 }
        );
      }

      if (targetAdmin.role === 'OWNER' && role !== 'OWNER') {
        return NextResponse.json(
          { success: false, error: 'The Store Owner role cannot be demoted or changed.' },
          { status: 400 }
        );
      }
    }

    // Update profile info
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (role && requester.role === 'OWNER') updateData.role = role;
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

// 4. DELETE: Revoke Admin Access (OWNER ONLY)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const requesterId = searchParams.get('requesterId') || request.headers.get('x-admin-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Admin userId parameter is required' },
        { status: 400 }
      );
    }

    // Verify requester is OWNER
    const requester = await getRequester(request, requesterId || undefined);
    if (!requester || requester.role !== 'OWNER') {
      return NextResponse.json(
        {
          success: false,
          error: 'Access Denied: Only the Store Owner can revoke staff access or delete administrators.',
        },
        { status: 403 }
      );
    }

    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Admin account not found' },
        { status: 404 }
      );
    }

    if (targetUser.role === 'OWNER') {
      return NextResponse.json(
        { success: false, error: 'The Store Owner account cannot be deleted or revoked.' },
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
