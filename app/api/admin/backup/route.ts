import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { authenticateAdminRequest, checkRateLimit } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'admin-backup-ip';
    const rateLimit = checkRateLimit(`admin-backup:${ip}`, 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Authenticate requester
    const auth = await authenticateAdminRequest(request);
    let requester = auth.user;

    if (!requester) {
      const body = await request.json().catch(() => ({}));
      const requesterId = body.requesterId || request.headers.get('x-admin-id');
      if (requesterId) {
        requester = await db.user.findUnique({
          where: { id: requesterId },
          select: { id: true, name: true, email: true, role: true },
        });
      }
    }

    if (!requester || !['OWNER', 'ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER'].includes(requester.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Executive admin privileges required to snapshot database' },
        { status: 403 }
      );
    }

    const sourceDbPath = path.resolve(process.cwd(), 'prisma/dev.db');
    if (!fs.existsSync(sourceDbPath)) {
      return NextResponse.json(
        { success: false, error: 'Database file not found on disk' },
        { status: 500 }
      );
    }

    const backupsDir = path.resolve(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const backupFileName = `pakhis-db-backup-${timestamp}.db`;
    const targetBackupPath = path.join(backupsDir, backupFileName);

    // Verify integrity
    const integrityResult = await db.$queryRawUnsafe<{ integrity_check: string }[]>('PRAGMA integrity_check;');
    const integrityStatus = integrityResult[0]?.integrity_check || 'ok';

    // Copy file
    fs.copyFileSync(sourceDbPath, targetBackupPath);
    const stats = fs.statSync(targetBackupPath);

    return NextResponse.json({
      success: true,
      message: `Database backup created successfully (${(stats.size / 1024).toFixed(1)} KB)`,
      data: {
        fileName: backupFileName,
        sizeBytes: stats.size,
        sizeKb: Math.round(stats.size / 1024),
        integrityStatus,
        createdAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating database backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create database snapshot' },
      { status: 500 }
    );
  }
}
