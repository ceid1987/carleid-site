// src/app/page.tsx
"use client";

import React from 'react';
import Navbar from '../components/Navbar';
import AnimatedText from '../components/AnimatedText';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black-custom text-white flex flex-col items-center">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <AnimatedText />
        <h2 className="text-l mt-4 md:text-xl lg:text-2xl">software / devops engineer</h2>
        {/* Other content of the home page */}
      </div>
    </div>
  );
};

export default Home;
