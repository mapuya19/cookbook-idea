"use client";

import { motion } from "framer-motion";
import Polaroid from "../ui/Polaroid";

interface SignatureBakesProps {
  onNext: () => void;
  onPrev: () => void;
}

const bakes = [
  {
    title: "Matcha Checkerboard Cookies",
    caption: "The precision. The patience. Incredible.",
    expandedCaption: "These took so much skill to make. Every little square perfectly aligned. You're amazing.",
    placeholder: "cookie" as const,
    rotation: -4,
    imageSrc: "/images/matcha-cookies.jpg",
  },
  {
    title: "Cake Decorating Date",
    caption: "Miffy & Cinnamoroll, side by side",
    expandedCaption: "That class we took together — your Miffy cake turned out so cute. One of my favorite date memories.",
    placeholder: "cookie" as const,
    rotation: 3,
    imageSrc: "/images/cake-class.jpg",
  },
  {
    title: "Miffy Dessert",
    caption: "Art you can eat",
    expandedCaption: "You decorated this at C as in Charlie and it was almost too cute to eat. Almost.",
    placeholder: "mochi" as const,
    rotation: -2,
    imageSrc: "/images/miffy-dessert.jpg",
  },
  {
    title: "Heart Pizza",
    caption: "Proof that love is delicious",
    expandedCaption: "You turned a simple dinner into one of my favorite memories. That golden crust, the fresh basil... perfect.",
    placeholder: "pizza" as const,
    rotation: 5,
    imageSrc: "/images/heart-pizza.jpg",
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
              imageSrc={bake.imageSrc}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute top-20 right-8 hidden lg:block"
          aria-hidden="true"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-blush/30" aria-hidden="true">
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
          aria-hidden="true"
        >
          <svg width="50" height="50" viewBox="0 0 50 50" className="text-sage/40" aria-hidden="true">
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
            className="font-handwritten text-lg text-brown-light/60 hover:text-blush transition-colors flex items-center gap-2 mx-auto group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            keep flipping
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
