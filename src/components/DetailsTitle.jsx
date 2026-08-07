import { Link } from "react-router-dom";

// Renders either an artist header or a song header, depending on which of the
// two is passed.
const DetailsTitle = ({ artist, song }) => {
  const coverUrl = artist ? artist.avatarUrl : song?.coverUrl;
  const heading = artist ? artist.name : song?.title;
  const badge = artist ? artist.genres[0] : song?.genre;

  return (
    <div className="w-full mb-4 sm:mb-5">
      <div className="glass-2 rounded-glass p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-glass-sm sm:rounded-glass border border-glass-border overflow-hidden flex-shrink-0 shadow-glass">
          <img src={coverUrl} alt={heading} className="w-full h-full object-cover" />
        </div>
        <div className="text-center sm:text-left min-w-0">
          <h1 className="font-bold text-lg sm:text-xl text-text-primary">{heading}</h1>

          {song && (
            <Link
              to={`/artists/${song.artistId}`}
              className="text-[13px] sm:text-sm text-primary hover:text-primary-dark transition-colors font-semibold"
            >
              {song.artistName}
            </Link>
          )}

          {artist && artist.songCount > 0 && (
            <p className="text-[11px] sm:text-xs text-text-muted mt-0.5">
              {artist.songCount} {artist.songCount === 1 ? "track" : "tracks"}
              {artist.totalPlays > 0 && ` · ${artist.totalPlays} plays`}
            </p>
          )}

          {badge && (
            <div className="mt-1.5">
              <span className="glass-badge !text-primary text-[10px] sm:text-xs">
                {badge}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsTitle;
