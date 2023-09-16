import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import { setActiveSong, playPause } from "../redux/services/PlayerSlice";
import {
  useGetRelateSongQuery,
  useGetSongDetailQuery,
} from "../redux/services/dataFetch";
import Loader from "../components/Loader";
import Error from "../components/Error";
import RelateSong from "../components/RelateSong";

const SongDetail = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { songid } = useParams();

  const {
    data,
    isFetching: isFetchingRelateSong,
    isLoading: isLoadingRelate,
    error: errorInRelate,
  } = useGetRelateSongQuery({ songid });

  // console.log(data);

  const {
    data: songData,
    isLoading: isLoadingSongD,
    isFetching: isFetchingSongD,
    error: errorInSongD,
  } = useGetSongDetailQuery({ songid });

  const handlePauseBtn = () => {
    dispatch(playPause(false));
  };

  const handlePlayBtn = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  // console.log(songData);
  if (isFetchingSongD || isFetchingRelateSong) {
    return <Loader />;
  }

  if (isLoadingSongD || isLoadingRelate) {
    return <Loader />;
  }

  if (errorInRelate || errorInSongD) {
    return <Error />;
  }

  return (
    <div className=" flex flex-col">
      <DetailsTitle artistId="" songData={songData} />
      <div className=" mb-10">
        <h2 className=" text-white text-xl font-bold">Lyrics:</h2>
        <div className=" mt-5">
          {songData?.sections[1].type === "LYRICS" ? (
            songData?.sections[1].text.map((line, i) => (
              <p className=" text-white text-base my-1">{line}</p>
            ))
          ) : (
            <p className=" text-white text-base my-1">
              Sorry , there's no lyrics available!
            </p>
          )}
        </div>
      </div>
      <RelateSong
        data={data}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseBtn={handlePauseBtn}
        handlePlayBtn={handlePlayBtn}
      />
    </div>
  );
};

export default SongDetail;
