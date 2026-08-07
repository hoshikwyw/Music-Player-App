import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import { setActiveSong, playPause } from "../redux/services/PlayerSlice";
import { useSongDetail, useRelatedSongs } from "../hooks/useSupabase";
import Loader from "../components/Loader";
import Error from "../components/Error";
import RelateSong from "../components/RelateSong";

const SongDetail = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { songid } = useParams();

  const {
    data: relatedData,
    isFetching: isFetchingRelated,
    isLoading: isLoadingRelated,
    error: errorRelated,
  } = useRelatedSongs(songid);

  const {
    data: songData,
    isLoading: isLoadingSong,
    isFetching: isFetchingSong,
    error: errorSong,
  } = useSongDetail(songid);

  const handlePauseBtn = () => {
    dispatch(playPause(false));
  };

  const handlePlayBtn = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedData, i }));
    dispatch(playPause(true));
  };

  if (isFetchingSong || isFetchingRelated) return <Loader />;
  if (isLoadingSong || isLoadingRelated) return <Loader />;
  if (errorRelated || errorSong) return <Error />;

  return (
    <div className="flex flex-col mt-2 sm:mt-4">
      <DetailsTitle artistId="" songData={songData} />

      <div className="retro-card p-3 sm:p-4 mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-1.5 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Lyrics
        </h2>
        <div className="retro-divider mb-2 sm:mb-3" />
        {songData?.sections[1].type === "LYRICS" ? (
          <div className="space-y-0.5">
            {songData?.sections[1].text.map((line, i) => (
              <p key={i} className="text-[13px] sm:text-sm text-text-secondary leading-relaxed">
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
        data={relatedData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseBtn={handlePauseBtn}
        handlePlayBtn={handlePlayBtn}
      />
    </div>
  );
};

export default SongDetail;
