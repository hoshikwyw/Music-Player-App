import { useParams, Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useNowPlaying } from "../redux/services/playerSelectors";
import { useSearchSongs } from '../api';
import Loader from '../components/Loader';
import Error from '../components/Error';
import SongCard from '../components/SongCard';

const Search = () => {
  const { searchTerm } = useParams();
  const term = decodeURIComponent(searchTerm ?? '');
  const { activeSong, isPlaying } = useNowPlaying();
  const { data: songs, isLoading, error } = useSearchSongs(term);

  if (isLoading) return <Loader label="Searching" />;
  if (error) return <Error />;

  const hasResults = songs?.length > 0;

  return (
    <div className="flex flex-col animate-fade-in">
      <header className="mt-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
          <FiSearch className="text-primary w-5 h-5" />
          {term}
        </h1>
        <p className="text-xs text-text-muted mt-1">
          {hasResults
            ? `${songs.length} ${songs.length === 1 ? 'match' : 'matches'}`
            : 'No matches'}
        </p>
      </header>

      {hasResults ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {songs.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              data={songs}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-sm text-text-secondary">
            Nothing matched that.
          </p>
          <Link to="/" className="glass-btn mt-2 !text-xs">
            Back to moods
          </Link>
        </div>
      )}
    </div>
  );
};

export default Search;
