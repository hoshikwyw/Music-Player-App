import SongBar from "./SongBar";

const RelateSong = ({
  title = "Related Songs",
  data,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
  showAlbum = false,
}) => (
  <div className="flex flex-col">
    <h2 className="text-lg font-bold text-text-primary flex items-center gap-1.5 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {title}
    </h2>
    <div className="glass-2 rounded-glass p-2.5">
      {data?.length ? (
        data.map((song, i) => (
          <SongBar
            key={song.id}
            song={song}
            i={i}
            isPlaying={isPlaying}
            activeSong={activeSong}
            handlePauseBtn={handlePauseBtn}
            handlePlayBtn={handlePlayBtn}
            showAlbum={showAlbum}
          />
        ))
      ) : (
        <p className="text-[13px] text-text-muted italic p-2">No songs to show.</p>
      )}
    </div>
  </div>
);

export default RelateSong;
