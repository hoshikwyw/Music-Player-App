import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ThemeSwitcher from './ThemeSwitcher';
import { HiOutlineMenu } from 'react-icons/hi';
import { useSidebar } from '../contexts/SidebarContext';

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) navigate(`/search/${encodeURIComponent(term)}`);
  };

  return (
    <div className="glass-1 flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 !rounded-none !border-x-0 !border-t-0">
      <MobileMenuBtn />
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-1 min-w-0">
        <div className="glass-input flex items-center gap-2 !py-1.5 !px-3">
          <FiSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted flex-shrink-0" />
          <input
            name="search-field"
            id="search-field"
            autoComplete="off"
            type="search"
            aria-label="Search songs and artists"
            className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-sm text-text-primary placeholder:text-text-muted font-sans min-w-0"
            placeholder="Search a song or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
      <ThemeSwitcher />
    </div>
  );
};

const MobileMenuBtn = () => {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-label="Open menu"
      className="glass-btn md:hidden w-8 h-8 !p-0 flex-shrink-0"
    >
      <HiOutlineMenu className="text-text-primary text-base" />
    </button>
  );
};

export default Searchbar;
