import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { moods, moodForHour, greetingForHour, getMood } from "../lib/moods";
import MoodCard from "../components/MoodCard";
import SongCard from "../components/SongCard";
import LikeButton from "../components/LikeButton";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { useNowPlaying } from "../redux/services/playerSelectors";

const NowPlayingHero = ({ song, isPlaying, onToggle }) => (
  <div className="glass-2 rounded-glass-lg p-4 sm:p-5 flex items-center gap-4 mb-8 overflow-hidden relative">
    <div
      className="absolute inset-0 opacity-40 pointer-events-none"
      style={{
        backgroundImage: `url(${song.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(40px)",
      }}
    />
    <div className="absolute inset-0 pointer-events-none bg-black/35" />

    <Link
      to="/now-playing"
      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-glass-sm overflow-hidden flex-shrink-0 shadow-glass"
    >
      <img
        src={song.coverUrl}
        alt={song.title}
        className="w-full h-full object-cover"
      />
    </Link>

    <div className="relative flex-1 min-w-0">
      <p className="text-[10px] text-text-muted font-mono tracking-[0.2em] mb-1">
        {isPlaying ? "PLAYING" : "PAUSED"}
      </p>
      <Link to="/now-playing">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary truncate hover:text-primary transition-colors">
          {song.title}
        </h2>
      </Link>
      <p className="text-xs text-text-secondary truncate mt-0.5">
        {song.artistName}
      </p>
    </div>

    <div className="relative flex items-center gap-1 flex-shrink-0">
      <LikeButton songId={song.id} />
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="w-12 h-12 flex items-center justify-center bg-primary text-on-accent rounded-full shadow-glass-glow hover:bg-primary-light active:scale-95 transition-all"
      >
        {isPlaying ? (
          <BsFillPauseFill className="text-xl" />
        ) : (
          <BsFillPlayFill className="text-xl ml-0.5" />
        )}
      </button>
    </div>
  </div>
);

const Home = () => {
  const controls = usePlayerControls();
  const { activeSong, isPlaying } = useNowPlaying();
  const recentlyPlayed = useSelector((state) => state.player.recentlyPlayed);

  // Read once per render rather than on a ticking clock -- the greeting does
  // not need to update live, and a timer here would re-render the page.
  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const suggestedSlug = moodForHour(hour);
  const suggested = getMood(suggestedSlug);

  const orderedMoods = [
    suggested,
    ...moods.filter((mood) => mood.slug !== suggestedSlug),
  ].filter(Boolean);

  return (
    <div className="flex flex-col animate-fade-in">
      <header className="mt-2 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          {greeting}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          {suggested ? `${suggested.line}. Pick a mood.` : "Pick a mood."}
        </p>
      </header>

      {activeSong?.id && (
        <NowPlayingHero
          song={activeSong}
          isPlaying={isPlaying}
          onToggle={controls.toggle}
        />
      )}

      <section className="mb-8">
        <h2 className="text-[10px] font-bold text-text-muted font-mono tracking-[0.25em] mb-3">
          MOODS
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {orderedMoods.map((mood) => (
            <MoodCard
              key={mood.slug}
              mood={mood}
              suggested={mood.slug === suggestedSlug}
            />
          ))}
        </div>
      </section>

      {recentlyPlayed.length > 0 && (
        <section>
          <h2 className="text-[10px] font-bold text-text-muted font-mono tracking-[0.25em] mb-3">
            PICK UP WHERE YOU LEFT OFF
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {recentlyPlayed.slice(0, 8).map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                data={recentlyPlayed}
                i={i}
                isPlaying={isPlaying}
                activeSong={activeSong}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
