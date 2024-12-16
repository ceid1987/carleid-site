import { NextResponse } from 'next/server';

let clientId: string;
let clientSecret: string;
let refreshToken: string;

if (process.env.NODE_ENV === 'development') {
  // Local environment
  clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || '';
  refreshToken = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN || '';
} else {
  // Production environment
  clientId = process.env.SPOTIFY_CLIENT_ID || '';
  clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  refreshToken = process.env.SPOTIFY_REFRESH_TOKEN || '';
}

// Ensure the variables are defined
if (!clientId || !clientSecret || !refreshToken) {
  throw new Error('Missing required environment variables for Spotify API');
}

// In-memory storage for the access token
let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

const getAccessToken = async (): Promise<string> => {
  // Check if the token is cached and not expired
  if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    console.log('Using cached access token');
    return cachedAccessToken;
  }

  console.log('Refreshing access token...');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store', // Ensures no caching of the token response
  });

  if (!response.ok) {
    console.error('Failed to refresh access token:', await response.text());
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiryTime = Date.now() + data.expires_in * 1000; // Set expiry time

  console.log('Access token refreshed successfully. Expires in:', data.expires_in, 'seconds');
  return cachedAccessToken!;
};

const getNowPlaying = async (accessToken: string) => {
  // Fetch currently playing song from Spotify
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 204 || response.status > 400) {
    console.error('Failed to fetch now playing data:', await response.text());
    return null;
  }

  console.log('Fetched now playing data at:', new Date().toISOString());
  return response.json();
};

export async function GET() {
  try {
    // Step 1: Get the Spotify access token
    const accessToken = await getAccessToken();

    // Step 2: Fetch the currently playing song
    const nowPlaying = await getNowPlaying(accessToken);

    if (!nowPlaying || !nowPlaying.is_playing) {
      console.log('No song is currently playing.');
      return NextResponse.json({ isPlaying: false, message: 'No song is currently playing' });
    }

    // Step 3: Parse and return the song data
    const { item } = nowPlaying;
    const name = item.name;
    const artists = item.artists.map((artist: { name: string }) => artist.name).join(', ');
    const albumImage = item.album.images[0].url;

    return NextResponse.json({
      isPlaying: true,
      name,
      artists,
      albumImage,
      progress: nowPlaying.progress_ms, // Current position in the song
      duration: item.duration_ms,      // Total song duration
    });
  } catch (error) {
    console.error('Error fetching now playing data:', error);
    return NextResponse.json({ error: 'Failed to fetch now playing data' }, { status: 500 });
  }
}