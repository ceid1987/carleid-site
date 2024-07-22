"use client";

// Dependencies
import React, { useEffect, useState } from 'react';
import { faExternalLink, faExternalLinkSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import Navbar from '../components/Navbar';
import AnimatedText from '../components/AnimatedText';
import AnimatedArrow from '../components/AnimatedArrow';

// Styles
import styles from '../styles/Parallax.module.css';
import AsciiBackground from '@/components/AsciiBackground';


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
      <div id="home" className="min-h-screen flex flex-grow flex-col items-center justify-center relative">
        <div className="bg"></div>
        <div className={`${styles.parallax} ${styles['parallax-fast']}`}>
          <AnimatedText />
        </div>
        <h2 className={`${styles.parallax} ${styles['parallax-fast']} text-l mt-4 md:text-xl lg:text-2xl transition-opacity duration-1000 ${scrollY > 300 ? 'opacity-0' : 'opacity-100'}`}>
          software / devops engineer
        </h2>
        <AnimatedArrow visible={showArrow} />
      </div>
      <div id="whoami" className="min-h-screen flex flex-col items-center justify-center bg-black text-white  p-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl mt-18 py-16">whoami</h1>
        <AsciiBackground />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl p-16">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-purple-500 mb-4">about me</h2>
            <p className="text-lg md:text-2lg lg:text-xl">
              Software/DevOps engineer from 🇱🇧 Lebanon, based in 🇫🇷 France. I like to develop scalable solutions from the ground up, all the way to deployment :)
            </p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-purple-500 mb-4">tech stack</h2>
            <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg">
              {/* Add your tech stack slider here */}
              <p>Tech stack slider placeholder</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-purple-500 mb-4">experience</h2>
            <button className="bg-white bg-opacity-10 backdrop-blur-lg text-white py-2 px-4 rounded-full text-lg mt-2 ">
              view timeline<FontAwesomeIcon icon={faEye} className="ml-2 fa-xs"/> 
            </button>
            <a href="#" className="block mt-4 text-white underline ">full resume<FontAwesomeIcon icon={faExternalLink} className="ml-2 fa-xs"/></a>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-purple-500 mb-4">now playing</h2>
            <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg">
              {/* Add your now playing content here */}
              <p>Now playing placeholder</p>
            </div>
          </div>
        </div>
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
