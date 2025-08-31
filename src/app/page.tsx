"use client";

// Dependencies/utils
import React, { useEffect, useState } from 'react';
import { faExternalLink, faExternalLinkSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

// Components
import Navbar from '../components/Navbar';
import AnimatedTextS1 from '../components/AnimatedTextS1';
import AnimatedArrow from '../components/AnimatedArrow';
import Maintenance from '../components/Maintenance';
import ContentCard from '../components/ContentCard';
import NowPlaying from '../components/NowPlaying';
import Carousel from '../components/Carousel';
import BlogPostCard from '../components/BlogPostCard';

// Styles
import styles from '../styles/Parallax.module.css';

// Types
import { BlogPost, BlogPostsResponse } from './api/blog-posts/route';

const Home: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [showArrow, setShowArrow] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog-posts');
        if (response.ok) {
          const data: BlogPostsResponse = await response.json();
          setBlogPosts(data.data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'whoami', 'projects', 'contact'];
      const offsets = sections.map(
        section => document.getElementById(section)?.offsetTop || 0
      );

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      const currentIndex = offsets.findIndex(
        (offset, index) =>
          scrollPosition >= offset &&
          (index === sections.length - 1 || scrollPosition < offsets[index + 1])
      );

      setCurrentSection(sections[currentIndex]);
      setScrollY(window.scrollY);

      document.documentElement.style.setProperty('--scroll-y-slow', `${window.scrollY * 0.5}px`);
      document.documentElement.style.setProperty('--scroll-y-fast', `${window.scrollY * 0.3}px`);

      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBlogPostClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar currentSection={currentSection} />
      <div id="home" className="min-h-screen flex flex-grow flex-col items-center justify-center relative bg-background">
        <div className={`${styles.parallax} ${styles['parallax-fast']}`}>
          <AnimatedTextS1 />
        </div>
        <h2 className={`${styles.parallax} ${styles['parallax-fast']} text-l mt-4 md:text-xl lg:text-2xl transition-opacity duration-1000 ${scrollY > 300 ? 'opacity-0' : 'opacity-100'}`}>
          software / devops engineer
        </h2>
        <AnimatedArrow visible={showArrow} />
      </div>
      <div id="whoami" className="min-h-screen flex flex-col items-center space-y-8 justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">whoami</h2>
        <Carousel />
      </div>
      <div id="projects" className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">projects</h2>
        
        <div className="w-full max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-300">Loading blog posts...</span>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onClick={() => handleBlogPostClick(post.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">No blog posts available yet.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </div>
      <div id="contact" className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">contact</h2>
      </div>
    </div>
  );
};

export default Home;
