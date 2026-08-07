import SongBar from "./SongBar";

const RelateSong = ({
  data,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
  artistId,
}) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-bold text-text-primary flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        Related Songs
      </h2>
      <div className="retro-card p-2.5">
        {data?.map((song, i) => (
          <SongBar
            key={`${song?.key}-${artistId}`}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
            handlePauseBtn={handlePauseBtn}
            handlePlayBtn={handlePlayBtn}
          />
        ))}
      </div>
    </div>
  );
};

export default RelateSong;
