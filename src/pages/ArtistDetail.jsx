import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import { setActiveSong, playPause } from "../redux/services/PlayerSlice";
import { useArtistDetail, useArtistSongs } from "../api";
import Loader from "../components/Loader";
import Error from "../components/Error";
import RelateSong from "../components/RelateSong";

const ArtistDetail = () => {
  const dispatch = useDispatch();
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: artist,
    isLoading: isLoadingArtist,
    error: errorArtist,
  } = useArtistDetail(artistId);

  const {
    data: songs,
    isLoading: isLoadingSongs,
    error: errorSongs,
  } = useArtistSongs(artistId);

  const handlePauseBtn = () => dispatch(playPause(false));

  const handlePlayBtn = (selected, i) => {
    dispatch(setActiveSong({ song: selected, data: songs, i }));
    dispatch(playPause(true));
  };

  if (isLoadingArtist || isLoadingSongs) return <Loader />;
  if (errorArtist || errorSongs) return <Error />;

  return (
    <div className="flex flex-col mt-4">
      <DetailsTitle artist={artist} />
      <RelateSong
        title="Songs"
        data={songs}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseBtn={handlePauseBtn}
        handlePlayBtn={handlePlayBtn}
        showAlbum
      />
    </div>
  );
};

export default ArtistDetail;
