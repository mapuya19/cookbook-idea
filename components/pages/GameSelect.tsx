"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import BakingGame from "./BakingGame";
import CookieClicker from "./CookieClicker";
import CatchGame from "./CatchGame";
import TriviaQuiz from "./TriviaQuiz";
import { SECRET_GAME_UNLOCKED_KEY } from "./CoverPage";
import { playClick } from "@/utils/sounds";

const FloatingHeart = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <div
    className="absolute pointer-events-none animate-float-slow"
    style={{
      left: x,
      top: y,
      fontSize: size,
      color: "#A8C69F",
      animationDelay: `${delay}s`,
      opacity: '0.6',
      transform: `rotate(${rotation}deg)`
    }}
    aria-hidden="true"
  >
    🍵
  </div>
);

interface GameSelectProps {
  onNext: () => void;
  onPrev: () => void;
}

type GameType = "select" | "memory" | "clicker" | "catch" | "trivia";

export default function GameSelect({ onPrev }: GameSelectProps) {
  const [currentGame, setCurrentGame] = useState<GameType>("select");
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if secret game is unlocked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem(SECRET_GAME_UNLOCKED_KEY) === 'true';
      setSecretUnlocked(unlocked);
      setMounted(true);
    }
  }, []);

  if (currentGame === "memory") {
    return <BakingGame onNext={() => setCurrentGame("select")} onPrev={() => setCurrentGame("select")} />;
  }

  if (currentGame === "clicker") {
    return <CookieClicker onBack={() => setCurrentGame("select")} />;
  }

  if (currentGame === "catch") {
    return <CatchGame onBack={() => setCurrentGame("select")} />;
  }

  if (currentGame === "trivia") {
    return <TriviaQuiz onBack={() => setCurrentGame("select")} />;
  }

  // Prevent flickering by waiting for localStorage check to complete
  if (!mounted) {
    return <div className="scrapbook-page paper-texture relative overflow-hidden" />;
  }

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-3">
            Game Time! 🎮
          </h2>
          <p className="font-body text-brown-light">
            Pick a game to play, sweetie!
          </p>
        </motion.div>

        {/* Game options */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Memory Match */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); setCurrentGame("memory"); }}
            className="group bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blush-light rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform shrink-0">
                🧠
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-handwritten text-xl sm:text-2xl text-brown mb-0.5 sm:mb-1">
                  Memory Match
                </h3>
                <p className="font-body text-xs sm:text-sm text-brown-light">
                  Flip cards and find matching pairs of baking goodies!
                </p>
              </div>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-brown-light group-hover:text-blush group-hover:translate-x-1 transition-all shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>

          {/* Cookie Clicker */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); setCurrentGame("clicker"); }}
            className="group bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sage-light rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform shrink-0">
                🍪
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-handwritten text-xl sm:text-2xl text-brown mb-0.5 sm:mb-1">
                  Cookie Clicker
                </h3>
                <p className="font-body text-xs sm:text-sm text-brown-light">
                  Click to bake cookies and build your bakery empire!
                </p>
              </div>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-brown-light group-hover:text-sage group-hover:translate-x-1 transition-all shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>

          {/* Trivia Quiz */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); setCurrentGame("trivia"); }}
            className="group bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blush-light to-blush/40 rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform shrink-0">
                💕
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-handwritten text-xl sm:text-2xl text-brown mb-0.5 sm:mb-1">
                  Love Quiz
                </h3>
                <p className="font-body text-xs sm:text-sm text-brown-light">
                  How well do you know me? Test your knowledge!
                </p>
              </div>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-brown-light group-hover:text-blush group-hover:translate-x-1 transition-all shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>

          {/* Secret Catch Game - only shown when unlocked */}
          {secretUnlocked && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { playClick(); setCurrentGame("catch"); }}
              className="group bg-linear-to-r from-blush/10 to-sage/10 border-2 border-dashed border-blush/30 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-blush to-sage rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform shrink-0">
                  🎮
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                    <h3 className="font-handwritten text-xl sm:text-2xl text-brown">
                      Catch the Cookies
                    </h3>
                    <span className="text-[10px] sm:text-xs bg-blush/20 text-blush px-1.5 sm:px-2 py-0.5 rounded-full font-body">
                      SECRET
                    </span>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-brown-light">
                    Catch falling treats before they hit the ground!
                  </p>
                </div>
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-brown-light group-hover:text-blush group-hover:translate-x-1 transition-all shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          )}
        </div>

        {/* Back to scrapbook */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playClick(); onPrev(); }}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 touch-manipulation active:scale-95"
        >
          Back to Scrapbook
        </motion.button>

        {/* Decorative elements - positioned in far corners to avoid content */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.1, rotate: -10 }}
          transition={{ delay: 0.8 }}
          className="absolute top-2 right-2 text-4xl pointer-events-none hidden xl:block"
          aria-hidden="true"
        >
          🧁
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, rotate: 15 }}
          animate={{ opacity: 0.1, rotate: 15 }}
          transition={{ delay: 1 }}
          className="absolute bottom-2 left-2 text-4xl pointer-events-none hidden xl:block"
          aria-hidden="true"
        >
          🎂
        </motion.div>

        <FloatingHeart delay={0.9} x="6%" y="32%" size={18} rotation={-6} />
        <FloatingHeart delay={1.3} x="91%" y="20%" size={20} rotation={7} />
        <FloatingHeart delay={1.6} x="84%" y="76%" size={16} rotation={-8} />
      </div>
    </div>
  );
}
