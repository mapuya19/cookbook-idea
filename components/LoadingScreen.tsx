"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
  imagesToPreload?: string[];
}

export default function LoadingScreen({ onLoadComplete, imagesToPreload = [] }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Preheating the oven...");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;
    
    // Minimum loading time for the animation to feel nice
    const minLoadTime = 2000;
    const startTime = Date.now();

    const updateProgress = () => {
      loadedCount++;
      const imageProgress = totalImages > 0 ? (loadedCount / totalImages) * 100 : 100;
      setProgress(imageProgress);
    };

    // Preload images
    if (totalImages > 0) {
      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress; // Count errors as loaded to not block
        img.src = src;
      });
    } else {
      // Simulate progress if no images
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }

    // Ensure minimum load time for nice animation
    const checkComplete = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= minLoadTime && (loadedCount >= totalImages || totalImages === 0)) {
        clearInterval(checkComplete);
        setLoadingText("Ready to bake!");
        setIsComplete(true);
        setTimeout(() => {
          onLoadComplete();
        }, 800);
      }
    }, 100);

    return () => {
      clearInterval(checkComplete);
    };
  }, [imagesToPreload, onLoadComplete]);

  // Update loading text based on progress
  useEffect(() => {
    if (isComplete) return;
    
    if (progress < 30) {
      setLoadingText("Preheating the oven...");
    } else if (progress < 60) {
      setLoadingText("Gathering ingredients...");
    } else if (progress < 90) {
      setLoadingText("Almost ready...");
    }
  }, [progress, isComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-100 bg-cream flex flex-col items-center justify-center"
      >
        {/* Oven SVG - responsive sizing */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6 sm:mb-8"
        >
          <svg width="140" height="158" viewBox="0 0 160 180" fill="none" aria-hidden="true" className="sm:w-[160px] sm:h-[180px]">
            {/* Oven body */}
            <rect x="10" y="40" width="140" height="130" rx="8" fill="#E8C9A0" />
            <rect x="15" y="45" width="130" height="120" rx="6" fill="#D4A574" />
            
            {/* Oven door */}
            <rect x="25" y="70" width="110" height="85" rx="4" fill="#8B7355" />
            <rect x="30" y="75" width="100" height="75" rx="2" fill="#2D2D2D" />
            
            {/* Oven window with glow effect */}
            <motion.rect
              x="35"
              y="80"
              width="90"
              height="65"
              rx="2"
              fill="#FF6B35"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Window reflection */}
            <rect x="35" y="80" width="90" height="65" rx="2" fill="url(#ovenGlow)" />
            
            {/* Door handle */}
            <rect x="55" y="158" width="50" height="6" rx="3" fill="#A89078" />
            
            {/* Control panel */}
            <rect x="25" y="48" width="110" height="18" rx="2" fill="#A89078" />
            
            {/* Temperature dial */}
            <circle cx="50" cy="57" r="6" fill="#FDF6E3" />
            <motion.line
              x1="50"
              y1="57"
              x2="50"
              y2="52"
              stroke="#8B7355"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformOrigin: "50px 57px" }}
            />
            
            {/* Timer display */}
            <rect x="70" y="52" width="30" height="10" rx="1" fill="#2D2D2D" />
            <motion.text
              x="85"
              y="60"
              textAnchor="middle"
              fontSize="8"
              fill="#FF6B35"
              fontFamily="monospace"
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              {Math.round(progress)}°
            </motion.text>
            
            {/* Indicator light */}
            <motion.circle
              cx="115"
              cy="57"
              r="4"
              fill={isComplete ? "#A8C69F" : "#F4A5AE"}
              animate={{
                opacity: isComplete ? 1 : [1, 0.4, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: isComplete ? 0 : Infinity,
              }}
            />
            
            {/* Oven feet */}
            <rect x="20" y="170" width="15" height="10" rx="2" fill="#8B7355" />
            <rect x="125" y="170" width="15" height="10" rx="2" fill="#8B7355" />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="ovenGlow" x1="35" y1="80" x2="35" y2="145">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steam/heat waves */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2"
            animate={{
              y: [-5, -15, -5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" aria-hidden="true">
              <motion.path
                d="M10 25 Q15 15 10 10 Q5 5 10 0"
                stroke="#A89078"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
              <motion.path
                d="M30 25 Q35 15 30 10 Q25 5 30 0"
                stroke="#A89078"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <motion.path
                d="M50 25 Q55 15 50 10 Q45 5 50 0"
                stroke="#A89078"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-40 sm:w-48 h-2.5 sm:h-3 bg-brown-light/20 rounded-full overflow-hidden mb-3 sm:mb-4">
          <motion.div
            className="h-full bg-blush rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Loading text */}
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="font-handwritten text-xl sm:text-2xl text-brown"
        >
          {loadingText}
        </motion.p>

        {/* Decorative cookies - hidden on very small screens */}
        <motion.div
          className="absolute bottom-10 left-6 sm:left-10 opacity-20 hidden sm:block"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl sm:text-4xl">🍪</span>
        </motion.div>
        <motion.div
          className="absolute bottom-16 right-8 sm:right-12 opacity-20 hidden sm:block"
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-2xl sm:text-3xl">🧁</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
