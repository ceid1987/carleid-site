// Strapi connection settings shared by all API routes.
// Development reads the NEXT_PUBLIC_* variables from .env.local; production
// reads the unprefixed variables from the host environment.
const isDev = process.env.NODE_ENV === 'development';

export const STRAPI_URL = isDev
  ? process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  : process.env.STRAPI_URL || '';

export const STRAPI_API_TOKEN = isDev
  ? process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || ''
  : process.env.STRAPI_API_TOKEN || '';

export const hasStrapiConfig = () => Boolean(STRAPI_URL && STRAPI_API_TOKEN);

export const strapiHeaders = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
};
