"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCatchSound, playMissSound } from "@/utils/sounds";
import { useConfetti } from "../effects/Confetti";

interface CatchGameProps {
  onBack: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: "cookie" | "cupcake" | "matcha";
  speed: number;
}

// Responsive game dimensions - will be calculated based on screen size
const getGameDimensions = () => {
  if (typeof window === 'undefined') return { width: 300, height: 340, itemSize: 38, basketWidth: 60, basketHeight: 52 };
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // On mobile, calculate dimensions more conservatively
  // Leave room for nav arrows (50px each side) and padding
  if (screenWidth < 640) {
    // Account for nav arrows and padding: ~60px on each side minimum
    const maxWidth = screenWidth - 80; // Leave space for nav arrows
    const width = Math.min(maxWidth, 320);
    // Account for: header (~70px), score bar (~35px), instructions (~20px), back button (~55px), bottom nav (~50px), padding (~30px)
    const overhead = 260;
    const availableHeight = screenHeight - overhead;
    const height = Math.max(240, Math.min(availableHeight, 360));
    const itemSize = 38;
    const basketWidth = 60;
    const basketHeight = 52;
    return { width, height, itemSize, basketWidth, basketHeight };
  }
  // Tablet
  if (screenWidth < 1024) {
    return { width: 350, height: 420, itemSize: 44, basketWidth: 72, basketHeight: 62 };
  }
  // Desktop
  return { width: 380, height: 480, itemSize: 48, basketWidth: 78, basketHeight: 68 };
};

