import { useState, useEffect } from 'react';

const NowPlaying = () => {
  const [song, setSong] = useState<{
    name: string;
    artists: string;
    albumImage: string;
    isPlaying: boolean;
  } | null>(null);

  useEffect(() => {
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
          });
        } else {
          setSong(null);
        }
      } catch (error) {
        console.error('Error fetching now playing:', error);
        setSong(null);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!song) {
    return <p>Not currently playing anything.</p>;
  }

  return (
    <div className="flex items-center space-x-4">
      <img src={song.albumImage} alt={song.name} className="w-16 h-16 rounded-lg" />
      <div>
        <h3 className="text-lg font-bold">{song.name}</h3>
        <p className="text-sm text-gray-500">{song.artists}</p>
      </div>
    </div>
  );
};

export default NowPlaying;
