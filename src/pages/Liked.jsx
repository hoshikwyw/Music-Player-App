import { useSelector } from 'react-redux'
import SongCard from '../components/SongCard'
import { useLikedSongs } from '../hooks/useSupabase'
import { BsHeartFill } from 'react-icons/bs'
import Loader from '../components/Loader'
import Error from '../components/Error'

const Liked = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const { data: likedSongs, isLoading, error } = useLikedSongs()

  if (isLoading) return <Loader />
  if (error) return <Error />

  return (
    <div className="flex flex-col">
      <div className="mt-2 sm:mt-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
          Liked Songs
          <BsHeartFill className="text-danger text-sm sm:text-base" />
        </h2>
        <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5 font-retro-mono hidden sm:block">
          YOUR FAVORITE COLLECTION
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {likedSongs?.map((song, i) => (
          <SongCard
            key={`${song.key}-${i}`}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={likedSongs}
            i={i}
          />
        ))}
      </div>
    </div>
  )
}

export default Liked
