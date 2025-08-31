import { NextResponse } from 'next/server';

// Types based on the actual Strapi schema
export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // markdown content
  publishTime: string;
  featured: boolean;
  featuredImage?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  imageContent?: any;
  seo?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations: any[];
}

export interface BlogPostsResponse {
  data: BlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
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

const getBlogPosts = async (): Promise<BlogPostsResponse> => {
  const response = await fetch(
    `${STRAPI_URL}/api/blog-posts?populate=*&sort[0]=featured:desc&sort[1]=publishTime:desc`,
    {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch blog posts:', await response.text());
    throw new Error('Failed to fetch blog posts');
  }

  console.log('Fetched blog posts at:', new Date().toISOString());
  return response.json();
};

export async function GET() {
  try {
    // Check if required environment variables are present
    if (!STRAPI_URL || !STRAPI_API_TOKEN) {
      console.error('Missing required environment variables for Strapi API');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Fetch blog posts from Strapi
    const blogPostsData = await getBlogPosts();

    return NextResponse.json({
      data: blogPostsData.data,
      meta: blogPostsData.meta,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}