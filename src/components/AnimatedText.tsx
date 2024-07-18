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
        "what's up?",
        'developed with love',
        'sometimes i code',
        '(◑‿◐)',
        'sometimes i break things',
        '(●´⌓`●)',
        'sometimes i fix them',
        '¯\\_(ツ)_/¯',
        'rm -rf /',
        '¯\\_(⊙_☉)_/¯',
        'chmod -R 777 /',
        ':(){ :|:& };: fork bomb!',
        "i don't have cookies, yet",
        'this is a website',
        "i don't know what else to say",
        'this loop will now repeat',
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
    <div className="flex items-center text-2xl md:text-4xl lg:text-5xl">
      <span className="text-purple-500">
        carl@eid:<span className="text-blue-500">~</span>
        <span className="text-white">$&nbsp;</span>
      </span>
      <span ref={el} className={styles.typedCursor} />
    </div>
  );
};

export default AnimatedText;
