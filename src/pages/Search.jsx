import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSearchSongs } from '../hooks/useSupabase';
import Loader from '../components/Loader';
import Error from '../components/Error';
import SongCard from '../components/SongCard';
import { FiSearch } from 'react-icons/fi';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songs, isFetching, error, isLoading } = useSearchSongs(searchTerm);

  if (isFetching || isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="mt-2 sm:mt-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
          <FiSearch className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
          Results
        </h2>
        <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5">
          Showing results for <span className="font-bold text-primary">&quot;{searchTerm}&quot;</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {songs?.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songs}
            i={i}
          />
        ))}
      </div>
    </div>
  )
}

export default Search
