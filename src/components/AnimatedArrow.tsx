// src/components/AnimatedArrow.tsx
"use client";

import React from 'react';
import { FaArrowDown } from 'react-icons/fa';
import classNames from 'classnames';

interface AnimatedArrowProps {
  visible: boolean;
}

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ visible }) => {
  return (
    <div className={classNames("absolute bottom-28 flex justify-center w-full transition-opacity duration-1000", {
      "opacity-0": !visible,
      "opacity-80": visible,
    })}>
      <FaArrowDown size={20} className="animate-bounce text-white" />
    </div>
  );
};

export default AnimatedArrow;
