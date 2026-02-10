"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { useConfetti } from "../effects/Confetti";
import { playButtonClick, playUpgradeSound } from "@/utils/sounds";

interface CookieClickerProps {
  onBack: () => void;
}

// Upgrades available in the game
const upgrades = [
  { id: "oven", name: "Mini Oven", icon: "🔥", cost: 10, cps: 1, description: "+1 cookie/sec" },
  { id: "mixer", name: "Stand Mixer", icon: "🥣", cost: 50, cps: 5, description: "+5 cookies/sec" },
  { id: "bakery", name: "Bakery", icon: "🏪", cost: 200, cps: 20, description: "+20 cookies/sec" },
  { id: "factory", name: "Cookie Factory", icon: "🏭", cost: 1000, cps: 100, description: "+100 cookies/sec" },
];

// Milestones with sweet messages
const milestones = [
  { count: 10, message: "First batch! 🍪" },
  { count: 50, message: "Getting warmer!" },
  { count: 100, message: "Baker in training!" },
  { count: 500, message: "Sweet progress!" },
  { count: 1000, message: "Cookie master! 🎉" },
  { count: 5000, message: "Legendary baker!" },
  { count: 10000, message: "Cookie empress! 👑" },
];

// Floating +1 animation component
interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function CookieClicker({ onBack }: CookieClickerProps) {
  const [cookies, setCookies] = useState(0);
  const [totalCookies, setTotalCookies] = useState(0);
  const [cookiesPerClick, setCookiesPerClick] = useState(1);
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
  const [ownedUpgrades, setOwnedUpgrades] = useState<Record<string, number>>({});
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<string | null>(null);
  const [cookieScale, setCookieScale] = useState(1);
  const floatingIdRef = useRef(0);
  const { fireConfetti } = useConfetti();
  const lastMilestoneRef = useRef(0);

  // Passive cookie generation
  useEffect(() => {
    if (cookiesPerSecond <= 0) return;
    
    const interval = setInterval(() => {
      setCookies(c => c + cookiesPerSecond);
      setTotalCookies(t => t + cookiesPerSecond);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cookiesPerSecond]);

  // Check milestones
  useEffect(() => {
    const milestone = milestones.find(m => 
      totalCookies >= m.count && lastMilestoneRef.current < m.count
    );
    
    if (milestone) {
      lastMilestoneRef.current = milestone.count;
      setCurrentMilestone(milestone.message);
      
      if (milestone.count >= 1000) {
        fireConfetti();
      }
      
      setTimeout(() => setCurrentMilestone(null), 2000);
    }
  }, [totalCookies, fireConfetti]);

  const handleCookieClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    playButtonClick();
    setCookies(c => c + cookiesPerClick);
    setTotalCookies(t => t + cookiesPerClick);
    
    // Cookie squish animation
    setCookieScale(0.9);
    setTimeout(() => setCookieScale(1), 100);
    
    // Add floating number
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newFloating: FloatingNumber = {
      id: floatingIdRef.current++,
      x,
      y,
      value: cookiesPerClick,
    };
    
    setFloatingNumbers(prev => [...prev, newFloating]);
    
    // Remove after animation
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(f => f.id !== newFloating.id));
    }, 1000);
  }, [cookiesPerClick]);

  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;
    
    const owned = ownedUpgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.cost * Math.pow(1.15, owned));
    
    if (cookies >= cost) {
      playUpgradeSound();
      setCookies(c => c - cost);
      setOwnedUpgrades(prev => ({ ...prev, [upgradeId]: owned + 1 }));
      setCookiesPerSecond(cps => cps + upgrade.cps);
      
      // First oven also increases click power
      if (upgradeId === "oven" && owned === 0) {
        setCookiesPerClick(c => c + 1);
      }
    }
  }, [cookies, ownedUpgrades]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.floor(num).toString();
  };

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h2 className="font-handwritten text-3xl sm:text-4xl text-brown mb-1">
            Cookie Clicker! 🍪
          </h2>
          <p className="font-body text-brown-light text-sm">
            Bake cookies for your sweetie!
          </p>
        </motion.div>

        {/* Cookie counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <p className="font-handwritten text-4xl sm:text-5xl text-blush">
            {formatNumber(cookies)}
          </p>
          <p className="font-body text-brown-light text-sm">
            cookies
          </p>
          {cookiesPerSecond > 0 && (
            <p className="font-body text-sage text-xs mt-1">
              {formatNumber(cookiesPerSecond)} per second
            </p>
          )}
        </motion.div>

        {/* Milestone notification */}
        <AnimatePresence>
          {currentMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="bg-sage text-white font-body font-semibold px-4 py-2 rounded-full shadow-lg">
                {currentMilestone}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main cookie button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: cookieScale }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={handleCookieClick}
            className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-blush focus-visible:ring-offset-4 active:scale-95 transition-transform touch-manipulation select-none"
            aria-label="Click to bake cookies"
          >
            {/* Cookie SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              {/* Cookie base */}
              <circle cx="50" cy="50" r="48" fill="#D4A574" />
              <circle cx="50" cy="50" r="45" fill="#E8C9A0" />
              {/* Chocolate chips */}
              <circle cx="30" cy="30" r="6" fill="#5D4037" />
              <circle cx="55" cy="25" r="5" fill="#5D4037" />
              <circle cx="70" cy="40" r="6" fill="#5D4037" />
              <circle cx="35" cy="55" r="7" fill="#5D4037" />
              <circle cx="60" cy="55" r="5" fill="#5D4037" />
              <circle cx="45" cy="72" r="6" fill="#5D4037" />
              <circle cx="70" cy="65" r="4" fill="#5D4037" />
              <circle cx="25" cy="45" r="4" fill="#5D4037" />
            </svg>
            
            {/* Floating numbers */}
            <AnimatePresence>
              {floatingNumbers.map(floating => (
                <motion.span
                  key={floating.id}
                  initial={{ opacity: 1, y: 0, x: floating.x - 20, scale: 1 }}
                  animate={{ opacity: 0, y: -60, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute font-handwritten text-2xl text-blush pointer-events-none font-bold"
                  style={{ left: floating.x, top: floating.y }}
                >
                  +{floating.value}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Upgrades shop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <h3 className="font-handwritten text-lg sm:text-xl text-brown text-center mb-2 sm:mb-3">
            Bakery Upgrades
          </h3>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
            {upgrades.map(upgrade => {
              const owned = ownedUpgrades[upgrade.id] || 0;
              const cost = Math.floor(upgrade.cost * Math.pow(1.15, owned));
              const canAfford = cookies >= cost;
              
              return (
                <motion.button
                  key={upgrade.id}
                  whileHover={canAfford ? { scale: 1.02 } : {}}
                  whileTap={canAfford ? { scale: 0.98 } : {}}
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  className={`
                    p-2 sm:p-3 rounded-lg sm:rounded-xl text-left transition-all touch-manipulation
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blush
                    ${canAfford 
                      ? 'bg-white shadow-md active:shadow-lg sm:hover:shadow-lg cursor-pointer active:scale-[0.98]' 
                      : 'bg-brown-light/10 opacity-60 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                    <span className="text-xl sm:text-2xl">{upgrade.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-brown text-xs sm:text-sm truncate">
                        {upgrade.name}
                      </p>
                      <p className="font-body text-[10px] sm:text-xs text-brown-light hidden sm:block">
                        {upgrade.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-body text-xs sm:text-sm ${canAfford ? 'text-sage' : 'text-brown-light'}`}>
                      🍪 {formatNumber(cost)}
                    </span>
                    {owned > 0 && (
                      <span className="font-body text-[10px] sm:text-xs text-blush bg-blush-light/50 px-1.5 sm:px-2 py-0.5 rounded-full">
                        x{owned}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-4"
        >
          <p className="font-body text-xs text-brown-light/60">
            Total baked: {formatNumber(totalCookies)} cookies
          </p>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            Back to Games
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
