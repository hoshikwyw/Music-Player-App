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
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-card border-b-2 border-border">
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-1 min-w-0">
        <div className="flex items-center gap-2 retro-input !py-1.5 !px-2.5 sm:!px-3">
          <FiSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted flex-shrink-0" />
          <input
            name="search-field"
            autoComplete="off"
            id="search-field"
            className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-sm text-text-primary placeholder-text-muted font-retro min-w-0"
            placeholder="Search..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
      <ThemeSwitcher />
      <MobileMenuBtn />
    </div>
  );
};

const MobileMenuBtn = () => {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      className="md:hidden w-8 h-8 flex items-center justify-center bg-surface border-2 border-border rounded-[10px] shadow-retro-sm flex-shrink-0"
    >
      <HiOutlineMenu className="text-text-primary text-base" />
    </button>
  );
};

export default Searchbar;
