import React from "react";
import { Link } from "react-router-dom";

const DetailsTitle = ({ artistId, artistData, songData }) => {
  const artistPath = artistData?.attributes;

  return (
    <div className=" relative w-full flex flex-col">
      <div className=" w-full bg-gradient-to-l from-transparent to-[#839983]/90 h-48 md:h-28">
        <div className=" absolute inset-0 flex items-center">
          <img
            src={
              artistId
                ? artistPath?.artwork?.url
                    .replace("{w}", "500")
                    .replace("{h}", "500")
                : songData?.images?.coverart
            }
            alt=""
            className=" w-48 md:w-24 h-48 md:h-24 rounded-full object-cover border-2 shadow-md shadow-white"
          />
          <div className=" ml-5">
            <p className=" font-bold text-3xl md:text-xl text-white">
              {artistId ? artistPath?.name : songData?.title}
            </p>
            {!artistId && (
              <Link to={`/artists/${songData?.artists[0].adamid}`}>
                <p className=" text-base text-gray-300 mt-1">
                  {songData?.subtitle}
                </p>
              </Link>
            )}
            <p className=" text-base text-gray-300 mt-1">
              {artistData
                ? artistPath?.genreNames[0]
                : songData?.genres?.primary}
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full h-44 md:h-24" />
    </div>
  );
};

export default DetailsTitle;
