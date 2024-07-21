"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimatedText from '../components/AnimatedText';
import AnimatedArrow from '../components/AnimatedArrow';
import styles from '../styles/Parallax.module.css';

const Home: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [showArrow, setShowArrow] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
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
      <div id="home" className="min-h-screen flex flex-grow flex-col items-center justify-center relative">
        <div className="bg"></div>
        <div className={`${styles.parallax} ${styles['parallax-fast']}`}>
          <AnimatedText />
        </div>
        <h2 className={`${styles.parallax} ${styles['parallax-fast']} text-l mt-4 md:text-xl lg:text-2xl transition-opacity duration-1000 ${scrollY > 200 ? 'opacity-0' : 'opacity-100'}`}>
          software / devops engineer
        </h2>
        <AnimatedArrow visible={showArrow} />
      </div>
      <div id="about" className="min-h-screen flex flex-grow flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">About Section</h1>
      </div>
      <div id="projects" className="min-h-screen flex flex-grow flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">Projects Section</h1>
      </div>
      <div id="contact" className="min-h-screen flex flex-grow flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">Contact Section</h1>
      </div>
    </div>
  );
};

export default Home;
