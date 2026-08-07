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
        className="glass-btn w-9 h-9 !p-0"
        aria-label="Change vibe"
        aria-expanded={isOpen}
      >
        <HiOutlineColorSwatch className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="glass-3 absolute right-0 mt-2 w-48 rounded-glass z-50 py-1 overflow-hidden animate-fade-in">
            <div className="px-3 py-2">
              <h3 className="text-[10px] font-bold text-text-muted font-mono tracking-widest">
                VIBE
              </h3>
            </div>
            <div className="glass-divider mb-1" />
            {themeNames.map((theme) => (
              <button
                key={theme.key}
                onClick={() => {
                  changeTheme(theme.key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-100 flex items-center gap-2.5 ${
                  currentTheme === theme.key
                    ? 'text-text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: theme.accent,
                    boxShadow: `0 0 10px ${theme.accent}`,
                  }}
                />
                {theme.name}
                {currentTheme === theme.key && (
                  <BsCheck2 className="w-3.5 h-3.5 ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
