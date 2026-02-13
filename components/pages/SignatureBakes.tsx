"use client";

import { motion } from "framer-motion";
import Polaroid from "../ui/Polaroid";
import { LoveNoteHeart } from "../effects/LoveNotes";

const FloatingHeart = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <div
    className="absolute pointer-events-none animate-float-slow"
    style={{
      left: x,
      top: y,
      fontSize: size,
      color: "#A8C69F",
      animationDelay: `${delay}s`,
      opacity: '0.6',
      transform: `rotate(${rotation}deg)`
    }}
    aria-hidden="true"
  >
    🍵
  </div>
);

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
              placeholder={bake.placeholder}
              rotation={bake.rotation}
              delay={0.2 + index * 0.15}
              imageSrc={bake.imageSrc}
            />
          ))}
        </div>

        {/* Decorative elements - positioned in far corners to avoid content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute top-4 right-4 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-3xl opacity-30">🍡</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-4 left-4 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <svg width="35" height="35" viewBox="0 0 50 50" className="text-sage/40" aria-hidden="true">
            <circle cx="25" cy="25" r="20" fill="currentColor" />
            <circle cx="18" cy="20" r="4" fill="#5D4037" opacity="0.5" />
            <circle cx="32" cy="22" r="3" fill="#5D4037" opacity="0.5" />
            <circle cx="25" cy="32" r="4" fill="#5D4037" opacity="0.5" />
          </svg>
        </motion.div>

        <LoveNoteHeart x="5%" y="20%" delay={2} rotation={-5} />

        <FloatingHeart delay={0.8} x="8%" y="30%" size={20} rotation={-10} />
        <FloatingHeart delay={1.2} x="85%" y="15%" size={16} rotation={5} />
        <FloatingHeart delay={1.5} x="75%" y="70%" size={18} rotation={-8} />
      </div>
    </div>
  );
}
