import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { playPause, setActiveSong } from "../redux/services/PlayerSlice";
import { useGetChartTracksQuery } from "../redux/services/dataFetch";
import { Link } from "react-router-dom";
import TopPlayCard from "./TopPlayCard";

// const TopPlayCard = ({song,i}) => (
//   <div className=" w-full flex flex-row items-center hover:bg-white py-2 p-4 rounded-lg cursor-pointer mb-2">
//     {song.title}
//   </div>
// )

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data } = useGetChartTracksQuery();
  const divRef = useRef(null);

  // console.log(data);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const topPlays = data?.tracks?.slice(0, 5);

  const handlePauseBtn = () => {
    dispatch(playPause(false));
  };

  const handlePlayBtn = (song,i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div
      ref={divRef}
      className=" xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[400px] max-w-full flex flex-col">
      <div className=" w-full flex flex-col">
        <div className=" flex flex-row justify-between items-center">
          <h2 className=" font-bold text-lg text-[#FFEEF4] main-text">
            Charts
          </h2>
          <Link to={"/charts"}>
            <p className=" font-semibold text-[#FFEEF4] main-text">See More</p>
          </Link>
        </div>
        <div className=" mt-4 flex flex-col gap-1">
          {topPlays?.map((song, i) => (
            <TopPlayCard
              key={song.key}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseBtn={handlePauseBtn}
              handlePlayBtn={() => handlePlayBtn(song,i) }
            />
          ))}
        </div>
        <div className=" w-full flex flex-col mt-6">
          <div className=" flex flex-row justify-between items-center">
            <h2 className=" font-bold text-lg text-[#FFEEF4] main-text">
              Artists
            </h2>
            <Link to={"/artists"}>
              <p className=" font-semibold text-[#FFEEF4] main-text">
                See More
              </p>
            </Link>
          </div>
          <Swiper
            slidesPerView="auto"
            spaceBetween={15}
            freeMode
            centeredSlides
            centeredSlidesBounds
            modules={[FreeMode]}
            className=" mt-4">
            {topPlays?.map((song, i) => (
              <SwiperSlide
                key={song?.key}
                style={{ width: "25%", height: "auto" }}
                className=" shadow-lg rounded-full animate-slideright">
                <Link to={`/artists/${song?.artists[0].adamid}`}>
                  <img
                    src={song?.images.background}
                    alt="artist"
                    className=" rounded-full w-full object-cover"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TopPlay;
