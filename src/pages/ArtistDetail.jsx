import { useNowPlaying } from "../redux/services/playerSelectors";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { useArtistDetail, useArtistSongs } from "../api";
import Loader from "../components/Loader";
import Error from "../components/Error";
import RelateSong from "../components/RelateSong";

const ArtistDetail = () => {
  const controls = usePlayerControls();
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useNowPlaying();

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

  const handlePauseBtn = () => controls.pause();
  const handlePlayBtn = (selected, i) => controls.playSong(selected, songs, i);

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
