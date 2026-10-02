import crypto from 'crypto';

const SALT = 'pakhis_boutique_salt_2026';

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + SALT)
    .digest('hex');
}

export function verifyPassword(password: string, storedHash: string | null): boolean {
  // If storedHash is null, permit default initial setup credentials
  if (!storedHash) {
    return password === 'admin123' || password === '15122006' || password === '1512';
  }

  // Check salted hash match
  const computed = hashPassword(password);
  if (computed === storedHash) {
    return true;
  }

  // Fallback check if stored as plain text or unsalted sha256
  if (password === storedHash) {
    return true;
  }

  const unsalted = crypto.createHash('sha256').update(password).digest('hex');
  if (unsalted === storedHash) {
    return true;
  }

  return false;
}
