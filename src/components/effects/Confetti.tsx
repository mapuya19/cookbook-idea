"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  const fireConfetti = useCallback(() => {
    // Matcha-themed confetti colors
    const matchaColors = ["#7B9E6C", "#A8C69F", "#8AAA79", "#B5D4A5", "#F5F5F0"];
    
    // First burst - center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: matchaColors,
    });

    // Second burst - left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: matchaColors,
      });
    }, 150);

    // Third burst - right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: matchaColors,
      });
    }, 300);

    // Leaf-shaped confetti burst (instead of hearts)
    setTimeout(() => {
      const leaf = confetti.shapeFromPath({
        path: "M12 2C12 2 4 8 4 14C4 18 7.5 22 12 22C16.5 22 20 18 20 14C20 8 12 2 12 2Z",
      });

      confetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.5 },
        shapes: [leaf],
        colors: ["#7B9E6C", "#5A7A4C", "#8AAA79"],
        scalar: 2,
      });
    }, 500);
  }, []);

  return { fireConfetti };
}

export default function Confetti() {
  // This component doesn't render anything visible
  // It's just a hook container
  return null;
}
