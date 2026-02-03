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
  type: "cookie" | "cupcake" | "heart";
  speed: number;
}

// Responsive game dimensions - will be calculated based on screen size
const getGameDimensions = () => {
  if (typeof window === 'undefined') return { width: 320, height: 450 };
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // On mobile, use more of the screen
  if (screenWidth < 640) {
    const width = Math.min(screenWidth - 32, 350); // 16px padding on each side
    const height = Math.min(screenHeight - 280, 450); // Leave room for header and buttons
    return { width, height };
  }
  return { width: 350, height: 500 };
};

const ITEM_SIZE = 50;
const CATCH_ZONE_HEIGHT = 80;

export default function CatchGame({ onBack }: CatchGameProps) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameDimensions, setGameDimensions] = useState({ width: 320, height: 450 });
  const [basketX, setBasketX] = useState(160 - 40);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const itemIdRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const { fireConfetti } = useConfetti();

  // Calculate responsive dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const dims = getGameDimensions();
      setGameDimensions(dims);
      setBasketX(dims.width / 2 - 40);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('catch_game_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        localStorage.setItem('catch_game_high_score', score.toString());
      }
    }
  }, [score, highScore]);

  // Spawn new items
  const spawnItem = useCallback(() => {
    const types: FallingItem["type"][] = ["cookie", "cupcake", "heart"];
    const newItem: FallingItem = {
      id: itemIdRef.current++,
      x: Math.random() * (gameDimensions.width - ITEM_SIZE),
      y: -ITEM_SIZE,
      type: types[Math.floor(Math.random() * types.length)],
      speed: 2 + Math.random() * 2 + Math.floor(score / 10) * 0.5, // Speed increases with score
    };
    setItems(prev => [...prev, newItem]);
  }, [score, gameDimensions.width]);

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
      const gameHeight = gameDimensions.height;

      for (const item of prev) {
        const newY = item.y + item.speed;

        // Check if caught (in catch zone and overlapping basket)
        const basketLeft = basketX;
        const basketRight = basketX + 80;
        const itemCenter = item.x + ITEM_SIZE / 2;
        const inCatchZone = newY + ITEM_SIZE >= gameHeight - CATCH_ZONE_HEIGHT;
        const inBasket = itemCenter >= basketLeft && itemCenter <= basketRight;

        if (inCatchZone && inBasket && newY < gameHeight) {
          // Caught!
          playCatchSound();
          setScore(s => s + (item.type === "heart" ? 3 : 1));
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

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, spawnItem, basketX, lives, score]);

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
    const x = clientX - rect.left - 40; // Center basket on cursor
    setBasketX(Math.max(0, Math.min(gameDimensions.width - 80, x)));
  }, [isPlaying, gameDimensions.width]);

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
    setBasketX(gameDimensions.width / 2 - 40);
    lastSpawnRef.current = 0;
    itemIdRef.current = 0;
  }, [gameDimensions.width]);

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
      case "heart": return "💖";
    }
  };

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="font-handwritten text-3xl sm:text-4xl text-brown mb-1">
            Catch the Cookies! 🍪
          </h2>
          <p className="font-body text-brown-light text-xs">
            Secret game unlocked!
          </p>
        </motion.div>

        {/* Score and lives */}
        <div className="flex justify-between items-center mb-3 px-4">
          <div className="font-body text-brown">
            Score: <span className="font-semibold text-blush">{score}</span>
          </div>
          <div className="font-body text-brown">
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
          className="relative mx-auto bg-cream/50 rounded-2xl overflow-hidden shadow-lg border-2 border-brown-light/20 touch-none select-none"
          style={{ width: gameDimensions.width, height: gameDimensions.height }}
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
                className="absolute text-4xl"
                style={{
                  left: item.x,
                  top: item.y,
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                }}
              >
                {getItemEmoji(item.type)}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Basket/catcher */}
          <motion.div
            className="absolute bottom-0 pointer-events-none"
            style={{ left: basketX, width: 80, height: CATCH_ZONE_HEIGHT }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <svg viewBox="0 0 80 60" className="w-full h-full drop-shadow-md">
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
                className="absolute inset-0 bg-cream/90 flex flex-col items-center justify-center"
              >
                {gameOver ? (
                  <>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="font-handwritten text-4xl text-blush mb-2"
                    >
                      Game Over!
                    </motion.p>
                    <p className="font-body text-brown mb-1">
                      Score: <span className="font-semibold">{score}</span>
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="font-body text-sage text-sm mb-4">
                        New high score! 🎉
                      </p>
                    )}
                    <p className="font-body text-brown-light text-sm mb-4">
                      High Score: {highScore}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-handwritten text-2xl text-brown mb-2">
                      Move to catch falling treats!
                    </p>
                    <p className="font-body text-brown-light text-sm mb-4">
                      💖 Hearts = 3 points
                    </p>
                    {highScore > 0 && (
                      <p className="font-body text-brown-light text-xs mb-4">
                        High Score: {highScore}
                      </p>
                    )}
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-6 py-3 bg-blush text-white font-body font-semibold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
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
            className="font-body text-xs text-brown-light mt-2"
          >
            Move your mouse or finger to catch!
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
          className="mt-4 px-6 py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2"
        >
          Back to Games
        </motion.button>
      </div>
    </div>
  );
}
