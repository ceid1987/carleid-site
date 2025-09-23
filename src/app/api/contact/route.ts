import { NextResponse } from 'next/server';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

// Simple in-memory rate limiter with persistence in development
const globalForRateLimit = globalThis as unknown as {
  rateLimitMap: Map<string, { count: number; resetTime: number }> | undefined;
};

const rateLimitMap = globalForRateLimit.rateLimitMap ?? new Map<string, { count: number; resetTime: number }>();

if (process.env.NODE_ENV === 'development') {
  globalForRateLimit.rateLimitMap = rateLimitMap;
}

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_MAX_REQUESTS = 1; // Max 1 submission per 24 hours per IP

function getRateLimitKey(ip: string): string {
  return `contact_${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Increment count
  record.count++;
  rateLimitMap.set(key, record);
  return false;
}

function getClientIP(request: Request): string {
  // Try to get real IP from headers (for production with proxy/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // For development, normalize IPv6 localhost to a consistent value
  // Next.js in dev mode often provides ::1 (IPv6 localhost)
  return 'dev-localhost';
}

let STRAPI_URL: string;
let STRAPI_API_TOKEN: string;

if (process.env.NODE_ENV === 'development') {
  // Local environment
  STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';
} else {
  // Production environment
  STRAPI_URL = process.env.STRAPI_URL || '';
  STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
}

export async function POST(request: Request) {
  try {
    // Check rate limiting
    const clientIP = getClientIP(request);
    console.log(`Contact form request from IP: ${clientIP}`);
    console.log(`Rate limit map:`, rateLimitMap);

    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting again.' },
        { status: 429 }
      );
    }

    // Check if required environment variables are present
    if (!STRAPI_URL || !STRAPI_API_TOKEN) {
      console.error('Missing required environment variables for Strapi API');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body: ContactFormData = await request.json();

    // Basic validation
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send to Strapi contact API
    const response = await fetch(`${STRAPI_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        message
      }),
    });

    if (!response.ok) {
      console.error('Failed to submit contact form:', await response.text());
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('Contact form submitted successfully at:', new Date().toISOString());

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      data: result.data
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}