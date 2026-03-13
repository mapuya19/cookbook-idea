"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useConfetti } from "../effects/Confetti";
import FloatingHearts from "../effects/FloatingHearts";
import { LoveNoteHeart } from "../effects/LoveNotes";
import { playDingSound } from "@/utils/sounds";

interface ValentinePageProps {
  onNext: () => void;
  onPrev: () => void;
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
                  <motion.span
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
                    className="text-xl"
                    aria-hidden="true"
                  >
                    🍡
                  </motion.span>
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
              {/* Big dango */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8 text-center"
                aria-hidden="true"
              >
                <motion.span
                  className="text-8xl sm:text-9xl inline-block"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  🍡
                </motion.span>
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

      {/* Background decorative elements - positioned in far corners to avoid content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 0.5 }}
        className="absolute top-2 left-2 hidden xl:block pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-3xl">🍡</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-2 right-2 hidden xl:block pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-3xl">🍡</span>
      </motion.div>

      <LoveNoteHeart x="8%" y="50%" delay={0.3} rotation={5} />
      <LoveNoteHeart x="88%" y="30%" delay={0.4} rotation={-5} />
    </div>
  );
}
