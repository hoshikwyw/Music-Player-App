import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsTitle from "../components/DetailsTitle";
import {
 useGetArtistDetailQuery
} from "../redux/services/dataFetch";
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
  } = useGetArtistDetailQuery({ artistId });

  console.log(artistData.data[0]);

  if (isFetchingArtist) {
    return <Loader />;
  }

  if (isLoadingArtist) {
    return <Loader />;
  }

  if (errorInArtist) {
    return <Error />;
  }

  return (
    <div className=" flex flex-col">
      <DetailsTitle artistId={artistId} artistData={artistData.data[0]} />
      
      <RelateSong
        // data={Object.values(artistData?.songs)}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />
    </div>
  );
};

export default ArtistDetail;
