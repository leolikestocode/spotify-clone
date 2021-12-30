import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { playlistSongsState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

const getCurrentIndexSong = (playlistSongs, currentTrackId) =>
  playlistSongs.findIndex((song) => song.id === currentTrackId);

function Player() {
  const spotifyApi = useSpotify();
  const [msProgress, setMsProgress] = useState(0);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const { data: session } = useSession();
  const songInfo = useSongInfo();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const playlistSongs = useRecoilValue(playlistSongsState);
  const [volume, setVolume] = useState(50);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(({ body }) => {
      if (body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
        return;
      }
      spotifyApi.play();
      setIsPlaying(true);
    });
  };

  const playSong = (handler) => {
    const currentIndexSong = getCurrentIndexSong(playlistSongs, currentTrackId);

    if (
      (currentIndexSong === 0 && handler === "prev") ||
      (currentIndexSong === playlistSongs.length - 1 && handler === "next")
    ) {
      return;
    }

    const songIndex =
      handler === "next" ? currentIndexSong + 1 : currentIndexSong - 1;

    const track = playlistSongs[songIndex];

    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch(() => {});
    }, 100),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    const currentIndexSong = getCurrentIndexSong(playlistSongs, currentTrackId);

    setIsPrevDisabled(currentIndexSong === 0);
    setIsNextDisabled(currentIndexSong === playlistSongs.length - 1);
  }, [currentTrackId]);

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    setTimeout(() => {
      spotifyApi.getMyCurrentPlayingTrack().then(({ body }) => {
        setMsProgress(body.progress_ms);
        if (body.progress_ms === 0) {
          playSong("next");
        }
      });
    }, 2000);
  }, [msProgress, currentTrackId]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => !isPrevDisabled && playSong("prev")}
          className={`button ${
            isPrevDisabled ? "opacity-50 cursor-default" : ""
          }`}
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="button w-10 h-10 opacity-50"
          />
        )}

        <FastForwardIcon
          onClick={() => !isNextDisabled && playSong("next")}
          className={`button ${
            isNextDisabled ? "opacity-50 cursor-default" : ""
          }`}
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          type="range"
          className="w-14 md:w-28"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
