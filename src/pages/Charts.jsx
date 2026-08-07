import { useNowPlaying } from "../redux/services/playerSelectors";
import { Link } from 'react-router-dom'
import { usePlayerControls } from '../hooks/usePlayerControls'
import { BsFillPlayFill, BsFillPauseFill, BsTrophy } from 'react-icons/bs'
import { useChartSongs } from '../api'
import Loader from '../components/Loader'
import Error from '../components/Error'

const Charts = () => {
  const controls = usePlayerControls()
  const { activeSong, isPlaying } = useNowPlaying();
  const { data: chartSongs, isLoading, error } = useChartSongs()

  const handlePlay = (song, i) => controls.playSong(song, chartSongs, i)
  const handlePause = () => controls.pause()

  const isCurrentSong = (song) => activeSong?.id === song.id

  if (isLoading) return <Loader />
  if (error) return <Error />

  const top3 = chartSongs?.slice(0, 3) || []
  const rest = chartSongs?.slice(3) || []

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mt-2 sm:mt-4 mb-5 sm:mb-6">
        <div className="flex items-center gap-2">
          <BsTrophy className="text-primary text-xl sm:text-2xl" />
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Top Charts</h2>
        </div>
        <p className="text-[10px] sm:text-[11px] text-text-muted mt-1 font-retro-mono">
          MOST PLAYED TRACKS WORLDWIDE
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {top3.map((song, i) => {
          const playing = isCurrentSong(song) && isPlaying
          const rankColors = [
            'from-primary/20 to-primary/5 border-primary',
            'from-text-muted/10 to-transparent border-text-muted/40',
            'from-primary-dark/10 to-transparent border-primary-dark/30',
          ]
          const rankLabels = ['1ST', '2ND', '3RD']
          const rankSizes = ['text-[40px] sm:text-[56px]', 'text-[32px] sm:text-[44px]', 'text-[32px] sm:text-[44px]']

          return (
            <div
              key={song.id}
              className={`retro-card p-2.5 sm:p-3 bg-gradient-to-b ${rankColors[i]} cursor-pointer group relative overflow-hidden`}
            >
              {/* Rank number watermark */}
              <span className={`absolute -top-1 -right-1 ${rankSizes[i]} font-black text-border/[0.06] font-retro-mono leading-none select-none`}>
                {i + 1}
              </span>

              {/* Badge */}
              <div className="flex items-center gap-1 mb-2">
                <span className={`retro-badge text-[9px] sm:text-[10px] ${i === 0 ? 'bg-primary text-on-accent border-primary' : 'bg-card'}`}>
                  {rankLabels[i]}
                </span>
              </div>

              {/* Artwork */}
              <div className="relative w-full aspect-square overflow-hidden rounded-lg sm:rounded-[10px] mb-2 sm:mb-3">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 flex items-center justify-center bg-black/35 transition-opacity duration-200 ${
                  playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button
                    onClick={() => playing ? handlePause() : handlePlay(song, i)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary border-2 border-border rounded-full shadow-retro-sm"
                  >
                    {playing ? (
                      <BsFillPauseFill className="text-on-accent text-base sm:text-lg" />
                    ) : (
                      <BsFillPlayFill className="text-on-accent text-base sm:text-lg ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <Link to={`/songs/${song.id}`}>
                <p className="text-[12px] sm:text-[14px] font-bold text-text-primary truncate hover:text-primary transition-colors">
                  {song.title}
                </p>
              </Link>
              <Link to={song.artistId ? `/artists/${song.artistId}` : '#'}>
                <p className="text-[10px] sm:text-[12px] text-text-muted truncate hover:text-primary transition-colors mt-0.5">
                  {song.artistName}
                </p>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Rest of the chart - List */}
      {rest.length > 0 && (
        <div className="retro-card p-2 sm:p-3">
          {rest.map((song, i) => {
            const rank = i + 4
            const playing = isCurrentSong(song) && isPlaying

            return (
              <div
                key={song.id}
                className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg sm:rounded-[10px] cursor-pointer transition-all duration-150 ${
                  playing ? 'bg-primary/8' : 'hover:bg-background-secondary'
                }`}
              >
                {/* Rank */}
                <span className="text-base sm:text-lg font-black text-text-muted/50 font-retro-mono w-7 sm:w-8 text-center flex-shrink-0">
                  {rank}
                </span>

                {/* Artwork */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden flex-shrink-0 relative group">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-150 ${
                    playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <button
                      onClick={() => playing ? handlePause() : handlePlay(song, rank - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-primary rounded-full"
                    >
                      {playing ? (
                        <BsFillPauseFill className="text-on-accent text-xs" />
                      ) : (
                        <BsFillPlayFill className="text-on-accent text-xs ml-px" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/songs/${song.id}`}>
                    <p className="text-[13px] sm:text-sm font-semibold text-text-primary truncate hover:text-primary transition-colors">
                      {song.title}
                    </p>
                  </Link>
                  <Link to={song.artistId ? `/artists/${song.artistId}` : '#'}>
                    <p className="text-[10px] sm:text-[11px] text-text-muted truncate hover:text-primary transition-colors mt-0.5">
                      {song.artistName}
                    </p>
                  </Link>
                </div>

                {/* Genre badge */}
                <span className="hidden sm:inline-flex retro-badge text-[9px] bg-card">
                  {song.genre || 'Music'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Charts
