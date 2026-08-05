import { NextResponse } from 'next/server';

// Spotify credentials follow the same convention as Strapi: NEXT_PUBLIC_*
// variables in development, unprefixed variables in production.
const isDev = process.env.NODE_ENV === 'development';

const clientId = isDev
  ? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
  : process.env.SPOTIFY_CLIENT_ID || '';
const clientSecret = isDev
  ? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || ''
  : process.env.SPOTIFY_CLIENT_SECRET || '';
const refreshToken = isDev
  ? process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN || ''
  : process.env.SPOTIFY_REFRESH_TOKEN || '';

// Access tokens are valid for an hour; cache in memory to avoid hitting the
// token endpoint on every poll.
let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

const getAccessToken = async (): Promise<string> => {
  if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

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
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to refresh access token:', await response.text());
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  const accessToken: string = data.access_token;
  cachedAccessToken = accessToken;
  tokenExpiryTime = Date.now() + data.expires_in * 1000;
  return accessToken;
};

const getNowPlaying = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  // 204 means nothing is playing.
  if (response.status === 204 || response.status > 400) {
    console.error('Failed to fetch now playing data:', await response.text());
    return null;
  }

  return response.json();
};

export async function GET() {
  try {
    if (!clientId || !clientSecret || !refreshToken) {
      console.error('Missing required environment variables for Spotify API');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const accessToken = await getAccessToken();
    const nowPlaying = await getNowPlaying(accessToken);

    if (!nowPlaying || !nowPlaying.is_playing) {
      return NextResponse.json({ isPlaying: false, message: 'No song is currently playing' });
    }

    const { item } = nowPlaying;
    return NextResponse.json({
      isPlaying: true,
      name: item.name,
      artists: item.artists.map((artist: { name: string }) => artist.name).join(', '),
      albumImage: item.album.images[0].url,
      progress: nowPlaying.progress_ms,
      duration: item.duration_ms,
    });
  } catch (error) {
    console.error('Error fetching now playing data:', error);
    return NextResponse.json({ error: 'Failed to fetch now playing data' }, { status: 500 });
  }
}
