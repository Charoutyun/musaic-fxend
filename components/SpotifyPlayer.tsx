// components/SpotifyPlayer.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Slider from "@/components/ui/Slider";
import { SkipBack, SkipForward, Play, Pause, Volume2, Search, X } from "lucide-react";
import debounce from "lodash.debounce";

interface SpotifyPlayerProps {
  accessToken: string;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SearchResult {
  tracks: {
    items: Array<{
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        images: Array<{ url: string }>;
      };
      uri: string;
    }>;
  };
}

interface TrackWindow {
  current_track: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
  };
  previous_tracks: Array<any>;
  next_tracks: Array<any>;
}

interface PlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: TrackWindow;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ accessToken }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [position, setPosition] = useState<number>(0);

  // Search States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  // Debounced Search Function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === "") {
        setSearchResults(null);
        setIsSearching(false);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await axios.get<SearchResult>(
          `https://api.spotify.com/v1/search`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              q: query,
              type: "track",
              limit: 10,
            },
          }
        );

        setSearchResults(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error searching tracks:", error.response?.data);
          setSearchError(
            error.response?.data?.error?.message || "Failed to fetch search results."
          );
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [accessToken]
  );

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const toggleSearchBar = () => {
    setIsSearchCollapsed(!isSearchCollapsed);
  };

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
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error checking Spotify account type:", error.response?.data);
          alert("Failed to verify Spotify account type.");
        } else {
          console.error("Unexpected error:", error);
        }
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

      // Ready
      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      // Not Ready
      spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Player state changed
      spotifyPlayer.addListener("player_state_changed", (state: PlayerState | null) => {
        if (!state) return;
        setPlayerState(state);
        setPosition(state.position);
      });

      // Connect to the player!
      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    // Cleanup on unmount
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, isPremium]);

  // Update position periodically when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (playerState && !playerState.paused) {
      interval = setInterval(() => {
        player?.getCurrentState().then((state: PlayerState | null) => {
          if (state) {
            setPosition(state.position);
          }
        });
      }, 1000); // Update every second
    }

    // Cleanup
    return () => clearInterval(interval);
  }, [playerState, player]);

  // Playback Controls
  const play = async () => {
    if (!deviceId) {
      console.error("No device ID available.");
      alert("No device ID available. Please ensure the Spotify player is ready.");
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
          uris: ["spotify:track:3AJwUDP919kvQ9QcozQPxg"], // Replace with desired track URI
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error starting playback:", error.response?.data);
        alert(`Failed to start playback: ${error.response?.data?.error?.message || 'Unknown error'}`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const togglePlay = async () => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.togglePlay();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error toggling play:", error.response?.data);
        alert(`Failed to toggle playback: ${error.response?.data?.error?.message || 'Unknown error'}`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const skipToNext = async () => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.nextTrack();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error skipping to next track:", error.response?.data);
        alert(`Failed to skip to next track: ${error.response?.data?.error?.message || 'Unknown error'}`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const skipToPrevious = async () => {
    if (!player) {
      console.error("Spotify Player is not initialized.");
      return;
    }

    try {
      await player.previousTrack();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error skipping to previous track:", error.response?.data);
        alert(`Failed to skip to previous track: ${error.response?.data?.error?.message || 'Unknown error'}`);
      } else {
        console.error("Unexpected error:", error);
      }
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error changing volume:", error.response?.data);
        alert(`Failed to change volume: ${error.response?.data?.error?.message || 'Unknown error'}`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle playing a selected track from search results
  const handlePlayTrack = async (trackUri: string) => {
    if (!deviceId) {
      console.error("No device ID available.");
      alert("No device ID available. Please ensure the Spotify player is ready.");
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
          uris: [trackUri],
        },
      });
      // Collapse the search bar and reset search state
      setIsSearchCollapsed(true);
      setSearchQuery('');
      setSearchResults(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error playing selected track:", error.response?.data);
        alert(`Failed to play track: ${error.response?.data.error.message || 'Unknown error'}`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="bg-black text-white p-8 rounded-lg max-w-6xl w-full mx-auto">
      {/* Toggle Search Bar Button */}
      <div className="flex justify-end mb-4">
        <button onClick={toggleSearchBar} className="text-gray-400 hover:text-white">
          {isSearchCollapsed ? <Search size={24} /> : <X size={24} />}
        </button>
      </div>

      {/* Search Bar and Results */}
      {!isSearchCollapsed && (
        <>
          {/* Search Bar */}
          <div className="mb-6 flex items-center space-x-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for tracks..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Search Results */}
          {isSearching && (
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Searching...</span>
            </div>
          )}
          {searchError && <p className="text-red-500">{searchError}</p>}
          {searchResults && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Search Results:</h3>
              <ul>
                {searchResults.tracks.items.map((track) => (
                  <li
                    key={track.id}
                    className="flex items-center space-x-4 mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md"
                    onClick={() => handlePlayTrack(track.uri)}
                  >
                    <img
                      src={track.album.images[2]?.url || "/placeholder.svg"}
                      alt={`${track.name} cover`}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-gray-400">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img
          src={
            playerState?.track_window.current_track?.album?.images[0]?.url ||
            "/placeholder.svg?height=300&width=300"
          }
          alt={`${
            playerState?.track_window.current_track?.name || "Album"
          } cover`}
          className="w-64 h-64 rounded-md shadow-lg"
        />
        <div className="flex-1 w-full max-w-xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {playerState?.track_window.current_track.name || "No track playing"}
            </h2>
            <p className="text-xl text-gray-400">
              {playerState?.track_window.current_track.artists
                ?.map((artist) => artist.name)
                .join(", ") || "Unknown artist"}
            </p>
          </div>

          {/* Track Progress Slider */}
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

          {/* Playback Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <button
                onClick={skipToPrevious}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={32} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black rounded-full p-4 hover:scale-105 transition-transform"
                aria-label={playerState?.paused ? "Play" : "Pause"}
              >
                {playerState?.paused ? (
                  <Play size={32} fill="black" />
                ) : (
                  <Pause size={32} fill="black" />
                )}
              </button>
              <button
                onClick={skipToNext}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Next track"
              >
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

      {/* Start Playback Button if No Track is Playing */}
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
