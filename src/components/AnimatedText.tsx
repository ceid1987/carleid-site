// src/components/AnimatedText.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import styles from '../styles/AnimatedText.module.css';

const AnimatedText: React.FC = () => {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const options = {
      strings: [
        '.dev',
        'hi',        
        'rm -rf /',
        "what's up?",        
        ':(){ :|:& };: fork bomb!',
        '.dev',
        'sometimes i code',
        '(◑‿◐)',
        'sometimes i break things',
        '(●´⌓`●)',
        'sometimes i fix them',
        '.dev',
        'chmod -R 777 /',
        'this is a website',
        'hello world!',
      ],
      typeSpeed: 50,
      backSpeed: 40,
      backDelay: 5000, // 5 seconds for the first string
      loop: true,
      showCursor: true,
      cursorChar: '|',
      preStringTyped: (arrayPos: number, self: Typed & { backDelay?: number }) => {
        if (arrayPos === 0) {
          // Set a shorter delay after the first string
          self.backDelay = 3000;
        }
      },
    };

    const typed = new Typed(el.current!, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-xl md:text-2xl lg:text-4xl px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-screen-lg whitespace-pre-wrap">
        <span className="text-purple-500">carl@eid:<span className="text-blue-500">~</span><span className="text-white">$&nbsp;</span></span>
        <span ref={el} className={`${styles.typedText} ${styles.typedCursor}`} />
      </div>
    </div>
  );
};

export default AnimatedText;
