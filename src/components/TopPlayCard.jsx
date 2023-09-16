import React from "react";
import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

const TopPlayCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
}) => {
  return (
    <div className=" w-full flex flex-row items-center hover:bg-white/30 bg-opacity-80 py-2 p-4 rounded-lg cursor-pointer mb-2">
      <h3 className=" font-bold text-lg text-white mr-2">{i + 1}.</h3>
      <div className=" flex-1 flex flex-row justify-between items-center">
        <img
          className=" w-16 h-16 rounded-lg"
          src={song?.images?.coverart}
          alt={song?.title}
        />
        <div className=" flex-1 flex flex-col justify-center mx-2">
          <Link to={`/songs/${song.key}`}>
            <p className=" text-lg font-semibold text-white">{song?.title}</p>
          </Link>
          <Link to={`/artists/${song?.artists[0].adamid}`}>
            <p className=" text-sm font-semibold text-[#fffc] mt-1">
              {song?.subtitle}
            </p>
          </Link>
        </div>
      </div>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseBtn}
        handlePlay={handlePlayBtn}
      />
    </div>
  );
};

export default TopPlayCard;
