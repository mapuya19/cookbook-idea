"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  initialRotate: number;
  finalRotate: number;
  opacityValues: number[];
  scaleValues: number[];
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
          initialRotate: -20 + Math.random() * 40,
          finalRotate: -20 + Math.random() * 40,
          opacityValues: [0, 1, 1, 0],
          scaleValues: [0, 1, 1, 0.5],
        });
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
              rotate: heart.initialRotate,
            }}
            animate={{
              y: "-20vh",
              opacity: heart.opacityValues,
              scale: heart.scaleValues,
              rotate: heart.finalRotate,
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
            <span style={{ fontSize: heart.size }}>🍵</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
