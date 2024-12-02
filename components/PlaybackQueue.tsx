import { useState } from 'react';

const useSpotifyQueue = (accessToken: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToQueue = async (trackUri: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add track to queue');
      }

      // Track added successfully
      console.log('Track added to queue');
    } catch (err) {
      setError('Failed to add track to queue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { addToQueue, loading, error };
};

export default useSpotifyQueue;
