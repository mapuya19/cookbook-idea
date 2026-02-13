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
        <div
          className="mb-8"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-3">
            Game Time! 🎮
          </h2>
          <p className="font-body text-brown-light">
            Pick a game to play, sweetie!
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
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
