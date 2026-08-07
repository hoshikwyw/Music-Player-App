import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsMoon, BsMoonFill } from "react-icons/bs";
import { setSleepTimer } from "../redux/services/PlayerSlice";

const OPTIONS = [15, 30, 45, 60];

function remainingLabel(endsAt) {
  const minutes = Math.max(0, Math.ceil((endsAt - Date.now()) / 60_000));
  return `${minutes}m`;
}

const SleepTimer = () => {
  const dispatch = useDispatch();
  const endsAt = useSelector((state) => state.player.sleepTimerEndsAt);
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState(() => (endsAt ? remainingLabel(endsAt) : ""));

  // Only ticks while a timer is set.
  useEffect(() => {
    if (!endsAt) {
      setLabel("");
      return undefined;
    }

    setLabel(remainingLabel(endsAt));
    const interval = setInterval(() => setLabel(remainingLabel(endsAt)), 30_000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const choose = (minutes) => {
    dispatch(setSleepTimer(minutes));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={endsAt ? `Sleep timer, ${label} left` : "Set sleep timer"}
        aria-expanded={isOpen}
        className={`h-9 flex items-center justify-center gap-1.5 rounded-full transition-colors ${
          endsAt
            ? "text-primary px-3"
            : "w-9 text-text-muted hover:text-text-primary"
        }`}
      >
        {endsAt ? <BsMoonFill size={14} /> : <BsMoon size={14} />}
        {endsAt && (
          <span className="text-[11px] font-mono tabular-nums">{label}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="glass-3 absolute bottom-full mb-2 left-0 w-44 rounded-glass z-50 py-1 animate-fade-in">
            <p className="px-3 py-2 text-[10px] font-bold text-text-muted font-mono tracking-widest">
              STOP PLAYING IN
            </p>
            <div className="glass-divider mb-1" />
            {OPTIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => choose(minutes)}
                className="w-full text-left px-3 py-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                {minutes} minutes
              </button>
            ))}
            {endsAt && (
              <>
                <div className="glass-divider my-1" />
                <button
                  onClick={() => choose(null)}
                  className="w-full text-left px-3 py-2 text-[13px] text-danger hover:opacity-80 transition-opacity"
                >
                  Cancel timer
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SleepTimer;
