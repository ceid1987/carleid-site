"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '../../api/blog-posts/route';
import 'highlight.js/styles/github-dark.css';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog-posts/${resolvedParams.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found');
          } else {
            setError('Failed to load blog post');
          }
          return;
        }

        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.slug]);

  const processMarkdown = (content: string, imageContent?: any): string => {
    // Replace image placeholders with actual markdown images
    if (imageContent?.data) {
      content = content.replace(/\{\{image-(\d+)\}\}/g, (match, index) => {
        const imageIndex = parseInt(index) - 1;
        const image = imageContent.data[imageIndex];
        if (image) {
          const imageUrl = image.attributes.url;
          return `![${image.attributes.alternativeText || 'Blog image'}](${imageUrl})`;
        }
        return match;
      });
    }
    return content;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-gray-300">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Blog post not found'}</h1>
          <button
            onClick={() => router.push('/#projects')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
          >
            ← Back to home page
          </button>
        </div>
      </div>
    );
  }

  const featuredImageUrl = post.featuredImage?.url;
  const fullImageUrl = featuredImageUrl || null;

  return (
    <div className="min-h-screen bg-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/#projects')}
          className="flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-colors duration-200 mb-8 px-4 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-base font-medium">Back to home page</span>
        </button>

        {/* Featured Badge */}
        {post.featured && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-purple-500 text-white rounded-full">
              Featured Post
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {post.title}
        </h1>

        {/* Publish Date */}
        <time className="text-gray-400 text-sm mb-8 block">
          Published on {new Date(post.publishTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        {/* Featured Image */}
        {fullImageUrl && (
          <div className="flex justify-center mb-8">
            <div className="relative rounded-lg overflow-hidden max-w-md">
              <Image
                src={fullImageUrl}
                alt={post.featuredImage?.alternativeText || post.title}
                width={post.featuredImage?.width || 500}
                height={post.featuredImage?.height || 500}
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              // Custom styling for different elements
              h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 mt-8">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-6">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-5">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-gray-300 leading-relaxed">{children}</p>,
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200"
                >
                  {children}
                </a>
              ),
              code: ({ className, children, ...props }: any) => {
                const inline = props.inline;
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                      {match ? match[1] : 'text'}
                    </div>
                    <code className="text-gray-300 font-mono text-sm leading-relaxed block" {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-300">
                  {children}
                </blockquote>
              ),
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full max-w-2xl mx-auto rounded-lg my-6"
                />
              ),
            }}
          >
            {processMarkdown(post.content, post.imageContent)}
          </ReactMarkdown>
        </div>

        {/* Back Button at Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <button
            onClick={() => router.push('/#projects')}
            className="flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base font-medium">Back to home page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;