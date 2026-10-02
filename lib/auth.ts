import crypto from 'crypto';

const LEGACY_SALT = 'pakhis_boutique_salt_2026';
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'pakhis_secure_session_secret_2026';

/**
 * Modern PBKDF2 Password Hashing with SHA-512 and 100,000 iterations.
 * Generates an individualized cryptographically random salt per password.
 * Format: pbkdf2$100000$<salt_hex>$<derived_key_hex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `pbkdf2$${iterations}$${salt}$${derivedKey}`;
}

/**
 * Constant-time string comparator to prevent timing attack side-channels.
 */
function safeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verifies a password against PBKDF2, salted SHA-256 legacy, or initial setup defaults.
 */
export function verifyPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash) {
    return safeEqual(password, 'admin123') || safeEqual(password, '15122006') || safeEqual(password, '1512');
  }

  // 1. Check if stored in modern PBKDF2 format
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length === 4) {
      const iterations = parseInt(parts[1], 10);
      const salt = parts[2];
      const expectedKey = parts[3];
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
      return safeEqual(derivedKey, expectedKey);
    }
  }

  // 2. Legacy salted SHA-256 check
  const legacySalted = crypto.createHash('sha256').update(password + LEGACY_SALT).digest('hex');
  if (safeEqual(legacySalted, storedHash)) {
    return true;
  }

  // 3. Fallback check for unsalted SHA-256
  const legacyUnsalted = crypto.createHash('sha256').update(password).digest('hex');
  if (safeEqual(legacyUnsalted, storedHash)) {
    return true;
  }

  return false;
}

/**
 * Generates a signed cryptographic admin session token with expiration (7 days default)
 */
export function generateAdminToken(payload: { id: string; email: string; role: string }, expiresInSeconds = 7 * 86400): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const data = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${data}`)
    .digest('base64url');

  return `${header}.${data}.${signature}`;
}

/**
 * Verifies an admin token signature and expiration
 */
export function verifyAdminToken(token: string): { id: string; email: string; role: string } | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, data, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${data}`)
      .digest('base64url');

    if (!safeEqual(signature, expectedSig)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
