"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useConfetti } from "../effects/Confetti";
import FloatingHearts from "../effects/FloatingHearts";

interface ValentinePageProps {
  onNext: () => void;
  onPrev: () => void;
}

// Create a pleasant ding sound using Web Audio API
function playDingSound() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    // Create oscillator for the main tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bell-like frequency
    oscillator.frequency.setValueAtTime(830, audioContext.currentTime); // High G
    oscillator.type = "sine";
    
    // Quick attack, longer decay for bell sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
    
    // Add a second harmonic for richness
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.frequency.setValueAtTime(1660, audioContext.currentTime); // Octave up
    oscillator2.type = "sine";
    
    gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode2.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 1);
  } catch {
    // Audio not supported, that's okay
  }
}

export default function ValentinePage({ onNext }: ValentinePageProps) {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const hasPlayedRef = useRef(false);
  const { fireConfetti } = useConfetti();

  const handleYes = useCallback(() => {
    if (hasAnswered || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    
    setHasAnswered(true);
    setShowHearts(true);
    
    // Fire confetti
    fireConfetti();
    
    // Play ding sound
    playDingSound();

    // Stop hearts after a while
    setTimeout(() => {
      setShowHearts(false);
    }, 5000);
  }, [hasAnswered, fireConfetti]);

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <FloatingHearts isActive={showHearts} />
      
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 text-center">
        {/* Main content - before answer */}
        <AnimatePresence mode="wait">
          {!hasAnswered ? (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Opening text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-handwritten text-2xl sm:text-3xl text-brown-light leading-relaxed mb-4"
              >
                Everything you make is warm and thoughtful...
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="font-handwritten text-2xl sm:text-3xl text-brown leading-relaxed mb-12"
              >
                and so are you, <span className="text-blush font-semibold">Kezia</span>.
              </motion.p>

              {/* The question */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
                className="font-handwritten text-4xl sm:text-5xl md:text-6xl text-brown mb-10"
              >
                Will you be my Valentine?
              </motion.h2>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="px-8 py-4 bg-blush text-white font-body font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow min-w-[160px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
                >
                  Yes 💖
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="px-8 py-4 bg-sage text-white font-body font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow min-w-[160px] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                >
                  Obviously 💘
                </motion.button>
              </motion.div>

              {/* Decorative hearts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2.2 }}
                className="mt-12 flex justify-center gap-4"
                aria-hidden="true"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="text-blush"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
                      fill="currentColor"
                    />
                  </motion.svg>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="py-12"
            >
              {/* Big heart */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8"
                aria-hidden="true"
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  className="text-blush mx-auto"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
                    fill="currentColor"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </svg>
              </motion.div>

              {/* Love message */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-handwritten text-5xl sm:text-6xl md:text-7xl text-blush mb-6"
              >
                I love you
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="font-handwritten text-2xl sm:text-3xl text-brown-light"
              >
                Happy Valentine&apos;s Day, Kezia 💕
              </motion.p>

              {/* Play game button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="mt-8 px-6 py-3 bg-sage text-white font-body font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                Play a little game? 🍪
              </motion.button>

              {/* Restart hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="font-body text-sm text-brown-light/40 mt-8"
              >
                (you can flip back through anytime)
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-10 left-10 hidden lg:block"
        aria-hidden="true"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" className="text-blush" aria-hidden="true">
          <path
            d="M40 70C40 70 10 45 10 25C10 12 20 5 32 5C38 5 40 12 40 12C40 12 42 5 48 5C60 5 70 12 70 25C70 45 40 70 40 70Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-20 right-10 hidden lg:block"
        aria-hidden="true"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-sage" aria-hidden="true">
          <path
            d="M30 52C30 52 8 34 8 19C8 9 15 4 24 4C28 4 30 9 30 9C30 9 32 4 36 4C45 4 52 9 52 19C52 34 30 52 30 52Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  );
}
