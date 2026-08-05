"use client";

import React from 'react';

// Three sequentially pulsing dots, used for "typing…" style affordances.
const BlinkingDots: React.FC = () => (
  <span className="inline-flex">
    {['0s', '0.5s', '1s'].map(delay => (
      <span
        key={delay}
        className="animate-pulse opacity-0 text-purple-400"
        style={{
          animationDelay: delay,
          animationDuration: '1.5s',
          animationIterationCount: 'infinite',
        }}
      >
        .
      </span>
    ))}
  </span>
);

export default BlinkingDots;
