import { NextResponse } from 'next/server';
import { STRAPI_URL, hasStrapiConfig, strapiHeaders } from '@/lib/strapi';
import { BlogPostsResponse, absolutizeFeaturedImage } from '@/lib/blog';

const getBlogPosts = async (): Promise<BlogPostsResponse> => {
  const response = await fetch(
    `${STRAPI_URL}/api/blog-posts?populate=*&sort[0]=featured:desc&sort[1]=publishTime:desc`,
    {
      headers: strapiHeaders,
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch blog posts:', await response.text());
    throw new Error('Failed to fetch blog posts');
  }

  const data: BlogPostsResponse = await response.json();
  data.data = data.data?.map(absolutizeFeaturedImage) ?? [];
  return data;
};

export async function GET() {
  try {
    if (!hasStrapiConfig()) {
      console.error('Missing required environment variables for Strapi API');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { data, meta } = await getBlogPosts();
    return NextResponse.json({ data, meta });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
