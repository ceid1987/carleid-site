"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimatedText from '../components/AnimatedText';

const Home: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');

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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Navbar currentSection={currentSection} />
      <div id="home" className="min-h-screen flex flex-grow flex-col items-center justify-center">
        <AnimatedText />
        <h2 className="text-l mt-4 md:text-xl lg:text-2xl">software / devops engineer</h2>
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
