"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import NowPlaying from './NowPlaying';

interface CarouselItem {
  id: number;
  image: string;
  alt: string;
  title?: string;
  text?: string;
  subtitle?: string;
  isSpotify?: boolean;
}

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because we'll add duplicate at beginning
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [lastInteractionWasTouch, setLastInteractionWasTouch] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  
  const items: CarouselItem[] = [
    {
      id: 1,
      image: '/carousel/carousel-1.png',
      alt: 'Carousel image 1',
      title: 'bio',
      text: "I'm a software engineer based in France. I am passionate about DevOps and building cool software. I love video games, skateboarding and football.",
      subtitle: "This is me watching my brother play GTA Vice City on an old CRT monitor."
    },
    {
      id: 2,
      image: '/carousel/carousel-2.png',
      alt: 'Carousel image 2',
      text: "I'm experienced in building scalable, DevOps-friendly software — anything from microservices to full-stack applications."
    },
    {
      id: 3,
      image: '/carousel/carousel-3.jpeg',
      alt: 'Carousel image 3',
      isSpotify: true
    }
  ];

  // Create extended array with duplicates for smooth infinite loop
  const extendedItems = [items[items.length - 1], ...items, items[0]];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    // Overlay state is now persistent - no need to change it
    
    setTimeout(() => {
      // If we've moved to the duplicate at the end, snap to the real first item
      if (newIndex === extendedItems.length - 1) {
        setCurrentIndex(1);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    // Overlay state is now persistent - no need to change it
    
    setTimeout(() => {
      // If we've moved to the duplicate at the beginning, snap to the real last item
      if (newIndex === 0) {
        setCurrentIndex(items.length);
      }
      setIsTransitioning(false);
    }, 300);
  };

  // Helper function to get real item index from extended array index
  const getRealIndex = (extendedIndex: number) => {
    if (extendedIndex === 0) return items.length - 1; // First duplicate
    if (extendedIndex === extendedItems.length - 1) return 0; // Last duplicate
    return extendedIndex - 1; // Regular items
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setLastInteractionWasTouch(true);
    const touch = e.targetTouches[0].clientX;
    setTouchStart(touch);
    setTouchEnd(0);
    setTouchStartTime(Date.now());
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || isTransitioning) return;
    const touch = e.targetTouches[0].clientX;
    setTouchEnd(touch);
    const offset = touch - touchStart;
    setDragOffset(offset);
    setIsDragging(Math.abs(offset) > 10); // Consider it dragging after 10px movement
  };

  const handleTouchEnd = () => {
    if (!touchStart || isTransitioning) return;
    
    setIsDragging(false);
    setDragOffset(0);
    
    const touchDuration = Date.now() - touchStartTime;
    const distance = touchEnd ? touchStart - touchEnd : 0;
    
    // A tap is quick (under 200ms) and has minimal movement (under 20px)
    const isTap = touchDuration < 200 && Math.abs(distance) < 20;
    
    if (isTap) {
      // This was a tap - toggle overlay
      toggleOverlay();
    } else if (Math.abs(distance) > 30) {
      // This was a swipe - change slide, maintain overlay state
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    // If it's neither a clear tap nor swipe, do nothing
    
    setTouchStart(0);
    setTouchEnd(0);
    setTouchStartTime(0);
  };

  const handleMouseClick = () => {
    // Only handle mouse clicks if the last interaction wasn't touch
    if (!lastInteractionWasTouch && !isTransitioning) {
      toggleOverlay();
    }
    // Reset the touch flag after a short delay
    setTimeout(() => setLastInteractionWasTouch(false), 100);
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      <div 
        className="relative h-96 overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {extendedItems.map((item, index) => {
          let position = index - currentIndex;
          const offset = dragOffset * 0.5;
          const realIndex = getRealIndex(index);
          const isCurrentItem = realIndex === getRealIndex(currentIndex);
          
          return (
            <div
              key={`${item.id}-${index}`}
              className={`absolute inset-0 w-full h-96 ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
              style={{
                transform: `translateX(${position * 100 + offset}%)`
              }}
            >
            <div 
              className="relative w-full h-full group cursor-pointer select-none"
              onClick={handleMouseClick}
            >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className={`object-cover transition-all duration-300 ${
                    (showOverlay && isCurrentItem) ? 'brightness-50' : (isHoveringButton && isCurrentItem) ? 'brightness-50' : 'group-hover:brightness-50'
                  }`}
                />
              
                {/* Touch indicator */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-5 ${
                  (showOverlay && isCurrentItem) ? 'opacity-0' : (isHoveringButton || false) ? 'opacity-0' : 'group-hover:opacity-0'
                }`}>
                  <div className="animate-pulse">
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 24 24" style={{animationDuration: '2s'}}>
                      <path d="M10.475 22q-.7 0-1.312-.3t-1.038-.85l-5.45-6.925l.475-.5q.5-.525 1.2-.625t1.3.275L7.5 14.2V6q0-.425.288-.712T8.5 5t.725.288t.3.712v5H17q1.25 0 2.125.875T20 14v4q0 1.65-1.175 2.825T16 22zm-6.3-13.5q-.325-.55-.5-1.187T3.5 6q0-2.075 1.463-3.537T8.5 1t3.538 1.463T13.5 6q0 .675-.175 1.313t-.5 1.187l-1.725-1q.2-.35.3-.712T11.5 6q0-1.25-.875-2.125T8.5 3t-2.125.875T5.5 6q0 .425.1.788t.3.712z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 z-10 ${
                  (showOverlay && isCurrentItem) ? 'opacity-100' : (isHoveringButton && isCurrentItem) ? 'opacity-100 md:opacity-100' : 'opacity-0 md:group-hover:opacity-100'
                }`}>
                  {item.isSpotify ? (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <NowPlaying />
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <h1 className="text-white text-xl md:text-2xl font-bold text-left px-8 md:px-16">
                          {item.title}
                        </h1>
                        <p className="text-white text-base md:text-lg font-semibold text-left px-8 md:px-16">
                          {item.text}
                        </p>
                      </div>
                      {item.subtitle && (
                        <div className="pb-6 md:pb-10">
                          <p className="text-white text-xs md:text-sm font-normal text-left px-8 md:px-16">
                            {item.subtitle}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLastInteractionWasTouch(true);
          prevSlide();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setLastInteractionWasTouch(true);
        }}
        onMouseEnter={() => setIsHoveringButton(true)}
        onMouseLeave={() => setIsHoveringButton(false)}
        className="hidden md:block absolute top-1/2 left-6 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full p-1.5 transition-all duration-200 z-20"
        type="button"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLastInteractionWasTouch(true);
          nextSlide();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setLastInteractionWasTouch(true);
        }}
        onMouseEnter={() => setIsHoveringButton(true)}
        onMouseLeave={() => setIsHoveringButton(false)}
        className="hidden md:block absolute top-1/2 right-6 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full p-1.5 transition-all duration-200 z-20"
        type="button"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index + 1)} // +1 because of duplicate at start
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === getRealIndex(currentIndex)
                ? 'bg-purple-500' 
                : 'bg-white bg-opacity-30 hover:bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;