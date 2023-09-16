import React from "react";
import SongBar from "./SongBar";

const RelateSong = ({
  data,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
  artistId,
}) => {
  return (
    <div className=" flex flex-col">
      <h1 className=" font-bold text-xl text-[#FFEEF4] main-text">
        Related Songs:{" "}
      </h1>
      <div className=" mt-6 w-full flex flex-col">
        {data?.map((song, i) => (
          <SongBar
            key={`${song?.key}-${artistId}`}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
            handlePauseBtn={handlePauseBtn}
            handlePlayBtn={handlePlayBtn}
          />
        ))}
      </div>
    </div>
  );
};

export default RelateSong;
