
const Loader = () => {
  return (
    <div className="w-full h-[60vh] flex flex-col gap-4 justify-center items-center">
      <div className="w-16 h-16 border-4 border-background-tertiary border-t-primary rounded-full animate-spin" />
      <p className="text-sm font-bold text-text-muted font-retro-mono tracking-widest animate-pulse">
        LOADING...
      </p>
    </div>
  );
};

export default Loader;
