import { useState } from "react";
import { genres } from "../assets/constants";
import SongCard from "../components/SongCard";
import RetroDropdown from "../components/RetroDropdown";
import { useSongs } from "../hooks/useSupabase";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useSelector } from "react-redux";

const Discover = () => {
  const [genre, setGenre] = useState("POP");
  const [page, setPage] = useState(1);
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data, isFetching, isLoading, error } = useSongs(genre);

  const pageSize = 20;
  const total = data?.length || 0;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data?.slice(start, end);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mt-2 sm:mt-4 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Discover</h2>
          <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5 font-retro-mono hidden sm:block">
            FIND YOUR NEXT FAVORITE TRACK
          </p>
        </div>
        <RetroDropdown
          options={genres}
          value={genre}
          onChange={(val) => {
            setGenre(val);
            setPage(1);
          }}
          placeholder="Select Genre"
        />
      </div>

      {isFetching || isLoading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="retro-badge bg-surface border-2 border-border px-3 py-1 text-[10px] sm:text-xs tracking-wide font-retro-mono">
              {Math.min(end, total)} of {total} songs
            </div>
            <div className="flex-1 h-[2px] bg-border opacity-30 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {paginatedData?.map((song, i) => (
              <SongCard
                key={song.key}
                song={song}
                data={data}
                i={i}
                isPlaying={isPlaying}
                activeSong={activeSong}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-6 mb-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="retro-btn !px-3 !py-1.5 sm:!px-4 sm:!py-2 !text-xs sm:!text-sm"
            >
              Prev
            </button>
            <span className="retro-badge bg-primary text-white border-primary text-[10px] sm:text-xs">
              {page} / {Math.ceil(total / pageSize)}
            </span>
            <button
              disabled={end >= total}
              onClick={() => setPage((p) => p + 1)}
              className="retro-btn !px-3 !py-1.5 sm:!px-4 sm:!py-2 !text-xs sm:!text-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Discover;
