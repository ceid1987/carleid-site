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
import BlogPostCards from '../components/BlogPostCards';
import ContactForm from '../components/ContactForm';

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
          // Sort posts: featured first, then by publish date (newest first)
          const sortedPosts = data.data.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
          });
          setBlogPosts(sortedPosts);
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
          <BlogPostCards blogPosts={blogPosts} loading={loading} />
        </div>

        {/* GitHub Button */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/ceid1987"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-purple-600 border border-purple-600 hover:bg-purple-500 hover:border-purple-500 rounded-full text-white transition-all duration-200 group font-medium"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">View More on GitHub</span>
            <FontAwesomeIcon
              icon={faExternalLink}
              className="ml-2 w-4 h-4"
            />
          </a>
        </div>
      </div>
      <div id="contact" className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">contact</h2>
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-300 mb-4">
              Let&apos;s talk.
            </p>
            <p className="text-gray-400">
              Leave a message and I&apos;ll get back to you as soon as possible.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
