"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { playCookieClick, playUnlockSound } from "@/utils/sounds";

// localStorage key for secret game unlock
export const SECRET_GAME_UNLOCKED_KEY = "scrapbook_secret_game_unlocked";

interface CoverPageProps {
  onNext: () => void;
  onPrev: () => void;
}

// Floating decorations - cookies, hearts, and baking items
// Cookies are now clickable for the easter egg!
const FloatingCookie = ({ 
  delay, 
  x, 
  y, 
  size, 
  rotation, 
  introComplete,
  onClick,
  isClickable
}: { 
  delay: number; 
  x: string; 
  y: string; 
  size: number; 
  rotation: number; 
  introComplete: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}) => (
  <motion.button
    className={`absolute ${isClickable ? 'cursor-pointer' : 'pointer-events-none'}`}
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={introComplete ? { 
      opacity: 0.8, 
      scale: 1,
      y: [0, -15, 0],
      rotate: [rotation, rotation + 5, rotation]
    } : {}}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
      y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    whileHover={isClickable ? { scale: 1.1 } : {}}
    whileTap={isClickable ? { scale: 0.9 } : {}}
    onClick={onClick}
    aria-label={isClickable ? "Click the cookie!" : undefined}
    aria-hidden={!isClickable}
    tabIndex={isClickable ? 0 : -1}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* Cookie shape */}
      <circle cx="50" cy="50" r="45" fill="#D4A574" />
      <circle cx="50" cy="50" r="42" fill="#E8C9A0" />
      {/* Chocolate chips */}
      <circle cx="35" cy="35" r="6" fill="#5D4037" />
      <circle cx="60" cy="30" r="5" fill="#5D4037" />
      <circle cx="45" cy="55" r="7" fill="#5D4037" />
      <circle cx="70" cy="55" r="5" fill="#5D4037" />
      <circle cx="30" cy="60" r="4" fill="#5D4037" />
      <circle cx="55" cy="70" r="6" fill="#5D4037" />
    </svg>
  </motion.button>
);

const FloatingHeart = ({ delay, x, y, size, rotation, introComplete }: { delay: number; x: string; y: string; size: number; rotation: number; introComplete: boolean }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={introComplete ? { 
      opacity: 0.6, 
      scale: 1,
      y: [0, -20, 0],
      rotate: [rotation, rotation - 5, rotation]
    } : {}}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
      y: { delay: delay + 0.3, duration: 4, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay: delay + 0.3, duration: 5, repeat: Infinity, ease: "easeInOut" }
    }}
    aria-hidden="true"
  >
    <span style={{ fontSize: size }}>🍵</span>
  </motion.div>
);

const FloatingWhisk = ({ delay, x, y, size, rotation, introComplete }: { delay: number; x: string; y: string; size: number; rotation: number; introComplete: boolean }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, rotate: rotation }}
    animate={introComplete ? { 
      opacity: 0.5, 
      scale: 1,
      y: [0, -12, 0],
      rotate: [rotation, rotation + 8, rotation]
    } : {}}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
      y: { delay: delay + 0.4, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay: delay + 0.4, duration: 4.5, repeat: Infinity, ease: "easeInOut" }
    }}
    aria-hidden="true"
  >
    <svg width={size} height={size * 1.5} viewBox="0 0 60 90" fill="none" aria-hidden="true">
      {/* Handle */}
      <rect x="27" y="0" width="6" height="35" rx="3" fill="#8B7355" />
      {/* Whisk wires */}
      <ellipse cx="30" cy="60" rx="20" ry="25" stroke="#A89078" strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="60" rx="12" ry="20" stroke="#A89078" strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="60" rx="5" ry="15" stroke="#A89078" strokeWidth="2" fill="none" />
    </svg>
  </motion.div>
);

