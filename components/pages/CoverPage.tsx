"use client";

import { motion } from "framer-motion";

interface CoverPageProps {
  onNext: () => void;
  onPrev: () => void;
}

// Floating decorations - cookies, hearts, and baking items
const FloatingCookie = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: 0.8, 
      scale: 1,
      y: [0, -15, 0],
      rotate: [rotation, rotation + 5, rotation]
    }}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5 },
      y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    aria-hidden="true"
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* Cookie shape */}
      <circle cx="50" cy="50" r="45" fill="#D4A574" />
      <circle cx="50" cy="50" r="42" fill="#E8C9A0" />
      {/* Chocolate chips */}
      <circle cx="35" cy="35" r="6" fill="#5D4037" />
      <circle cx="60" cy="30" r="5" fill="#5D4037" />
      <circle cx="45" cy="55" r="7" fill="#5D4037" />
      <circle cx="70" cy="55" r="5" fill="#5D4037" />
      <circle cx="30" cy="60" r="4" fill="#5D4037" />
      <circle cx="55" cy="70" r="6" fill="#5D4037" />
    </svg>
  </motion.div>
);

const FloatingHeart = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: 0.6, 
      scale: 1,
      y: [0, -20, 0],
      rotate: [rotation, rotation - 5, rotation]
    }}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5 },
      y: { delay: delay + 0.3, duration: 4, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay: delay + 0.3, duration: 5, repeat: Infinity, ease: "easeInOut" }
    }}
    aria-hidden="true"
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path
        d="M50 88C50 88 10 55 10 35C10 20 22 10 35 10C43 10 50 15 50 15C50 15 57 10 65 10C78 10 90 20 90 35C90 55 50 88 50 88Z"
        fill="#F4A5AE"
      />
    </svg>
  </motion.div>
);

const FloatingWhisk = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, rotate: rotation }}
    animate={{ 
      opacity: 0.5, 
      scale: 1,
      y: [0, -12, 0],
      rotate: [rotation, rotation + 8, rotation]
    }}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5 },
      y: { delay: delay + 0.4, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay: delay + 0.4, duration: 4.5, repeat: Infinity, ease: "easeInOut" }
    }}
    aria-hidden="true"
  >
    <svg width={size} height={size * 1.5} viewBox="0 0 60 90" fill="none" aria-hidden="true">
      {/* Handle */}
      <rect x="27" y="0" width="6" height="35" rx="3" fill="#8B7355" />
      {/* Whisk wires */}
      <ellipse cx="30" cy="60" rx="20" ry="25" stroke="#A89078" strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="60" rx="12" ry="20" stroke="#A89078" strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="60" rx="5" ry="15" stroke="#A89078" strokeWidth="2" fill="none" />
    </svg>
  </motion.div>
);

export default function CoverPage({ onNext }: CoverPageProps) {
  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      {/* Floating decorations */}
      <FloatingCookie delay={0.2} x="8%" y="15%" size={60} rotation={-15} />
      <FloatingCookie delay={0.5} x="85%" y="20%" size={45} rotation={20} />
      <FloatingCookie delay={0.8} x="12%" y="75%" size={50} rotation={10} />
      <FloatingHeart delay={0.3} x="78%" y="70%" size={55} rotation={15} />
      <FloatingHeart delay={0.6} x="5%" y="45%" size={40} rotation={-10} />
      <FloatingHeart delay={0.9} x="90%" y="45%" size={35} rotation={5} />
      <FloatingWhisk delay={0.4} x="88%" y="8%" size={40} rotation={25} />
      <FloatingWhisk delay={0.7} x="3%" y="85%" size={35} rotation={-20} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto">
        {/* Decorative top element */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
          aria-hidden="true"
        >
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="text-blush" aria-hidden="true">
            <path
              d="M10 20C10 20 30 5 60 5C90 5 110 20 110 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="60" cy="5" r="4" fill="currentColor" />
            <path
              d="M55 8L60 15L65 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="font-handwritten text-5xl sm:text-6xl md:text-7xl text-brown leading-tight mb-4"
        >
          Things You Bake,
          <br />
          <span className="text-blush">Things I Love</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-handwritten text-2xl sm:text-3xl text-brown-light mb-2"
        >
          A little baking scrapbook for{" "}
          <span className="text-blush font-semibold">Kezia</span>
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="font-body text-base sm:text-lg text-brown-light/70 italic mb-12"
        >
          Made with love (and very little baking skill)
        </motion.p>

        {/* Open button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative px-8 py-4 bg-blush text-white font-body font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          {/* Button shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            Open Scrapbook
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </motion.button>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-12 flex items-center gap-3"
          aria-hidden="true"
        >
          <div className="w-12 h-px bg-brown-light/30" />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blush/60" aria-hidden="true">
            <path
              d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
              fill="currentColor"
            />
          </svg>
          <div className="w-12 h-px bg-brown-light/30" />
        </motion.div>
      </div>
    </div>
  );
}
