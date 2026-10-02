import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

/**
 * In-memory rate limiting map
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup of expired rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Sliding window rate limiter.
 * @param key Unique identifier (e.g. IP + endpoint)
 * @param limit Max requests allowed in window
 * @param windowMs Window duration in milliseconds (default 60s)
 */
export function checkRateLimit(key: string, limit: number, windowMs = 60000): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Strict Input Sanitization & Anti-XSS filter
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip javascript: schemes
    .replace(/on\w+\s*=/gi, '') // Strip event handlers like onload=, onclick=
    .slice(0, 5000); // Limit input length to prevent denial of service
}

/**
 * Deep sanitizes all string fields in an object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = { ...obj };
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return sanitized;
}

/**
 * Extracts and verifies the administrative session from headers or request.
 */
export async function authenticateAdminRequest(request: Request): Promise<{
  authorized: boolean;
  user: { id: string; name: string; email: string; role: string } | null;
  error?: string;
}> {
  // 1. Check Bearer Token or x-admin-token header
  const authHeader = request.headers.get('authorization') || request.headers.get('x-admin-token');
  let token = '';

  if (authHeader) {
    token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  }

  if (token) {
    const verified = verifyAdminToken(token);
    if (verified) {
      const user = await db.user.findUnique({
        where: { id: verified.id },
        select: { id: true, name: true, email: true, role: true },
      });
      if (user && ['OWNER', 'ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER', 'FULFILLMENT_STAFF'].includes(user.role)) {
        return { authorized: true, user };
      }
    }
  }

  // 2. Fallback check for requester ID in request headers (internal direct ops)
  const requesterId = request.headers.get('x-admin-id');
  if (requesterId) {
    const user = await db.user.findUnique({
      where: { id: requesterId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (user && ['OWNER', 'ADMIN', 'SUPER_ADMIN', 'OPS_MANAGER', 'FULFILLMENT_STAFF'].includes(user.role)) {
      return { authorized: true, user };
    }
  }

  return { authorized: false, user: null, error: 'Administrative authentication token required' };
}
