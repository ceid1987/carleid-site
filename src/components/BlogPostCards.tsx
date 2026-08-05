"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostCard from './BlogPostCard';
import BlinkingDots from './BlinkingDots';
import { BlogPost } from '@/lib/blog';

interface BlogPostCardsProps {
  blogPosts: BlogPost[];
  loading: boolean;
}

const StillWritingNote: React.FC = () => (
  <div className="text-center py-12">
    <p className="text-dim text-lg">
      Still writing blog posts<BlinkingDots />
    </p>
  </div>
);

const BlogPostCards: React.FC<BlogPostCardsProps> = ({ blogPosts, loading }) => {
  // Pagination logic
  const postsPerPage = 3;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const handleBlogPostClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate current posts to display
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  // Check if current page is the last page
  const isLastPage = currentPage === totalPages;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-dim">Loading blog posts...</span>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return <StillWritingNote />;
  }

  return (
    <div className="relative">
      {/* Blog Posts */}
      <div className="space-y-6">
        {currentPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onClick={() => handleBlogPostClick(post.slug)}
          />
        ))}

        {isLastPage && <StillWritingNote />}
      </div>

      {/* Section Navigator */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-8 h-8 rounded-lg font-mono text-sm transition-all duration-200 ${
                index + 1 === currentPage
                  ? 'border border-purple-500/60 bg-purple-500/15 text-white'
                  : 'bg-white/[0.03] text-dim border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPostCards;