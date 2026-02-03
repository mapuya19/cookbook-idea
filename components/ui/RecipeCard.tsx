"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface RecipeCardProps {
  title: string;
  description?: string;
  delay?: number;
}

export default function RecipeCard({ title, description, delay = 0 }: RecipeCardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  const handleCheck = () => {
    if (!isChecked) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 600);
    }
    setIsChecked(!isChecked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCheck();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        rotateY: 2,
        transition: { duration: 0.2 }
      }}
      className="recipe-card relative cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
      onClick={handleCheck}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={isChecked}
      aria-label={`${title}${description ? `: ${description}` : ""}. ${isChecked ? "Checked" : "Not checked"}`}
      tabIndex={0}
      style={{ perspective: 1000 }}
    >
      {/* Pin decoration */}
      <div className="absolute -top-2 right-5 w-4 h-4 bg-sage rounded-full shadow-md z-10" aria-hidden="true" />
      
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="relative flex-shrink-0 mt-1">
          <motion.div
            animate={{ scale: isChecked ? 1 : 1 }}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-300 ${
              isChecked 
                ? "bg-sage border-sage" 
                : "border-brown-light/40 group-hover:border-blush"
            }`}
          >
            <AnimatePresence>
              {isChecked && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 12l5 5L20 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sparkle effect */}
          <AnimatePresence>
            {showSparkle && (
              <div aria-hidden="true">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                      x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                      y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" className="text-blush">
                      <path
                        d="M4 0L4.5 3L8 4L4.5 5L4 8L3.5 5L0 4L3.5 3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 
            className={`font-handwritten text-xl sm:text-2xl transition-all duration-300 ${
              isChecked 
                ? "text-brown-light/50 line-through" 
                : "text-brown"
            }`}
          >
            {title}
          </h3>
          {description && (
            <p 
              className={`font-body text-sm mt-1 transition-all duration-300 ${
                isChecked 
                  ? "text-brown-light/30" 
                  : "text-brown-light/70"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {/* Heart icon that appears on check */}
        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 20 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex-shrink-0"
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-blush">
                <path
                  d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
