import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import factScreen1Mobile from '../images/FactScreen1-mobile.jpg';
import factScreen1Desktop from '../images/FactScreen1-desktop.jpg';
import factScreen2Mobile from '../images/FactScreen2-mobile.jpg';
import factScreen2Desktop from '../images/FactScreen2-desktop.jpg';
import factScreen3Mobile from '../images/FactScreen3-mobile.jpg';
import factScreen3Desktop from '../images/FactScreen3-desktop.jpg';

const screens = [
  { mobile: factScreen1Mobile, desktop: factScreen1Desktop },
  { mobile: factScreen2Mobile, desktop: factScreen2Desktop },
  { mobile: factScreen3Mobile, desktop: factScreen3Desktop },
];

export default function FactScreen() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 back, 1 forward
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const goTo = useCallback(
    (next, dir) => {
      if (isAnimating) return;
      if (next < 0) return;
      if (next >= screens.length) {
        navigate('/onboarding');
        return;
      }
      setDirection(dir);
      setIsAnimating(true);
      setCurrent(next);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, navigate]
  );

  const handleTap = useCallback(
    (e) => {
      const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
      const mid = window.innerWidth / 2;
      if (x < mid) {
        goTo(current - 1, -1);
      } else {
        goTo(current + 1, 1);
      }
    },
    [current, goTo]
  );

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;

      // Only register horizontal swipes
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0) {
        goTo(current + 1, 1);
      } else {
        goTo(current - 1, -1);
      }
    },
    [current, goTo]
  );

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goTo(current + 1, 1);
      if (e.key === 'ArrowLeft') goTo(current - 1, -1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, goTo]);

  return (
    <div
      className="fixed inset-0 bg-black select-none overflow-hidden"
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
        {screens.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: i < current ? '100%' : i === current ? '100%' : '0%',
                backgroundColor: i <= current ? 'rgba(255,255,255,0.9)' : 'transparent',
              }}
            />
          </div>
        ))}
      </div>

      {/* Screens */}
      {screens.map((screen, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-500 ease-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform:
              i === current
                ? 'scale(1)'
                : i < current
                ? 'scale(0.95)'
                : 'scale(1.05)',
            zIndex: i === current ? 10 : 1,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          {/* Mobile image */}
          <img
            src={screen.mobile}
            alt=""
            className="block lg:hidden w-full h-full object-cover"
            draggable={false}
          />
          {/* Desktop image */}
          <img
            src={screen.desktop}
            alt=""
            className="hidden lg:block w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}

      {/* Tap zones visual hint (invisible) */}
      <div className="absolute inset-y-0 left-0 w-1/2 z-15" />
      <div className="absolute inset-y-0 right-0 w-1/2 z-15" />
    </div>
  );
}
