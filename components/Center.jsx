import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { signOut } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/solid";

import useSpotify from "../hooks/useSpotify";
import {
  playlistIdState,
  playlistState,
  playlistSongsState,
} from "../atoms/playlistAtom";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [playlistSongs, setPlaylistSongs] = useRecoilState(playlistSongsState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then(({ body }) => {
        setPlaylist(body);
        setPlaylistSongs(
          body.tracks.items.map((item) => ({
            id: item.track.id,
            uri: item.track.uri,
          }))
        );
      })
      .catch((err) => console.log("error in getting playlist", err));
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          {session?.user.image ? (
            <img
              className="rounded-full w-10 h-10"
              src={session.user.image}
              alt="User image"
              width="40"
              height="40"
            />
          ) : (
            <UserCircleIcon className="h5 w-5" />
          )}
          <h2>{session?.user.name}</h2>
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images[0]?.url.replace("large", "medium")}
          alt={playlist?.name}
          width="176"
          height="176"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
