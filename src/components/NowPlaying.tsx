import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { FaSpotify } from 'react-icons/fa';

interface ScrollingTextProps {
  text: string;
  className: string;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({ text, className }) => {
  const [shouldScroll, setShouldScroll] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShouldScroll(false);
    
    const measureText = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setShouldScroll(textWidth > containerWidth);
      }
    };

    setTimeout(measureText, 0);
  }, [text]);

  useEffect(() => {
    if (shouldScroll && animationRef.current) {
      const element = animationRef.current;
      const textWidth = element.scrollWidth / 3; // actual text width (since we have 3 copies)
      const speed = 30; // pixels per second - CONSTANT SPEED FOR ALL
      const moveTime = textWidth / speed; // time to scroll one text width
      
      let isMoving = true;
      
      const runCycle = () => {
        if (isMoving) {
          element.style.animation = `marquee-move ${moveTime}s linear forwards`;
          setTimeout(() => {
            isMoving = false;
            element.style.animation = `marquee-pause 1s linear forwards`;
            setTimeout(() => {
              element.style.transform = 'translateX(0%)';
              isMoving = true;
              runCycle();
            }, 2000);
          }, moveTime * 1000);
        }
      };
      
      runCycle();
    }
  }, [shouldScroll]);

  return (
    <div ref={containerRef} className="overflow-hidden relative">
      {shouldScroll ? (
        <div ref={animationRef} className="whitespace-nowrap inline-flex">
          <span className={`${className} pr-8`}>{text}</span>
          <span className={`${className} pr-8`}>{text}</span>
          <span className={`${className} pr-8`}>{text}</span>
        </div>
      ) : (
        <span ref={textRef} className={`${className} truncate block`}>
          {text}
        </span>
      )}
    </div>
  );
};

const NowPlaying = () => {
  useEffect(() => {
    // Add marquee animation CSS if it doesn't exist
    const styleId = 'marquee-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes marquee-move {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-pause {
          0%, 100% { transform: translateX(-33.333%); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  const [song, setSong] = useState<{
    name: string;
    artists: string;
    albumImage: string;
    isPlaying: boolean;
    progress: number;
    duration: number;
  } | null>(null);

  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/now-playing');
      const data = await res.json();
      if (data.isPlaying) {
        setSong({
          name: data.name,
          artists: data.artists,
          albumImage: data.albumImage,
          isPlaying: data.isPlaying,
          progress: data.progress,
          duration: data.duration,
        });
        setCurrentProgress(data.progress);
      } else {
        setSong(null);
        setCurrentProgress(0);
      }
    } catch (error) {
      console.error('Error fetching now playing:', error);
      setSong(null);
      setCurrentProgress(0);
    }
  };

  // Fetch API data every 30 seconds
  useEffect(() => {
    fetchNowPlaying(); // Initial API call

    const apiInterval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(apiInterval); // Cleanup on unmount
  }, []);

  // Simulate progress locally and handle end of song
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (song && song.isPlaying) {
      // Start progress simulation
      progressIntervalRef.current = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev < song.duration) {
            return prev + 1000; // Increment progress by 1 second
          } else {
            // Song has ended, call the API to fetch the next song
            clearInterval(progressIntervalRef.current!);
            fetchNowPlaying(); // Fetch the next song immediately
            return prev;
          }
        });
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current); // Cleanup on unmount or song change
      }
    };
  }, [song]);

  if (!song) {
    return (
      <div className="flex-col w-full max-w-xs md:min-w-96 p-3 md:p-4 space-y-3 md:space-y-4 rounded-lg bg-gray-800 backdrop-blur-sm bg-opacity-10">
        <div className="flex items-center space-x-3 md:space-x-4">
          <FaSpotify size={20} className="text-green-500 md:w-6 md:h-6" />
          <h2 className="text-base md:text-lg font-bold">now playing</h2>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-lg bg-gray-900 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <ScrollingText text="nothing" className="text-sm md:text-base font-bold" />
            <ScrollingText text="no one" className="text-sm md:text-base text-gray-500" />
            <p className="text-xs text-gray-500 truncate">probably sleeping</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentProgress / song.duration) * 100;

  return (
    <div className="flex-col w-full max-w-xs md:min-w-96 p-3 md:p-4 space-y-3 md:space-y-4 rounded-lg bg-gray-800 backdrop-blur-lg bg-opacity-60">
      <div className="flex items-center space-x-3 md:space-x-4">
        <FaSpotify size={20} className="text-green-500 md:w-6 md:h-6" />
        <h2 className="text-base md:text-lg font-bold">Now Playing</h2>
      </div>
      <div className="flex items-center space-x-3 md:space-x-4">
        <img src={song.albumImage} alt={song.name} className="w-20 h-20 md:w-32 md:h-32 rounded-lg flex-shrink-0" />
        <div className='w-full min-w-0 flex-1'>
          <ScrollingText text={song.name} className="text-sm font-bold" />
          <ScrollingText text={song.artists} className="text-sm text-gray-500" />
          <div className="h-1 bg-gray-600 rounded-full mt-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentProgress)}</span>
            <span>{formatTime(song.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in milliseconds to MM:SS
const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default NowPlaying;
