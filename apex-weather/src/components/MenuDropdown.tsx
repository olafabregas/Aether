import React, { useEffect, useRef } from 'react';

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  onAboutClick?: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ isOpen, onClose, onRefresh, onAboutClick }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: 'refresh',
      label: 'Refresh Data',
      action: () => {
        if (onRefresh) {
          onRefresh();
        }
        onClose();
      },
      disabled: !onRefresh
    },
    {
      icon: 'info',
      label: 'About Apex Weather',
      action: () => {
        if (onAboutClick) {
          onAboutClick();
        }
        onClose();
      }
    },
    {
      icon: 'share',
      label: 'Share Location',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Apex Weather',
            text: 'Check out the weather!',
            url: window.location.href
          }).catch(() => {});
        }
        onClose();
      }
    },
    {
      icon: 'bug_report',
      label: 'Report Issue',
      action: () => {
        window.open('https://github.com/yourusername/apex-weather/issues', '_blank');
        onClose();
      }
    }
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-3 sm:right-4 md:right-5 lg:right-6 top-full mt-2 w-48 sm:w-52 md:w-56 glass-glow rounded-lg sm:rounded-xl overflow-hidden shadow-xl z-50"
    >
      <div className="py-1 sm:py-1.5 md:py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            disabled={item.disabled}
            className="w-full px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 flex items-center gap-2 sm:gap-2.5 md:gap-3 hover:bg-white/5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-primary text-base sm:text-lg md:text-xl flex-shrink-0">
              {item.icon}
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-medium text-white/90">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDropdown;
