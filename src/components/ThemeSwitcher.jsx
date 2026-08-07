import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { HiOutlineColorSwatch } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';

const ThemeSwitcher = () => {
  const { currentTheme, themeNames, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 flex items-center justify-center bg-surface border-2 border-border rounded-[10px] shadow-retro-sm hover:shadow-retro transition-all duration-150 text-text-primary"
        aria-label="Change theme"
      >
        <HiOutlineColorSwatch className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 bg-card border-2 border-border rounded-retro-sm shadow-retro z-50 py-1">
            <div className="px-3 py-2 border-b border-border/20">
              <h3 className="text-xs font-bold text-text-primary">Themes</h3>
            </div>
            {themeNames.map((theme) => (
              <button
                key={theme.key}
                onClick={() => {
                  changeTheme(theme.key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-100 flex items-center justify-between ${
                  currentTheme === theme.key
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-secondary hover:bg-primary/8'
                }`}
              >
                {theme.name}
                {currentTheme === theme.key && <BsCheck2 className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
