import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs"

const PlayPause = ({ isPlaying, activeSong, song, handlePause, handlePlay }) => (
  isPlaying && activeSong?.attributes.name === song.attributes.name ? (
    <button
      onClick={handlePause}
      className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-primary border-2 border-border rounded-full shadow-retro-sm hover:bg-primary-light transition-colors"
    >
      <BsFillPauseFill className="text-white text-sm sm:text-lg" />
    </button>
  ) : (
    <button
      onClick={handlePlay}
      className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-primary border-2 border-border rounded-full shadow-retro-sm hover:bg-primary-light transition-colors"
    >
      <BsFillPlayFill className="text-white text-sm sm:text-lg ml-0.5" />
    </button>
  )
)

export default PlayPause
