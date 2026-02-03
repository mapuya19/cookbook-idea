"use client";

import { motion } from "framer-motion";
import Polaroid from "../ui/Polaroid";

interface SignatureBakesProps {
  onNext: () => void;
  onPrev: () => void;
}

const bakes = [
  {
    title: "Miffy Cookies",
    caption: "These little guys have my whole heart",
    expandedCaption: "Every time you make these, I fall in love all over again. The cutest cookies ever made.",
    placeholder: "cookie" as const,
    rotation: -4,
    imageSrc: "/images/miffy-cookies.jpg",
  },
  {
    title: "Heart Pizza",
    caption: "Proof that love is delicious",
    expandedCaption: "You turned a simple dinner into one of my favorite memories. That's your superpower.",
    placeholder: "pizza" as const,
    rotation: 3,
    imageSrc: "/images/heart-pizza.jpg",
  },
  {
    title: "Mango Mochi",
    caption: "Soft, sweet, just like you",
    expandedCaption: "Watching you make these was like watching magic happen. And they tasted like it too.",
    placeholder: "mochi" as const,
    rotation: -2,
    imageSrc: "/images/mango-mochi.jpg",
  },
  {
    title: "Her Cookies",
    caption: "I think about these more than I should",
    expandedCaption: "Honestly, I daydream about your cookies. Is that weird? I don't care. They're that good.",
    placeholder: "bread" as const,
    rotation: 5,
    imageSrc: "/images/cookies.jpg",
  },
];

export default function SignatureBakes({ onNext }: SignatureBakesProps) {
  return (
    <div className="scrapbook-page paper-texture">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            Your Signature Bakes
          </h2>
          <p className="font-body text-brown-light/70 text-sm sm:text-base">
            tap a photo to read more
          </p>
        </motion.div>

        {/* Polaroid grid - scattered layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          {bakes.map((bake, index) => (
            <Polaroid
              key={bake.title}
              title={bake.title}
              caption={bake.caption}
              expandedCaption={bake.expandedCaption}
              placeholder={bake.placeholder}
              rotation={bake.rotation}
              delay={0.2 + index * 0.15}
              // Use placeholder if image doesn't exist
              imageSrc={undefined}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute top-20 right-8 hidden lg:block"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-blush/30">
            <path
              d="M30 55C30 55 5 35 5 20C5 10 12 3 22 3C27 3 30 8 30 8C30 8 33 3 38 3C48 3 55 10 55 20C55 35 30 55 30 55Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-32 left-8 hidden lg:block"
        >
          <svg width="50" height="50" viewBox="0 0 50 50" className="text-sage/40">
            <circle cx="25" cy="25" r="20" fill="currentColor" />
            <circle cx="18" cy="20" r="4" fill="#5D4037" opacity="0.5" />
            <circle cx="32" cy="22" r="3" fill="#5D4037" opacity="0.5" />
            <circle cx="25" cy="32" r="4" fill="#5D4037" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Continue hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-8 sm:mt-12"
        >
          <button
            onClick={onNext}
            className="font-handwritten text-lg text-brown-light/60 hover:text-blush transition-colors flex items-center gap-2 mx-auto group"
          >
            keep flipping
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
