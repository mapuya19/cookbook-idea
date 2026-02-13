"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOVE_NOTES = [
  "You make everything better 🍪",
  "Your laugh is my favorite sound 💕",
  "I'm so lucky to have you",
  "Every day with you is a gift",
  "You're beautiful inside and out",
  "My favorite place is next to you",
  "You light up my whole world",
  "I fall in love with you more each day",
  "You make my heart smile 😊",
  "The best thing I ever did was finding you",
  "You're my favorite notification",
  "Life is sweeter with you",
  "You're the best baker AND the best girlfriend",
  "I love everything about you",
  "You're my sun, my moon, and all my stars ✨",
];

export function LoveNoteHeart({ x, y, delay, rotation }: { x: string; y: string; delay: number; rotation: number }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (hasBeenClicked) return;

    const randomNote = LOVE_NOTES[Math.floor(Math.random() * LOVE_NOTES.length)];
    setNote(randomNote);
    setShowNote(true);
    setHasBeenClicked(true);
  }, [hasBeenClicked]);

  return (
    <>
      <motion.button
        className="absolute cursor-pointer z-20 transition-opacity"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: hasBeenClicked ? 0.3 : 0.6, scale: 1 }}
        transition={{
          opacity: { delay, duration: 0.5 },
          scale: { delay, duration: 0.5, type: "spring", stiffness: 200 },
        }}
        whileHover={!hasBeenClicked ? { scale: 1.2, rotate: rotation + 10 } : {}}
        whileTap={!hasBeenClicked ? { scale: 0.9 } : {}}
        onClick={handleClick}
        aria-label="Click for a love note"
      >
        <motion.span
          animate={!hasBeenClicked ? { y: [0, -8, 0], rotate: [rotation, rotation + 5, rotation] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl sm:text-3xl"
          style={{ color: "#A8C69F" }}
        >
          💚
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {showNote && (
          <LoveNoteModal note={note} onClose={() => setShowNote(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function LoveNoteModal({ note, onClose }: { note: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl mb-4 inline-block"
            style={{ color: "#A8C69F" }}
          >
            💚
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-handwritten text-xl sm:text-2xl text-brown mb-6 leading-relaxed"
          >
            {note}
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2.5 bg-sage text-white font-body font-semibold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            Aww, thanks! 💚
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
