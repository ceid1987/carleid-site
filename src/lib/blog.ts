import { STRAPI_URL } from './strapi';

// Types matching the Strapi v5 blog-post content type (media fields are
// flattened by Strapi, no `attributes` wrapper).

export interface BlogPostImage {
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
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // markdown content
  publishTime: string;
  featured: boolean;
  link?: string | null;
  linkSubtext?: string | null;
  featuredImage?: BlogPostImage;
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

// Strapi returns upload URLs relative to its own host in local development.
export const absolutizeFeaturedImage = (post: BlogPost): BlogPost => {
  if (post.featuredImage?.url && !post.featuredImage.url.startsWith('http')) {
    post.featuredImage.url = `${STRAPI_URL}${post.featuredImage.url}`;
  }
  return post;
};

// Strapi link values may be entered without a protocol (e.g. "homelab.carleid.dev").
export const externalHref = (link: string) =>
  /^https?:\/\//i.test(link) ? link : `https://${link}`;
