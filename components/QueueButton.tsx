import React from 'react';
import useSpotifyQueue from './PlaybackQueue';

interface QueueButtonProps {
  trackUri: string;
  accessToken: string;
}

const QueueButton: React.FC<QueueButtonProps> = ({ trackUri, accessToken }) => {
  const { addToQueue, loading, error } = useSpotifyQueue(accessToken);

  const handleClick = () => {
    addToQueue(trackUri);
  };

  return (
    <div>
      <button 
        onClick={handleClick} 
        disabled={loading} 
        className="flex justify-end bg-green-500 text-white p-4 rounded"
      >
        {loading ? 'Adding to Queue...' : 'Add to Queue'}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default QueueButton;
