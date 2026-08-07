import { useParams, Link } from "react-router-dom";
import { BsShuffle, BsFillPlayFill } from "react-icons/bs";
import { useMoodSongs } from "../api/moods";
import { getMood } from "../lib/moods";
import SongCard from "../components/SongCard";
import Loader from "../components/Loader";
import Error from "../components/Error";
import NotFound from "./NotFound";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { useNowPlaying } from "../redux/services/playerSelectors";

const Mood = () => {
  const { slug } = useParams();
  const controls = usePlayerControls();
  const { activeSong, isPlaying } = useNowPlaying();

  const mood = getMood(slug);
  const { data: songs, isLoading, error } = useMoodSongs(slug);

  if (!mood) return <NotFound />;
  if (isLoading) return <Loader label={mood.name} />;
  if (error) return <Error />;

  const hasSongs = songs?.length > 0;

  const startFromTop = () => controls.playSong(songs[0], songs, 0);

  const startShuffled = () => {
    const index = Math.floor(Math.random() * songs.length);
    controls.playSong(songs[index], songs, index);
    if (!isPlaying || activeSong?.id !== songs[index].id) controls.play();
  };

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Mood header, washed in the mood's own colours */}
      <header className="glass-2 rounded-glass-lg relative overflow-hidden p-5 sm:p-7 mb-6 mt-2">
        <div
          className="absolute inset-0 opacity-[0.3] pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${mood.from} 0%, ${mood.to} 100%)`,
          }}
        />
        <div
          className="absolute -right-10 -top-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: mood.to, filter: "blur(60px)", opacity: 0.4 }}
        />

        <div className="relative">
          <Link
            to="/"
            className="text-[10px] text-text-muted font-mono tracking-[0.2em] hover:text-text-primary transition-colors"
          >
            &larr; MOODS
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-2">
            {mood.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">{mood.line}</p>

          {hasSongs && (
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={startFromTop}
                className="glass-btn glass-btn-accent"
              >
                <BsFillPlayFill className="text-lg" />
                Play
              </button>
              <button onClick={startShuffled} className="glass-btn">
                <BsShuffle className="text-sm" />
                Shuffle
              </button>
              <span className="text-[11px] text-text-muted font-mono ml-auto tabular-nums">
                {songs.length} {songs.length === 1 ? "track" : "tracks"}
              </span>
            </div>
          )}
        </div>
      </header>

      {hasSongs ? (
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
            Nothing tagged for {mood.name} yet.
          </p>
          <p className="text-xs text-text-muted text-center max-w-xs">
            Moods draw from track categories. Set a category on your songs in
            the admin dashboard and they will show up here.
          </p>
          <Link to="/mood/everything" className="glass-btn mt-2 !text-xs">
            Browse everything
          </Link>
        </div>
      )}
    </div>
  );
};

export default Mood;
