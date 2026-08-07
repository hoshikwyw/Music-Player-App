import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useIsLiked, useLikeSong, useUnlikeSong } from "../api";

const LikeButton = ({ songId, size = 16, className = "" }) => {
  const isLiked = useIsLiked(songId);
  const { mutate: like, isPending: liking } = useLikeSong();
  const { mutate: unlike, isPending: unliking } = useUnlikeSong();

  if (!songId) return null;

  const pending = liking || unliking;

  return (
    <button
      onClick={() => (isLiked ? unlike(songId) : like(songId))}
      disabled={pending}
      aria-label={isLiked ? "Remove from liked" : "Add to liked"}
      aria-pressed={isLiked}
      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-50 ${
        isLiked ? "text-danger" : "text-text-muted hover:text-text-primary"
      } ${className}`}
    >
      {isLiked ? <BsHeartFill size={size} /> : <BsHeart size={size} />}
    </button>
  );
};

export default LikeButton;
