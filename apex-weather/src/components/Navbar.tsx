import React, { useState } from 'react';
import type { Location } from '../types/weather.types';
import MenuDropdown from './MenuDropdown';

interface NavbarProps {
  location: Location;
  onRefresh?: () => void;
  onSearchClick?: () => void;
  onAboutClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ location, onRefresh, onSearchClick, onAboutClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-3 sm:px-5 md:px-6 pt-5 sm:pt-6 md:pt-8 pb-3 sm:pb-4 sticky top-0 z-50 relative">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 max-w-[55%] sm:max-w-none">
        <span className="material-symbols-outlined text-cyan-400 text-[18px] sm:text-xl md:text-2xl flex-shrink-0">location_on</span>
        <span className="text-xs sm:text-sm md:text-lg font-medium tracking-tight truncate ">
          {location.city}{location.state ? `, ${location.state}` : location.country ? `, ${location.country}` : ''}
        </span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
        <button 
          onClick={onSearchClick}
          aria-label="Search location"
          className="w-9 h-9 sm:w-10 sm:h-10 glass-glow rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white/90">
            search
          </span>
        </button>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="w-9 h-9 sm:w-10 sm:h-10 glass-glow rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white/90">
            {menuOpen ? 'close' : 'more_vert'}
          </span>
        </button>
      </div>

      {/* Menu Dropdown */}
      <MenuDropdown 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRefresh={onRefresh}
        onAboutClick={onAboutClick}
      />
    </nav>
  );
};

export default Navbar;
