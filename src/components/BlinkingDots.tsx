"use client";

import React from 'react';

const BlinkingDots: React.FC = () => {
  return (
    <span className="inline-flex">
      <span
        className="animate-pulse opacity-0 text-purple-400"
        style={{
          animationDelay: '0s',
          animationDuration: '1.5s',
          animationIterationCount: 'infinite'
        }}
      >
        .
      </span>
      <span
        className="animate-pulse opacity-0 text-purple-400"
        style={{
          animationDelay: '0.5s',
          animationDuration: '1.5s',
          animationIterationCount: 'infinite'
        }}
      >
        .
      </span>
      <span
        className="animate-pulse opacity-0 text-purple-400"
        style={{
          animationDelay: '1s',
          animationDuration: '1.5s',
          animationIterationCount: 'infinite'
        }}
      >
        .
      </span>
    </span>
  );
};

export default BlinkingDots;