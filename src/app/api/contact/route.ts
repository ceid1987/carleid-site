import { NextResponse } from 'next/server';
import { STRAPI_URL, hasStrapiConfig, strapiHeaders } from '@/lib/strapi';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

// In-memory rate limiter. Stored on globalThis in development so the map
// survives hot reloads; in production the module instance lives as long as
// the server process.
const globalForRateLimit = globalThis as unknown as {
  rateLimitMap: Map<string, { count: number; resetTime: number }> | undefined;
};

const rateLimitMap =
  globalForRateLimit.rateLimitMap ?? new Map<string, { count: number; resetTime: number }>();

if (process.env.NODE_ENV === 'development') {
  globalForRateLimit.rateLimitMap = rateLimitMap;
}

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_MAX_REQUESTS = 1; // max submissions per window per IP

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRateLimited(ip: string): boolean {
  const key = `contact_${ip}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

function getClientIP(request: Request): string {
  // Real client IP comes from proxy/CDN headers in production.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Local dev has no proxy headers; use a stable placeholder so the rate
  // limiter still keys consistently (Next dev reports ::1 and variants).
  return 'dev-localhost';
}

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);

    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting again.' },
        { status: 429 }
      );
    }

    if (!hasStrapiConfig()) {
      console.error('Missing required environment variables for Strapi API');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body: ContactFormData = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const response = await fetch(`${STRAPI_URL}/api/contact`, {
      method: 'POST',
      headers: strapiHeaders,
      body: JSON.stringify({ firstName, lastName, email, phone, message }),
    });

    if (!response.ok) {
      console.error('Failed to submit contact form:', await response.text());
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: result.data,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
