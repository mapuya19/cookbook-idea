"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  type: "heart" | "cookie";
  rotation: number;
  scale: number;
}

// Check if device is touch-only
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Check if user prefers reduced motion
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const throttleRef = useRef(false);

  // Compute initial enabled state synchronously to avoid cascading renders
  const getIsEnabled = () => {
    if (typeof window === "undefined") return false;
    return !isTouchDevice() && !prefersReducedMotion();
  };

  const [isEnabled, setIsEnabled] = useState(getIsEnabled);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setIsEnabled(!isTouchDevice() && !mediaQuery.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const addParticle = useCallback((x: number, y: number) => {
    const newParticle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      type: Math.random() > 0.5 ? "heart" : "cookie",
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    };

    setParticles((prev) => [...prev.slice(-15), newParticle]); // Keep max 15 particles

    // Remove particle after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle to every 50ms for performance
      if (throttleRef.current) return;
      throttleRef.current = true;
      setTimeout(() => {
        throttleRef.current = false;
      }, 50);

      // Only spawn if mouse moved enough distance
      const dx = e.clientX - lastPositionRef.current.x;
      const dy = e.clientY - lastPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 30) {
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        addParticle(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isEnabled, addParticle]);

  if (!isEnabled) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-60 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x - 10,
              y: particle.y - 10,
              opacity: 0.8,
              scale: particle.scale,
              rotate: particle.rotation,
            }}
            animate={{
              y: particle.y + 50,
              opacity: 0,
              scale: particle.scale * 0.5,
              rotate: particle.rotation + 45,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="absolute"
            style={{ left: 0, top: 0 }}
          >
            {particle.type === "heart" ? (
              <span className="text-xl opacity-60">🍵</span>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-brown/40"
              >
                {/* Matcha cookie crumb */}
                <circle cx="12" cy="12" r="8" fill="#A8C69F" />
                <circle cx="9" cy="10" r="2" fill="#5A7A4C" />
                <circle cx="15" cy="11" r="1.5" fill="#5A7A4C" />
                <circle cx="11" cy="15" r="1.5" fill="#5A7A4C" />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
