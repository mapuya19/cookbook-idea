"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

interface FloatingHeartsProps {
  isActive: boolean;
}

export default function FloatingHearts({ isActive }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate hearts
      const newHearts: Heart[] = [];
      for (let i = 0; i < 20; i++) {
        newHearts.push({
          id: i,
          x: Math.random() * 100,
          size: 16 + Math.random() * 24,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2,
        });
      }
      setHearts(newHearts);

      // Clear hearts after animation
      const timeout = setTimeout(() => {
        setHearts([]);
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              y: "100vh", 
              x: `${heart.x}vw`,
              opacity: 0,
              scale: 0,
              rotate: -20 + Math.random() * 40,
            }}
            animate={{ 
              y: "-20vh",
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              rotate: -20 + Math.random() * 40,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeOut",
            }}
            className="absolute"
            style={{ left: `${heart.x}%` }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              className="text-blush"
            >
              <path
                d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
