"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "@/components/ui/Slider";
import { SkipBack, SkipForward, Play, Pause, Volume2 } from "lucide-react";

interface SpotifyPlayerProps {
  accessToken: string;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ accessToken }) => {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<any>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.product === "premium") {
          setIsPremium(true);
        } else {
          alert("You need a Spotify Premium account to use the Web Playback SDK.");
        }
      } catch (error) {
        console.error("Error checking Spotify account type:", error);
      }
    };

    if (accessToken) {
      checkPremium();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !isPremium) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Next.js Spotify Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Error handling
      spotifyPlayer.addListener("initialization_error", ({ message }: { message: string }) => {
        console.error("Initialization Error:", message);
        alert("Failed to initialize Spotify Player.");
      });
      spotifyPlayer.addListener("authentication_error", ({ message }: { message: string }) => {
        console.error("Authentication Error:", message);
        alert("Authentication failed. Please log in again.");
      });
      spotifyPlayer.addListener("account_error", ({ message }: { message: string }) => {
        console.error("Account Error:", message);
        alert("There was an issue with your Spotify account.");
      });
      spotifyPlayer.addListener("playback_error", ({ message }: { message: string }) => {
        console.error("Playback Error:", message);
        alert("Playback error occurred.");
      });

      
      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      
      spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("Device ID has gone offline", device_id);
      });

      
      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setPlayerState(state);
        setPosition(state.position);
      });

      
      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, isPremium]);

  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (playerState && !playerState.paused) {
      interval = setInterval(() => {
        player.getCurrentState().then((state: any) => {
          if (state) {
            setPosition(state.position);
          }
        });
      }, 1000); 
    }

    
    return () => clearInterval(interval);
  }, [playerState, player]);

  const play = async () => {
    if (!deviceId) {
      console.error("No device ID available.");
      return;
    }

    try {
      await axios({
        method: "PUT",
        url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          uris: ["spotify:track:3AJwUDP919kvQ9QcozQPxg"], 
        },
      });
    } catch (error) {
      console.error("Error starting playback:", error);
    }
  };

  const togglePlay = async () => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.togglePlay();
    } catch (error) {
      console.error("Error toggling play:", error);
    }
  };

  const skipToNext = async () => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.nextTrack();
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  const skipToPrevious = async () => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.previousTrack();
    } catch (error) {
      console.error("Error skipping to previous track:", error);
    }
  };

  const handleVolumeChange = async (newVolume: number[]) => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.setVolume(newVolume[0] / 100);
      setVolume(newVolume[0]);
    } catch (error) {
      console.error("Error Volume", error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black text-white p-8 rounded-lg max-w-6xl w-full mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img
          src={playerState?.track_window.current_track.album.images[0]?.url || "/placeholder.svg?height=300&width=300"}
          alt={`${playerState?.track_window.current_track.name || 'Album'} cover`}
          className="w-64 h-64 rounded-md shadow-lg"
        />
        <div className="flex-1 w-full max-w-xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{playerState?.track_window.current_track.name || 'No track playing'}</h2>
            <p className="text-xl text-gray-400">{playerState?.track_window.current_track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown artist'}</p>
          </div>
          
          <div className="mb-8">
            <Slider
              value={[position || 0]}
              max={playerState?.duration || 100}
              step={1000}
              onValueChange={(value) => player?.seek(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>{formatTime(position || 0)}</span>
              <span>{formatTime(playerState?.duration || 0)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <button onClick={skipToPrevious} className="text-gray-400 hover:text-white transition-colors" aria-label="Previous track">
                <SkipBack size={32} />
              </button>
              <button onClick={togglePlay} className="bg-white text-black rounded-full p-4 hover:scale-105 transition-transform" aria-label={playerState?.paused ? "Play" : "Pause"}>
                {playerState?.paused ? <Play size={32} fill="black" /> : <Pause size={32} fill="black" />}
              </button>
              <button onClick={skipToNext} className="text-gray-400 hover:text-white transition-colors" aria-label="Next track">
                <SkipForward size={32} />
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Volume2 size={24} />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-28"
              />
            </div>
          </div>
        </div>
      </div>
      {!playerState && (
        <div className="mt-4">
          <p>No track is currently playing.</p>
          <button
            onClick={play}
            className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
          >
            Start Playback
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;
