"use client";

import React from 'react';
import Image from 'next/image';
import { BlogPost } from '../app/api/blog-posts/route';

interface BlogPostCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onClick }) => {
  const fullImageUrl = post.featuredImage?.url || null;

  return (
    <div 
      className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4 rounded-lg bg-gray-800 backdrop-blur-lg bg-opacity-40 shadow-lg cursor-pointer hover:bg-opacity-50 transition-all duration-200 group"
      onClick={onClick}
    >
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center space-y-3">
        {/* Featured Badge */}
        {post.featured && (
          <span className="inline-block w-fit px-2 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
            Featured
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-300 text-sm md:text-base">
          {post.excerpt.length > 150 
            ? `${post.excerpt.substring(0, 150)}...` 
            : post.excerpt
          }
        </p>

        {/* Publish Date */}
        <time className="text-gray-400 text-xs md:text-sm">
          {new Date(post.publishTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      {/* Featured Image */}
      {fullImageUrl && (
        <div className="w-full md:w-32 h-32 md:h-32 relative rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={fullImageUrl}
            alt={post.featuredImage?.alternativeText || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, 128px"
          />
        </div>
      )}
    </div>
  );
};

export default BlogPostCard;