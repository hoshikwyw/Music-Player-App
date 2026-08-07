import { Link } from "react-router-dom";
import { BsMusicNoteBeamed } from "react-icons/bs";

const NotFound = () => (
  <div className="flex flex-col justify-center items-center w-full h-[60vh] gap-3">
    <div className="w-14 h-14 flex items-center justify-center bg-primary/10 border-2 border-border rounded-retro">
      <BsMusicNoteBeamed className="text-primary text-xl" />
    </div>
    <h2 className="font-bold text-2xl text-text-primary">404</h2>
    <p className="text-xs text-text-muted text-center">
      That track isn&apos;t in the crate.
    </p>
    <Link to="/" className="retro-btn mt-1">
      Back to Discover
    </Link>
  </div>
);

export default NotFound;