export default function CatchGame({ onBack }: CatchGameProps) {
  const [score, setScore] = useState(0);
  const [highScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('catch_game_high_score');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameDimensions, setGameDimensions] = useState({ width: 300, height: 340, itemSize: 38, basketWidth: 60, basketHeight: 52 });
  const [basketX, setBasketX] = useState(160 - 35);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const itemIdRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const gameLoopRef = useRef<((timestamp: number) => void) | null>(null);
  const { fireConfetti } = useConfetti();

  // Calculate responsive dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const dims = getGameDimensions();
      setGameDimensions(dims);
      setBasketX(dims.width / 2 - dims.basketWidth / 2);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    // Also listen for orientation changes on mobile
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('catch_game_high_score', score.toString());
      }
    }
  }, [score, highScore]);

  // Spawn new items
  const spawnItem = useCallback(() => {
    const types: FallingItem["type"][] = ["cookie", "cupcake", "matcha"];
    const { itemSize } = gameDimensions;
    const newItem: FallingItem = {
      id: itemIdRef.current++,
      x: Math.random() * (gameDimensions.width - itemSize),
      y: -itemSize,
      type: types[Math.floor(Math.random() * types.length)],
      speed: 2 + Math.random() * 2 + Math.floor(score / 10) * 0.5, // Speed increases with score
    };
    setItems(prev => [...prev, newItem]);
  }, [score, gameDimensions]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!isPlaying) return;

    // Spawn new items
    const spawnInterval = Math.max(800 - score * 20, 400); // Spawn faster as score increases
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      spawnItem();
      lastSpawnRef.current = timestamp;
    }

    // Update item positions
    setItems(prev => {
      const updated: FallingItem[] = [];
      let newLives = lives;
      const { height: gameHeight, itemSize, basketWidth, basketHeight } = gameDimensions;

      for (const item of prev) {
        const newY = item.y + item.speed;

        // Check if caught (item bottom reaches basket opening and overlaps basket horizontally)
        const basketLeft = basketX;
        const basketRight = basketX + basketWidth;
        const itemCenter = item.x + itemSize / 2;
        const itemBottom = newY + itemSize;
        // The basket SVG has viewBox "0 0 80 60" with the opening at y=25
        // So the opening is at 25/60 = ~42% from the top of the basket div
        // The catch zone should start at the basket opening, not the top of the div
        const basketOpeningOffset = basketHeight * 0.42;
        const catchZoneTop = gameHeight - basketHeight + basketOpeningOffset;
        const inCatchZone = itemBottom >= catchZoneTop;
        const inBasket = itemCenter >= basketLeft && itemCenter <= basketRight;

        if (inCatchZone && inBasket && itemBottom <= gameHeight) {
          // Caught!
          playCatchSound();
          setScore(s => s + (item.type === "matcha" ? 3 : 1));
          continue; // Don't add to updated
        }

        // Check if missed (fell past bottom)
        if (newY > gameHeight) {
          playMissSound();
          newLives--;
          continue; // Don't add to updated
        }

        updated.push({ ...item, y: newY });
      }

      // Update lives if changed
      if (newLives !== lives) {
        setLives(newLives);
        if (newLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
        }
      }

      return updated;
    });

    if (gameLoopRef.current) {
      animationRef.current = requestAnimationFrame(gameLoopRef.current);
    }
  }, [isPlaying, spawnItem, basketX, lives, score, gameDimensions]);

  // Start game loop
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameLoop]);

  // Handle mouse/touch movement
  const handleMove = useCallback((clientX: number) => {
    if (!gameAreaRef.current || !isPlaying) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const { basketWidth } = gameDimensions;
    const x = clientX - rect.left - basketWidth / 2; // Center basket on cursor/touch
    setBasketX(Math.max(0, Math.min(gameDimensions.width - basketWidth, x)));
  }, [isPlaying, gameDimensions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setItems([]);
    setGameOver(false);
    setIsPlaying(true);
    setBasketX(gameDimensions.width / 2 - gameDimensions.basketWidth / 2);
    lastSpawnRef.current = 0;
    itemIdRef.current = 0;
  }, [gameDimensions]);

  // Celebrate high score
  useEffect(() => {
    if (gameOver && score > 0 && score === highScore) {
      fireConfetti();
    }
  }, [gameOver, score, highScore, fireConfetti]);

  const getItemEmoji = (type: FallingItem["type"]) => {
    switch (type) {
      case "cookie": return "🍪";
      case "cupcake": return "🧁";
      case "matcha": return "🍵";
    }
  };

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto px-4 text-center flex flex-col items-center justify-center min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-4"
        >
          <h2 className="font-handwritten text-2xl sm:text-4xl text-brown mb-0.5 sm:mb-1">
            Catch the Cookies! 🍪
          </h2>
          <p className="font-body text-brown-light text-[10px] sm:text-xs">
            Secret game unlocked!
          </p>
        </motion.div>

        {/* Score and lives */}
        <div className="flex justify-between items-center mb-2 sm:mb-3 px-2 sm:px-4">
          <div className="font-body text-brown text-sm sm:text-base">
            Score: <span className="font-semibold text-blush">{score}</span>
          </div>
          <div className="font-body text-brown text-sm sm:text-base">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100" : "opacity-30"}>
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Game area */}
        <motion.div
          ref={gameAreaRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-cream/50 rounded-2xl overflow-hidden shadow-lg border-2 border-brown-light/20 touch-none select-none"
          style={{ width: gameDimensions.width, height: gameDimensions.height, margin: '0 auto' }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={(e) => {
            // Prevent scrolling when touching game area
            e.preventDefault();
            handleMove(e.touches[0].clientX);
          }}
        >
          {/* Falling items */}
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute flex items-center justify-center"
                style={{
                  left: item.x,
                  top: item.y,
                  width: gameDimensions.itemSize,
                  height: gameDimensions.itemSize,
                  fontSize: `${gameDimensions.itemSize * 0.8}px`,
                }}
              >
                {getItemEmoji(item.type)}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Basket/catcher */}
          <motion.div
            className="absolute bottom-0 pointer-events-none"
            style={{ left: basketX, width: gameDimensions.basketWidth, height: gameDimensions.basketHeight }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <svg viewBox="0 0 80 60" className="w-full h-full drop-shadow-md" preserveAspectRatio="xMidYMid meet">
              {/* Basket */}
              <ellipse cx="40" cy="50" rx="38" ry="8" fill="#D4A574" />
              <path 
                d="M5 25 Q5 55 40 55 Q75 55 75 25" 
                fill="#E8C9A0" 
                stroke="#D4A574" 
                strokeWidth="2"
              />
              {/* Basket weave pattern */}
              <path d="M15 30 Q40 40 65 30" stroke="#D4A574" strokeWidth="1.5" fill="none" />
              <path d="M12 38 Q40 48 68 38" stroke="#D4A574" strokeWidth="1.5" fill="none" />
            </svg>
          </motion.div>

          {/* Start/Game Over overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-cream/90 flex flex-col items-center justify-center px-4"
              >
                {gameOver ? (
                  <>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="font-handwritten text-3xl sm:text-4xl text-blush mb-2"
                    >
                      Game Over!
                    </motion.p>
                    <p className="font-body text-brown text-sm sm:text-base mb-1">
                      Score: <span className="font-semibold">{score}</span>
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="font-body text-sage text-xs sm:text-sm mb-3 sm:mb-4">
                        New high score! 🎉
                      </p>
                    )}
                    <p className="font-body text-brown-light text-xs sm:text-sm mb-3 sm:mb-4">
                      High Score: {highScore}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-handwritten text-xl sm:text-2xl text-brown mb-2 text-center">
                      Move to catch falling treats!
                    </p>
                    <p className="font-body text-brown-light text-xs sm:text-sm mb-3 sm:mb-4">
                      🍵 Matcha = 3 points
                    </p>
                    {highScore > 0 && (
                      <p className="font-body text-brown-light text-[10px] sm:text-xs mb-3 sm:mb-4">
                        High Score: {highScore}
                      </p>
                    )}
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blush text-white font-body font-semibold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 text-sm sm:text-base"
                >
                  {gameOver ? "Play Again" : "Start Game"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        {isPlaying && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="font-body text-[10px] sm:text-xs text-brown-light mt-1.5 sm:mt-2"
          >
            Move your finger to catch!
          </motion.p>
        )}

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mt-3 sm:mt-4 mb-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 text-sm sm:text-base"
        >
          Back to Games
        </motion.button>
      </div>
    </div>
  );
}
