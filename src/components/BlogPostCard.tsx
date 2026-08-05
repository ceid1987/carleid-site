"use client";

import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { BlogPost, externalHref } from '@/lib/blog';

interface BlogPostCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onClick }) => {
  const fullImageUrl = post.featuredImage?.url || null;
  const hasLink = Boolean(post.link && post.linkSubtext);

  return (
    <div 
      className={`relative flex flex-col md:flex-row p-5 space-y-4 md:space-y-0 md:space-x-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] cursor-pointer hover:border-purple-500/60 hover:bg-purple-500/10 transition-all duration-200 group ${hasLink ? 'pb-14 md:pb-5' : ''}`}
      onClick={onClick}
    >
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center space-y-3">
        {/* Featured Badge */}
        {post.featured && (
          <span className="inline-block w-fit px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider rounded-md border border-purple-500/50 bg-purple-500/15 text-purple-300">
            Featured
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-medium tracking-tight text-white group-hover:text-purple-300 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-dim text-sm md:text-base">
          {post.excerpt.length > 150
            ? `${post.excerpt.substring(0, 150)}...`
            : post.excerpt
          }
        </p>

        {/* Publish Date */}
        <time className="font-mono text-dim text-xs md:text-sm">
          {new Date(post.publishTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      {/* Featured Image */}
      {fullImageUrl && (
        <div className="w-full md:w-32 h-32 md:h-32 relative rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={fullImageUrl}
            alt={post.featuredImage?.alternativeText || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, 128px"
          />
        </div>
      )}

      {/* External link button (bottom right) */}
      {hasLink && (
        <a
          href={externalHref(post.link!)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/50 bg-[#141418]/85 backdrop-blur-sm font-mono text-xs text-purple-300 hover:border-purple-500 hover:bg-purple-500/25 hover:text-white transition-all duration-200"
        >
          {post.linkSubtext}
          <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

export default BlogPostCard;