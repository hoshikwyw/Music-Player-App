import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ track }) => {
  const navigate = useNavigate();

  return (
    <div
      className="animate-slideup cursor-pointer"
      onClick={() => navigate(`/artists/${track?.artists[0].adamid}`)}
    >
      <div className="retro-card-interactive p-2 sm:p-2.5">
        <div className="w-full aspect-square overflow-hidden rounded-lg sm:rounded-[10px]">
          <img
            alt={track?.subtitle}
            src={track?.images?.background}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-1.5 sm:mt-2 px-0.5">
          <p className="text-[12px] sm:text-[13px] font-bold text-text-primary truncate">
            {track?.subtitle}
          </p>
          <p className="text-[9px] sm:text-[10px] text-text-muted font-retro-mono mt-0.5">ARTIST</p>
        </div>
      </div>
    </div>
  )
}

export default ArtistCard
