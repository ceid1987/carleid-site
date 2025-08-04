import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { FaSpotify } from 'react-icons/fa';

const NowPlaying = () => {
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
      <div className="flex-col min-w-96 p-4 space-y-4 rounded-lg bg-gray-800 backdrop-blur-lg bg-opacity-60">
        <div className="flex items-center space-x-4">
          <FaSpotify size={24} className="text-green-500" />
          <h2 className="text-lg font-bold">now playing</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 rounded-lg bg-gray-900" />
          <div>
            <h3 className="text-lg font-bold">nothing</h3>
            <p className="text-sm text-gray-500">no one</p>
            <p className="text-xs text-gray-500">probably sleeping</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentProgress / song.duration) * 100;

  return (
    <div className="flex-col min-w-96 p-4 space-y-4 rounded-lg bg-gray-800 backdrop-blur-lg bg-opacity-60">
      <div className="flex items-center space-x-4">
        <FaSpotify size={24} className="text-green-500" />
        <h2 className="text-lg font-bold">Now Playing</h2>
      </div>
      <div className="flex items-center space-x-4">
        <img src={song.albumImage} alt={song.name} className="w-32 h-32 rounded-lg" />
        <div className='w-full'>
          <h3 className="text-lg font-bold">{song.name}</h3>
          <p className="text-sm text-gray-500">{song.artists}</p>
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
