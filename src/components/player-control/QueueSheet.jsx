import { BsHeadphones } from "react-icons/bs";
import { formatTime } from "../../lib/formatTime";

// Rows use .glass-flat, not a blurred pane: a backdrop-filter per row forces a
// compositing layer per row and wrecks scrolling. This sheet is already sitting
// on glass, so a second blur would only turn it to mud.
const QueueSheet = ({ songs, currentIndex, onSelect }) => (
  <div className="glass-2 rounded-glass w-full p-3 animate-slideup">
    <div className="flex items-center gap-2 mb-3 px-1">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      <h3 className="text-sm font-bold text-text-primary">Up next</h3>
      <span className="text-[10px] text-text-muted font-mono ml-auto tracking-wider">
        {songs.length} {songs.length === 1 ? "TRACK" : "TRACKS"}
      </span>
    </div>

    <div className="flex flex-col gap-0.5 max-h-[280px] overflow-y-auto hide-scrollbar">
      {songs.map((song, i) => {
        const isCurrent = i === currentIndex;

        return (
          <button
            key={song.id}
            onClick={() => onSelect(song, i)}
            aria-current={isCurrent ? "true" : undefined}
            className={`flex items-center gap-2.5 py-2 px-2 rounded-glass-sm text-left transition-colors ${
              isCurrent ? "bg-primary/12" : "glass-flat"
            }`}
          >
            <span className="w-5 text-center flex-shrink-0">
              {isCurrent ? (
                <BsHeadphones className="text-primary mx-auto text-xs" />
              ) : (
                <span className="text-[10px] font-bold text-text-muted font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
            </span>

            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={song.coverUrl}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-[12px] font-semibold truncate ${
                  isCurrent ? "text-primary" : "text-text-primary"
                }`}
              >
                {song.title}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {song.artistName}
              </p>
            </div>

            {song.duration > 0 && (
              <span className="text-[10px] text-text-muted font-mono tabular-nums flex-shrink-0">
                {formatTime(song.duration)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default QueueSheet;
