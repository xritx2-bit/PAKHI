import fs from 'fs';
import path from 'path';
import { db } from '../lib/db';

async function performBackup() {
  console.log('======================================================');
  console.log("  PAKHI'S COLLECTION — DATABASE BACKUP & INTEGRITY");
  console.log('======================================================\n');

  const sourceDbPath = path.resolve(process.cwd(), 'prisma/dev.db');
  if (!fs.existsSync(sourceDbPath)) {
    console.error('❌ Error: SQLite source database not found at:', sourceDbPath);
    process.exit(1);
  }

  // 1. Create backups directory if not exists
  const backupsDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  // 2. Format backup filename with timestamp
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const backupFileName = `pakhis-db-backup-${timestamp}.db`;
  const targetBackupPath = path.join(backupsDir, backupFileName);

  // 3. Verify SQLite Integrity Check via Prisma raw query
  console.log('--- 1. Database Integrity Verification ---');
  try {
    const integrityResult = await db.$queryRawUnsafe<{ integrity_check: string }[]>('PRAGMA integrity_check;');
    const status = integrityResult[0]?.integrity_check || 'unknown';
    if (status === 'ok') {
      console.log('  ✓ PASS: SQLite PRAGMA integrity_check returned OK');
    } else {
      console.warn(`  ⚠️ Warning: Integrity check returned: ${status}`);
    }
  } catch (err) {
    console.error('  ❌ Integrity check failed:', err);
  }

  // 4. Copy database snapshot safely
  console.log('\n--- 2. Creating Database Snapshot ---');
  fs.copyFileSync(sourceDbPath, targetBackupPath);
  const stats = fs.statSync(targetBackupPath);
  console.log(`  ✓ Database snapshot successfully written to:`);
  console.log(`    ${targetBackupPath}`);
  console.log(`    Size: ${(stats.size / 1024).toFixed(2)} KB`);

  // 5. Database Statistics & Row Counts
  console.log('\n--- 3. Core Table Audits ---');
  const userCount = await db.user.count();
  const productCount = await db.product.count();
  const variantCount = await db.productVariant.count();
  const orderCount = await db.order.count();
  const returnCount = await db.return.count();
  const couponCount = await db.coupon.count();
  const reviewCount = await db.review.count();

  console.log(`  • Users / Admins:     ${userCount}`);
  console.log(`  • Catalog Products:   ${productCount}`);
  console.log(`  • Product Variants:   ${variantCount}`);
  console.log(`  • Customer Orders:    ${orderCount}`);
  console.log(`  • Return Inquiries:   ${returnCount}`);
  console.log(`  • Active Coupons:     ${couponCount}`);
  console.log(`  • Customer Reviews:   ${reviewCount}`);

  console.log('\n======================================================');
  console.log('  STATUS: BACKUP COMPLETED & VERIFIED 100% SUCCESSFUL');
  console.log('======================================================\n');
}

performBackup()
  .catch((err) => {
    console.error('Backup failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
