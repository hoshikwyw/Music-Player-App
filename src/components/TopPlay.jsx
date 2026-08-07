import { useNowPlaying } from "../redux/services/playerSelectors";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { Link } from "react-router-dom";
import TopPlayCard from "./TopPlayCard";
import { useChartSongs, useTopArtists } from "../api";

const TopPlay = () => {
  const controls = usePlayerControls();
  const { activeSong, isPlaying } = useNowPlaying();
  const divRef = useRef(null);

  const { data: chartSongs } = useChartSongs();
  const { data: artistsData } = useTopArtists();

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const topPlays = chartSongs?.slice(0, 5) || [];
  const topArtists = artistsData?.slice(0, 8) || [];

  const handlePauseBtn = () => controls.pause();
  const handlePlayBtn = (song, i) => controls.playSong(song, topPlays, i);

  return (
    <div
      ref={divRef}
      className="w-[280px] xl:w-[310px] flex flex-col gap-3"
    >
      {/* Charts */}
      <div className="retro-card p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Charts
          </h3>
          <Link to="/charts" className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors font-retro-mono">
            SEE MORE
          </Link>
        </div>
        <div className="flex flex-col">
          {topPlays?.map((song, i) => (
            <TopPlayCard
              key={song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseBtn={handlePauseBtn}
              handlePlayBtn={() => handlePlayBtn(song, i)}
            />
          ))}
        </div>
      </div>

      {/* Artists */}
      <div className="retro-card p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Top Artists
          </h3>
          <Link to="/artists" className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors font-retro-mono">
            SEE MORE
          </Link>
        </div>
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
        >
          {topArtists?.map((artist) => (
            <SwiperSlide
              key={artist.id}
              style={{ width: "48px", height: "auto" }}
              className="animate-slideright"
            >
              <Link to={`/artists/${artist.id}`}>
                <div className="w-12 h-12 rounded-full border border-glass-border overflow-hidden hover:border-primary transition-colors">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;
