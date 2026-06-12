"use client";

import React, { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '../../api/blog-posts/route';
import 'highlight.js/styles/github-dark.css';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Fenced code block with a copy-to-clipboard button and a transient "Code copied" message.
const CodeBlock: React.FC<{ language: string; children: React.ReactNode }> = ({ language, children }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = async () => {
    const text = codeRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <pre className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{language}</span>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs text-green-400 transition-opacity duration-500 ${copied ? 'opacity-100' : 'opacity-0'}`}
            aria-live="polite"
          >
            Code copied
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faCopy} className="w-3 h-3" />
            Copy
          </button>
        </div>
      </div>
      <code ref={codeRef} className="text-gray-300 font-mono text-sm leading-relaxed block">
        {children}
      </code>
    </pre>
  );
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  // The icon being animated out during a theme switch (null when idle).
  const [prevTheme, setPrevTheme] = useState<'light' | 'dark' | null>(null);
  const router = useRouter();

  const isDark = theme === 'dark';

  // Load persisted blog theme (read in an effect to avoid hydration mismatch).
  useEffect(() => {
    const saved = localStorage.getItem('blog-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  // Remove the outgoing icon once its swoop-out animation has finished.
  useEffect(() => {
    if (!prevTheme) return;
    const timer = setTimeout(() => setPrevTheme(null), 300);
    return () => clearTimeout(timer);
  }, [prevTheme]);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setPrevTheme(theme); // current icon becomes the one swooping out
    setTheme(next);
    localStorage.setItem('blog-theme', next);
  };

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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-dark text-white' : 'bg-white text-gray-900'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top bar: back button + theme toggle */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/#projects')}
            className={`flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-colors duration-200 px-4 py-2 rounded-lg ${isDark ? 'hover:bg-gray-800 hover:bg-opacity-50' : 'hover:bg-gray-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base font-medium">Back to home page</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative w-10 h-10 rounded-full overflow-hidden transition-colors duration-200 ${isDark ? 'text-yellow-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            {/* Incoming icon: swoops in from the right when switching */}
            <span
              key={theme}
              className={`absolute inset-0 flex items-center justify-center ${prevTheme ? 'icon-swoop-in' : ''}`}
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="w-5 h-5" />
            </span>
            {/* Outgoing icon: swoops out to the left while the new one enters */}
            {prevTheme && (
              <span
                key={`leaving-${prevTheme}`}
                className="absolute inset-0 flex items-center justify-center icon-swoop-out"
              >
                <FontAwesomeIcon icon={prevTheme === 'dark' ? faSun : faMoon} className="w-5 h-5" />
              </span>
            )}
          </button>
        </div>

        {/* Featured Badge */}
        {post.featured && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-purple-500 text-white rounded-full">
              Featured Post
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {post.title}
        </h1>

        {/* Publish Date */}
        <time className={`text-sm mb-8 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
        <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              // Custom styling for different elements (colors follow the blog theme)
              h1: ({ children }) => <h1 className={`text-3xl md:text-4xl font-bold mb-6 mt-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</h1>,
              h2: ({ children }) => <h2 className={`text-2xl md:text-3xl font-bold mb-4 mt-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</h2>,
              h3: ({ children }) => <h3 className={`text-xl md:text-2xl font-bold mb-3 mt-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</h3>,
              p: ({ children }) => <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{children}</p>,
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
                const match = /language-(\w+)/.exec(className || '');
                const inline = !match && !String(children ?? '').includes('\n');
                return !inline ? (
                  <CodeBlock language={match ? match[1] : 'text'}>
                    {children}
                  </CodeBlock>
                ) : (
                  <code className={`px-2 py-1 rounded text-sm font-mono ${isDark ? 'bg-gray-800 text-green-400' : 'bg-gray-200 text-purple-700'}`} {...props}>
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => <ul className={`list-disc list-inside mb-4 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{children}</ul>,
              ol: ({ children }) => <ol className={`list-decimal list-inside mb-4 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 border-purple-500 pl-4 my-4 italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className={`w-full border-collapse text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className={isDark ? 'bg-gray-800' : 'bg-gray-100'}>{children}</thead>
              ),
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => (
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>{children}</tr>
              ),
              th: ({ children }) => (
                <th className={`px-4 py-2 text-left font-semibold border ${isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className={`px-4 py-2 align-top border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  {children}
                </td>
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
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => router.push('/#projects')}
            className={`flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-colors duration-200 px-4 py-2 rounded-lg ${isDark ? 'hover:bg-gray-800 hover:bg-opacity-50' : 'hover:bg-gray-200'}`}
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