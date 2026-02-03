"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  const fireConfetti = useCallback(() => {
    // First burst - center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F4A5AE", "#A8C69F", "#FFB6C1", "#FDF6E3", "#E8CBA8"],
    });

    // Second burst - left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#F4A5AE", "#A8C69F", "#FFB6C1", "#FDF6E3"],
      });
    }, 150);

    // Third burst - right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#F4A5AE", "#A8C69F", "#FFB6C1", "#FDF6E3"],
      });
    }, 300);

    // Heart-shaped confetti burst
    setTimeout(() => {
      const heart = confetti.shapeFromPath({
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      });

      confetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.5 },
        shapes: [heart],
        colors: ["#F4A5AE", "#FFB6C1", "#FF69B4"],
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
