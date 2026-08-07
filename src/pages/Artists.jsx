import ArtistCard from '../components/ArtistCard'
import { useArtists } from '../api'
import Loader from '../components/Loader'
import Error from '../components/Error'

const Artists = () => {
  const { data: artists, isLoading, error } = useArtists()

  if (isLoading) return <Loader />
  if (error) return <Error />

  return (
    <div className="flex flex-col">
      <div className="mt-2 sm:mt-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Top Artists</h2>
        <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5 font-retro-mono hidden sm:block">
          TRENDING ARTISTS RIGHT NOW
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {artists?.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  )
}

export default Artists
