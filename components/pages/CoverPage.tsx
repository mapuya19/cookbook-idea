"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CoverPageProps {
  onNext: () => void;
  onPrev: () => void;
}

// Ingredient that flies in from outside the screen and settles into a mixing bowl
const FlyingIngredient = ({ 
  delay, 
  startX, 
  startY, 
  endX, 
  endY, 
  size, 
  rotation,
  type 
}: { 
  delay: number; 
  startX: string; 
  startY: string; 
  endX: string; 
  endY: string; 
  size: number; 
  rotation: number;
  type: "flour" | "egg" | "sugar" | "butter" | "chocolate";
}) => {
  const getIngredient = () => {
    switch (type) {
      case "flour":
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <ellipse cx="40" cy="50" rx="35" ry="25" fill="#F5F5DC" />
            <ellipse cx="40" cy="45" rx="30" ry="20" fill="#FFFEF0" />
            <text x="40" y="52" textAnchor="middle" fontSize="12" fill="#8B7355" fontFamily="serif">FLOUR</text>
          </svg>
        );
      case "egg":
        return (
          <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none" aria-hidden="true">
            <ellipse cx="30" cy="40" rx="25" ry="30" fill="#FFF8E7" />
            <ellipse cx="30" cy="38" rx="22" ry="27" fill="#FFFDF5" />
          </svg>
        );
      case "sugar":
        return (
          <svg width={size} height={size} viewBox="0 0 70 70" fill="none" aria-hidden="true">
            <rect x="10" y="15" width="50" height="45" rx="5" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="2" />
            <text x="35" y="42" textAnchor="middle" fontSize="10" fill="#D4A574" fontFamily="serif">SUGAR</text>
          </svg>
        );
      case "butter":
        return (
          <svg width={size} height={size * 0.6} viewBox="0 0 80 48" fill="none" aria-hidden="true">
            <rect x="5" y="8" width="70" height="35" rx="4" fill="#FFF4C4" />
            <rect x="10" y="12" width="60" height="27" rx="2" fill="#FFE566" />
          </svg>
        );
      case "chocolate":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="50" height="50" rx="4" fill="#5D4037" />
            <line x1="20" y1="5" x2="20" y2="55" stroke="#4A3228" strokeWidth="2" />
            <line x1="40" y1="5" x2="40" y2="55" stroke="#4A3228" strokeWidth="2" />
            <line x1="5" y1="20" x2="55" y2="20" stroke="#4A3228" strokeWidth="2" />
            <line x1="5" y1="40" x2="55" y2="40" stroke="#4A3228" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{ left: startX, top: startY }}
      initial={{ opacity: 0, scale: 0.3, rotate: rotation - 180 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0.3, 1.2, 1, 0.5],
        x: ["0%", "20%", endX],
        y: ["0%", "-30%", endY],
        rotate: [rotation - 180, rotation + 45, rotation + 720],
      }}
      transition={{
        delay,
        duration: 1.8,
        ease: [0.34, 1.56, 0.64, 1],
        times: [0, 0.3, 0.7, 1],
      }}
      aria-hidden="true"
    >
      {getIngredient()}
    </motion.div>
  );
};

// Mixing bowl that appears and "catches" ingredients
const MixingBowl = ({ show }: { show: boolean }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
    initial={{ opacity: 0, scale: 0, y: 100 }}
    animate={show ? { 
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0],
      y: [100, 0, 0, -50],
    } : {}}
    transition={{
      duration: 2.5,
      ease: "easeOut",
      times: [0, 0.2, 0.8, 1],
    }}
    aria-hidden="true"
  >
    <svg width="200" height="150" viewBox="0 0 200 150" fill="none" aria-hidden="true">
      {/* Bowl */}
      <ellipse cx="100" cy="120" rx="90" ry="25" fill="#E8C9A0" />
      <path d="M10 80 Q10 140 100 140 Q190 140 190 80 L190 75 Q190 120 100 120 Q10 120 10 75 Z" fill="#D4A574" />
      <ellipse cx="100" cy="75" rx="90" ry="25" fill="#E8C9A0" />
      {/* Batter swirl */}
      <motion.ellipse 
        cx="100" 
        cy="75" 
        rx="70" 
        ry="18" 
        fill="#FFF8DC"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M50 75 Q75 65 100 75 Q125 85 150 75"
        stroke="#D4A574"
        strokeWidth="3"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "100px 75px" }}
      />
    </svg>
  </motion.div>
);

