import React, { useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const highlights = [
    'Context-aware weather explanations',
    'Smart daily recommendations',
    'Real-time local detection with global search',
    'Responsive, modern interface',
    'Fast, optimized performance'
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="glass-glow rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 lg:p-10 w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-white/70 text-xl sm:text-2xl">
            close
          </span>
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-7 md:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="material-symbols-outlined text-cyan-400 text-3xl sm:text-4xl md:text-5xl">
              wb_twilight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
            Apex Weather
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-primary font-medium">
            Weather intelligence, simplified.
          </p>
        </div>

        {/* Main Description */}
        <div className="mb-6 sm:mb-7 md:mb-8">
          <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed mb-3 sm:mb-4">
            Apex Weather transforms complex meteorological data into clear, actionable insights. 
            Instead of overwhelming users with raw metrics, it delivers contextual guidance that 
            helps them make confident daily decisions.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
            From temperature and wind conditions to air quality and precipitation risk, every data 
            point is translated into practical meaning — so users know not just <em className="text-white">what</em> the 
            weather is, but <em className="text-white">what it means for them</em>.
          </p>
        </div>

        {/* Key Highlights */}
        <div className="mb-6 sm:mb-7 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-5 text-center">
            Key Highlights
          </h2>
          <div className="space-y-2.5 sm:space-y-3">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 sm:gap-4 glass rounded-lg p-3 sm:p-3.5 md:p-4 hover:bg-white/5 transition-all"
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] flex-shrink-0"></div>
                <p className="text-xs sm:text-sm md:text-base text-white/90">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Credit */}
        <div className="glass rounded-xl p-4 sm:p-5 bg-primary/5 border border-primary/20 mb-6 sm:mb-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                person
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-primary font-semibold mb-1">Developed By</p>
              <p className="text-base sm:text-lg md:text-xl font-bold mb-2">Roqeeb Ayorinde</p>
              <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed">
                Built with precision. Designed for clarity.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 sm:pt-5 border-t border-white/10">
          <p className="text-[10px] sm:text-xs text-white/40">
            © {new Date().getFullYear()} Apex Weather
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
