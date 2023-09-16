import React from 'react'
import { useGetChartTracksQuery } from '../redux/services/dataFetch'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Error from '../components/Error'
import ArtistCard from '../components/ArtistCard'

const Artists = () => {

  const {data , isFetching , isLoading , error} = useGetChartTracksQuery()
    const {activeSong, isPlaying} = useSelector(state => state.player)

    if (isFetching) {
        return <Loader />
    } 

    if(isLoading) {
        return <Loader />
    }

    if(error) {
        return <Error />
    }

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top artists</h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data.tracks?.map((track) => <ArtistCard key={track.key} track={track} />)}
      </div>
    </div>
  )
}

export default Artists
