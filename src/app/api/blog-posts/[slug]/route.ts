import { NextResponse } from 'next/server';
import { BlogPost } from '../route';

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

const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const response = await fetch(
    `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch blog post:', await response.text());
    throw new Error('Failed to fetch blog post');
  }

  const data = await response.json();
  console.log('Fetched blog post by slug at:', new Date().toISOString());
  
  return data.data.length > 0 ? data.data[0] : null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check if required environment variables are present
    if (!STRAPI_URL || !STRAPI_API_TOKEN) {
      console.error('Missing required environment variables for Strapi API');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Fetch blog post from Strapi
    const blogPost = await getBlogPostBySlug(slug);

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: blogPost });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}