// Sparkle burst effect
const SparklesBurst = ({ show }: { show: boolean }) => {
  // Use deterministic sizes based on index to avoid hydration mismatch
  const sparkleSizes = [12, 9, 14, 10, 13, 8, 15, 11, 9, 14, 10, 12];
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) * (Math.PI / 180),
    delay: i * 0.03,
    size: sparkleSizes[i],
  }));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : {}}
      aria-hidden="true"
    >
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0, 
            opacity: 0 
          }}
          animate={show ? {
            x: Math.cos(sparkle.angle) * 150,
            y: Math.sin(sparkle.angle) * 150,
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          } : {}}
          transition={{
            delay: 2.2 + sparkle.delay,
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
              fill="#F4A5AE"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Floating decorations - cookies, hearts, and baking items (appear after intro)
const FloatingCookie = ({ delay, x, y, size, rotation, introComplete }: { delay: number; x: string; y: string; size: number; rotation: number; introComplete: boolean }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={introComplete ? { 
      opacity: 0.8, 
      scale: 1,
      y: [0, -15, 0],
      rotate: [rotation, rotation + 5, rotation]
    } : {}}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
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

const FloatingHeart = ({ delay, x, y, size, rotation, introComplete }: { delay: number; x: string; y: string; size: number; rotation: number; introComplete: boolean }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={introComplete ? { 
      opacity: 0.6, 
      scale: 1,
      y: [0, -20, 0],
      rotate: [rotation, rotation - 5, rotation]
    } : {}}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
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

const FloatingWhisk = ({ delay, x, y, size, rotation, introComplete }: { delay: number; x: string; y: string; size: number; rotation: number; introComplete: boolean }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, rotate: rotation }}
    animate={introComplete ? { 
      opacity: 0.5, 
      scale: 1,
      y: [0, -12, 0],
      rotate: [rotation, rotation + 8, rotation]
    } : {}}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
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
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Intro animation completes after ~3 seconds
    const timer = setTimeout(() => {
      setIntroComplete(true);
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Delay for main content to appear after intro
  const contentDelay = 2.8;

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      {/* Intro Animation - Ingredients flying into bowl */}
      {showIntro && (
        <>
          <FlyingIngredient 
            delay={0} 
            startX="-10%" 
            startY="20%" 
            endX="50vw" 
            endY="50vh" 
            size={60} 
            rotation={-30} 
            type="flour" 
          />
          <FlyingIngredient 
            delay={0.3} 
            startX="110%" 
            startY="10%" 
            endX="-50vw" 
            endY="40vh" 
            size={45} 
            rotation={15} 
            type="egg" 
          />
          <FlyingIngredient 
            delay={0.6} 
            startX="-15%" 
            startY="70%" 
            endX="55vw" 
            endY="-20vh" 
            size={55} 
            rotation={-20} 
            type="sugar" 
          />
          <FlyingIngredient 
            delay={0.9} 
            startX="115%" 
            startY="60%" 
            endX="-55vw" 
            endY="-10vh" 
            size={65} 
            rotation={25} 
            type="butter" 
          />
          <FlyingIngredient 
            delay={1.2} 
            startX="50%" 
            startY="-10%" 
            endX="0vw" 
            endY="60vh" 
            size={50} 
            rotation={0} 
            type="chocolate" 
          />
          <MixingBowl show={true} />
          <SparklesBurst show={true} />
        </>
      )}

      {/* Floating decorations - appear after intro */}
      <FloatingCookie delay={0.2} x="8%" y="15%" size={60} rotation={-15} introComplete={introComplete} />
      <FloatingCookie delay={0.5} x="85%" y="20%" size={45} rotation={20} introComplete={introComplete} />
      <FloatingCookie delay={0.8} x="12%" y="75%" size={50} rotation={10} introComplete={introComplete} />
      <FloatingHeart delay={0.3} x="78%" y="70%" size={55} rotation={15} introComplete={introComplete} />
      <FloatingHeart delay={0.6} x="5%" y="45%" size={40} rotation={-10} introComplete={introComplete} />
      <FloatingHeart delay={0.9} x="90%" y="45%" size={35} rotation={5} introComplete={introComplete} />
      <FloatingWhisk delay={0.4} x="88%" y="8%" size={40} rotation={25} introComplete={introComplete} />
      <FloatingWhisk delay={0.7} x="3%" y="85%" size={35} rotation={-20} introComplete={introComplete} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto">
        {/* Decorative top element */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: contentDelay, duration: 0.8, type: "spring", stiffness: 150 }}
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

        {/* Title - letter by letter reveal */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: contentDelay + 0.2, duration: 0.3 }}
          className="font-handwritten text-5xl sm:text-6xl md:text-7xl text-brown leading-tight mb-4"
        >
          <motion.span
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: contentDelay + 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="inline-block"
          >
            Things You Bake,
          </motion.span>
          <br />
          <motion.span 
            className="text-blush inline-block"
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: contentDelay + 0.5, duration: 0.6, type: "spring", stiffness: 100 }}
          >
            Things I Love
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: contentDelay + 0.8, duration: 0.6 }}
          className="font-handwritten text-2xl sm:text-3xl text-brown-light mb-2"
        >
          A little baking scrapbook for{" "}
          <motion.span 
            className="text-blush font-semibold inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: contentDelay + 1.1, 
              duration: 0.5, 
              type: "spring",
              stiffness: 300,
              damping: 10
            }}
          >
            Kezia
          </motion.span>
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: contentDelay + 1.2, duration: 0.6 }}
          className="font-body text-base sm:text-lg text-brown-light/70 italic mb-12"
        >
          Made with love (and very little baking skill)
        </motion.p>

        {/* Open button - bounces in */}
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            delay: contentDelay + 1.4, 
            duration: 0.7, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative px-8 py-4 bg-blush text-white font-body font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          {/* Button shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ delay: contentDelay + 2, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
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
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: contentDelay + 1.6, duration: 0.6 }}
          className="mt-12 flex items-center gap-3"
          aria-hidden="true"
        >
          <motion.div 
            className="w-12 h-px bg-brown-light/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: contentDelay + 1.6, duration: 0.4 }}
            style={{ transformOrigin: "right" }}
          />
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-blush/60" 
            aria-hidden="true"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: contentDelay + 1.7, duration: 0.5, type: "spring" }}
          >
            <path
              d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
              fill="currentColor"
            />
          </motion.svg>
          <motion.div 
            className="w-12 h-px bg-brown-light/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: contentDelay + 1.6, duration: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
