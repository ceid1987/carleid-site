import { NextResponse } from 'next/server';
import { STRAPI_URL, hasStrapiConfig, strapiHeaders } from '@/lib/strapi';
import { BlogPost, absolutizeFeaturedImage } from '@/lib/blog';

const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const response = await fetch(
    `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: strapiHeaders,
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch blog post:', await response.text());
    throw new Error('Failed to fetch blog post');
  }

  const data = await response.json();
  const post: BlogPost | undefined = data.data?.[0];
  return post ? absolutizeFeaturedImage(post) : null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!hasStrapiConfig()) {
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
