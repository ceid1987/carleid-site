"use client";

// Dependencies/utils
import React, { useEffect, useState } from 'react';
import { faExternalLink, faExternalLinkSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

// Components
import Navbar from '../components/Navbar';
import AnimatedTextS1 from '../components/AnimatedTextS1';
import AnimatedArrow from '../components/AnimatedArrow';
import { LampContainer } from '../components/Lamp';

// Styles
import styles from '../styles/Parallax.module.css';

const Home: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [showArrow, setShowArrow] = useState(true);
  const [scrollY, setScrollY] = useState(0);

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
      <div id="whoami" className="min-h-screen flex flex-col items-center justify-center bg-black bg-dot-white relative">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:linear-gradient(to_bottom,black,transparent,black),radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold z-0">whoami</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl md:p-17 py-16 px-8">
          <div className='flex flex-col h-auto rounded-xl bg-white backdrop-blur-3xl bg-opacity-10 text-white p-8 space-y-4'>
            <p className='text-lg md:text-2xl text-purple-500 font-bold'>bio</p>
            <p className='text-xs md:text-lg text-left'>I&rsquo;m a software/devops engineer from Lebanon, based in France. I like to develop scalable solutions from the ground up following devops practices, all the way to deployment.</p>
          </div>
          <div className='flex flex-col h-auto rounded-xl bg-white backdrop-blur-3xl bg-opacity-10 text-white p-8 space-y-4'>
            <p className='text-lg md:text-2xl text-purple-500 font-bold'>tech stack</p> 
          </div>
          <div className='flex flex-col h-auto rounded-xl bg-white backdrop-blur-3xl bg-opacity-10 text-white p-8 space-y-4'>
            <p className='text-lg md:text-2xl text-purple-500 font-bold'>experience</p>
            <p className='text-xs md:text-lg text-left'>experience here</p>
            <a href="#" className="block mt-4 text-white underline ">full resume<FontAwesomeIcon icon={faExternalLink} className="ml-2 fa-xs"/></a>
          </div>
          <div className='flex flex-col h-auto rounded-xl bg-white backdrop-blur-3xl bg-opacity-10 text-white p-8 space-y-4'>
            <p className='text-lg md:text-2xl text-purple-500 font-bold'>placeholder</p>
            <p className='text-xs md:text-lg text-left'>placeholder</p>
          </div>
        </div>
      </div>

      <div id="projects" className="min-h-screen flex flex-grow flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">projects</h1>
      </div>

      <div id="contact" className="min-h-screen flex flex-grow flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">Contact Section</h1>
      </div>
    </div>
  );
};

export default Home;
