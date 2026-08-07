import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import { useArtistDetail } from "../hooks/useSupabase";
import Loader from "../components/Loader";
import Error from "../components/Error";
import RelateSong from "../components/RelateSong";

const ArtistDetail = () => {
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: artistData,
    isLoading: isLoadingArtist,
    isFetching: isFetchingArtist,
    error: errorInArtist,
  } = useArtistDetail(artistId);

  if (isFetchingArtist) return <Loader />;
  if (isLoadingArtist) return <Loader />;
  if (errorInArtist) return <Error />;

  return (
    <div className="flex flex-col mt-4">
      <DetailsTitle artistId={artistId} artistData={artistData.data[0]} />
      <RelateSong
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />
    </div>
  );
};

export default ArtistDetail;