export default function CoverPage({ onNext }: CoverPageProps) {
  // No intro animation - start with decorations visible
  const [introComplete] = useState(true);
  const [cookieClicks, setCookieClicks] = useState(0);
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  const [isAlreadyUnlocked, setIsAlreadyUnlocked] = useState(false);

  // Check if already unlocked on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem(SECRET_GAME_UNLOCKED_KEY) === 'true';
      setIsAlreadyUnlocked(unlocked);
    }
  }, []);

  // Handle cookie click for easter egg
  const handleCookieClick = useCallback(() => {
    if (isAlreadyUnlocked) return;
    
    playCookieClick();
    setCookieClicks(prev => {
      const newCount = prev + 1;
      
      if (newCount >= 10) {
        playUnlockSound();
        localStorage.setItem(SECRET_GAME_UNLOCKED_KEY, 'true');
        setIsAlreadyUnlocked(true);
        setShowUnlockMessage(true);
        
        setTimeout(() => {
          setShowUnlockMessage(false);
        }, 3000);
      }
      
      return newCount;
    });
  }, [isAlreadyUnlocked]);

  // Reduced delay since no intro animation
  const contentDelay = 0.2;

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      {/* Unlock notification */}
      <AnimatePresence>
        {showUnlockMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 bg-sage text-white px-6 py-3 rounded-full shadow-xl font-body font-semibold"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">🎮</span>
              Secret game unlocked!
              <span className="text-xl">🍪</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie click progress hint (subtle) */}
      {!isAlreadyUnlocked && cookieClicks > 0 && cookieClicks < 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 font-body text-xs text-brown-light"
        >
          {cookieClicks < 5 ? "Hmm, these cookies look clickable..." : `${10 - cookieClicks} more...`}
        </motion.div>
      )}

      {/* Floating decorations - appear after intro */}
      {/* Cookies are clickable for easter egg! - smaller on mobile */}
      <FloatingCookie 
        delay={0.2} 
        x="5%" 
        y="12%" 
        size={45} 
        rotation={-15} 
        introComplete={introComplete}
        onClick={handleCookieClick}
        isClickable={introComplete && !isAlreadyUnlocked}
      />
      <FloatingCookie 
        delay={0.5} 
        x="82%" 
        y="15%" 
        size={35} 
        rotation={20} 
        introComplete={introComplete}
        onClick={handleCookieClick}
        isClickable={introComplete && !isAlreadyUnlocked}
      />
      <FloatingCookie 
        delay={0.8} 
        x="8%" 
        y="78%" 
        size={40} 
        rotation={10} 
        introComplete={introComplete}
        onClick={handleCookieClick}
        isClickable={introComplete && !isAlreadyUnlocked}
      />
      {/* Hearts and whisks hidden on very small screens */}
      <div className="hidden sm:block">
        <FloatingHeart delay={0.3} x="78%" y="70%" size={55} rotation={15} introComplete={introComplete} />
        <FloatingHeart delay={0.6} x="5%" y="45%" size={40} rotation={-10} introComplete={introComplete} />
        <FloatingHeart delay={0.9} x="90%" y="45%" size={35} rotation={5} introComplete={introComplete} />
        <FloatingWhisk delay={0.4} x="88%" y="8%" size={40} rotation={25} introComplete={introComplete} />
        <FloatingWhisk delay={0.7} x="3%" y="85%" size={35} rotation={-20} introComplete={introComplete} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Decorative top element - smaller on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: contentDelay, duration: 0.8, type: "spring", stiffness: 150 }}
          className="mb-4 sm:mb-6"
          aria-hidden="true"
        >
          <svg width="80" height="50" viewBox="0 0 80 50" fill="none" className="text-blush sm:w-[100px] sm:h-[60px]" aria-hidden="true">
            {/* Whisk (left, tilted) */}
            <g transform="rotate(-30 25 25)">
              {/* Handle */}
              <rect x="23" y="30" width="4" height="18" rx="2" fill="currentColor" />
              {/* Whisk head */}
              <ellipse cx="25" cy="20" rx="8" ry="12" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M21 12 Q25 22 29 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M19 16 Q25 24 31 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <line x1="25" y1="8" x2="25" y2="22" stroke="currentColor" strokeWidth="1.5" />
            </g>
            {/* Wooden spoon (right, tilted) */}
            <g transform="rotate(30 55 25)">
              {/* Handle */}
              <rect x="53" y="28" width="4" height="20" rx="2" fill="currentColor" />
              {/* Spoon bowl */}
              <ellipse cx="55" cy="18" rx="7" ry="10" fill="currentColor" />
              <ellipse cx="55" cy="17" rx="4" ry="6" fill="currentColor" opacity="0.6" />
            </g>
          </svg>
        </motion.div>

        {/* Title - responsive sizing */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: contentDelay + 0.2, duration: 0.3 }}
          className="font-handwritten text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brown leading-tight mb-3 sm:mb-4"
        >
          <motion.span
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: contentDelay + 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="inline-block"
          >
            Things You Bake,
          </motion.span>
          <br />
          <motion.span 
            className="text-blush inline-block"
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: contentDelay + 0.5, duration: 0.6, type: "spring", stiffness: 100 }}
          >
            Things I Love
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: contentDelay + 0.8, duration: 0.6 }}
          className="font-handwritten text-xl sm:text-2xl md:text-3xl text-brown-light mb-2"
        >
          A little baking scrapbook for{" "}
          <motion.span 
            className="text-blush font-semibold inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: contentDelay + 1.1, 
              duration: 0.5, 
              type: "spring",
              stiffness: 300,
              damping: 10
            }}
          >
            Kezia
          </motion.span>
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: contentDelay + 1.2, duration: 0.6 }}
          className="font-body text-sm sm:text-base md:text-lg text-brown-light/70 italic mb-8 sm:mb-12"
        >
          Made with love (and very little baking skill)
        </motion.p>

        {/* Open button - bounces in */}
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            delay: contentDelay + 1.4, 
            duration: 0.7, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-blush text-white font-body font-semibold text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden touch-manipulation active:scale-95"
        >
          {/* Button shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ delay: contentDelay + 2, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            Open Scrapbook
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </motion.button>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: contentDelay + 1.6, duration: 0.6 }}
          className="mt-8 sm:mt-12 flex items-center gap-3"
          aria-hidden="true"
        >
          <motion.div 
            className="w-12 h-px bg-brown-light/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: contentDelay + 1.6, duration: 0.4 }}
            style={{ transformOrigin: "right" }}
          />
          <motion.span 
            className="text-xl"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: contentDelay + 1.7, duration: 0.5, type: "spring" }}
          >
            🍡
          </motion.span>
          <motion.div 
            className="w-12 h-px bg-brown-light/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: contentDelay + 1.6, duration: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
