
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className={`fixed bottom-8 right-8 z-[60] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="bg-rugbyRed hover:bg-red-700 text-white p-4 shadow-2xl skew-x-[-12deg] transition-all hover:scale-110 active:scale-90 group border-2 border-white/20"
        aria-label="Back to top"
      >
        <span className="block skew-x-[12deg] group-hover:-translate-y-1 transition-transform">
          <ChevronUp size={24} strokeWidth={3} />
        </span>
      </button>
    </div>
  );
};

export default BackToTop;
