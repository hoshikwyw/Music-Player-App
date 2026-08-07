import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import { setActiveSong, playPause } from "../redux/services/PlayerSlice";
import { useSongDetail, useRelatedSongs } from "../api";
import Loader from "../components/Loader";
import Error from "../components/Error";
import RelateSong from "../components/RelateSong";

const SongDetail = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { songid } = useParams();

  const {
    data: song,
    isLoading: isLoadingSong,
    error: errorSong,
  } = useSongDetail(songid);

  const {
    data: relatedSongs,
    isLoading: isLoadingRelated,
    error: errorRelated,
  } = useRelatedSongs(songid);

  const handlePauseBtn = () => dispatch(playPause(false));

  const handlePlayBtn = (selected, i) => {
    dispatch(setActiveSong({ song: selected, data: relatedSongs, i }));
    dispatch(playPause(true));
  };

  if (isLoadingSong || isLoadingRelated) return <Loader />;
  if (errorSong || errorRelated) return <Error />;

  return (
    <div className="flex flex-col mt-2 sm:mt-4">
      <DetailsTitle song={song} />

      <div className="retro-card p-3 sm:p-4 mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-1.5 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Lyrics
        </h2>
        <div className="retro-divider mb-2 sm:mb-3" />
        {song?.lyrics.length ? (
          <div className="space-y-0.5">
            {song.lyrics.map((line, i) => (
              <p
                key={i}
                className="text-[13px] sm:text-sm text-text-secondary leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-[13px] sm:text-sm text-text-muted italic">
            No lyrics available for this song.
          </p>
        )}
      </div>

      <RelateSong
        data={relatedSongs}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseBtn={handlePauseBtn}
        handlePlayBtn={handlePlayBtn}
      />
    </div>
  );
};

export default SongDetail;
