import { Link } from "react-router-dom";
import { BsHeart, BsShuffle, BsFillPlayFill } from "react-icons/bs";
import { useNowPlaying } from "../redux/services/playerSelectors";
import { usePlayerControls } from "../hooks/usePlayerControls";
import SongCard from "../components/SongCard";
import { useLikedSongs } from "../api";
import Loader from "../components/Loader";
import Error from "../components/Error";

const Liked = () => {
  const controls = usePlayerControls();
  const { activeSong, isPlaying } = useNowPlaying();
  const { data: likedSongs, isLoading, error } = useLikedSongs();

  if (isLoading) return <Loader label="Liked" />;
  if (error) return <Error />;

  const hasSongs = likedSongs?.length > 0;

  const startShuffled = () => {
    const index = Math.floor(Math.random() * likedSongs.length);
    controls.playSong(likedSongs[index], likedSongs, index);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <header className="mt-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Liked
        </h1>
        <p className="text-xs text-text-muted mt-1">
          {hasSongs
            ? `${likedSongs.length} ${likedSongs.length === 1 ? "track" : "tracks"} you kept`
            : "Nothing kept yet"}
        </p>

        {hasSongs && (
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => controls.playSong(likedSongs[0], likedSongs, 0)}
              className="glass-btn glass-btn-accent"
            >
              <BsFillPlayFill className="text-lg" />
              Play
            </button>
            <button onClick={startShuffled} className="glass-btn">
              <BsShuffle className="text-sm" />
              Shuffle
            </button>
          </div>
        )}
      </header>

      {hasSongs ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {likedSongs.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              data={likedSongs}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              showLike
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-glass-sm"
            style={{
              background: "var(--glass-tint-strong)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <BsHeart className="text-text-muted text-xl" />
          </div>
          <p className="text-sm text-text-secondary">Nothing liked yet.</p>
          <p className="text-xs text-text-muted text-center max-w-xs">
            Tap the heart while something is playing and it lands here.
          </p>
          <Link to="/" className="glass-btn mt-1 !text-xs">
            Find something
          </Link>
        </div>
      )}
    </div>
  );
};

export default Liked;
