import React, { useEffect, useState } from "react";
import { genres } from "../assets/constants";
import SongCard from "../components/SongCard";
import axios from "axios";
import { useGetChartTracksQuery } from "../redux/services/dataFetch";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useDispatch, useSelector } from "react-redux";



const Discover = () => {
  const dispatch = useDispatch()
  const { activeSong, isPlaying} = useSelector((state) => (state.player))
  const { data, isFetching, isLoading, error } = useGetChartTracksQuery();
  const genreTitle = "Pop";
  console.log(data);

  if (isFetching) {return <Loader />};

  if (isLoading) {return <Loader />};

  if (error) {return <Error />};

  return (
    <div className=" flex flex-col">
      <div className=" w-full flex justify-between items-center md:flex-row flex-col mt-4 mb-10">
        <h2 className=" font-bold text-3xl">Discover</h2>
        <select
          id=""
          className=" bg-black text-gray-300 px-2 py-1 text-sm rounded-lg outline-none mt-0 md:mt-5">
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>
      <div className=" flex flex-wrap justify-start md:justify-center gap-8">
        {data.tracks?.map((songs, i) => (
          <SongCard key={songs.key} song={songs} data={data.tracks} i={i} isPlaying={isPlaying} activeSong={activeSong} />
        ))}
      </div>
    </div>
  );
};

export default Discover;
