"use client";

import { motion } from "framer-motion";
import StickyNote from "../ui/StickyNote";
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

const loveNotes = [
  {
    title: "Your eyes",
    expandedText: "Yea it's pretty basic but they're really nice. Easy to look at, lol.",
    rotation: -3,
    color: "cream" as const,
    size: "lg" as const,
  },
  {
    title: "Your thoughtfulness",
    expandedText: "Somehow I can never seem to keep up with way you keep everyone's preferences in mind when it comes to gift-giving and overall social cues.",
    rotation: 4,
    color: "pink" as const,
    size: "md" as const,
  },
  {
    title: "Your patience",
    expandedText: "I know that I can be tough to deal with at times but I'm so thankful and grateful to have you by my side.",
    rotation: -2,
    color: "sage" as const,
    size: "md" as const,
  },
  {
    title: "Your growth",
    expandedText: "It hasn't been easy for you, but you've stayed strong and resilient throughout it all--I'm proud of person you've become and can't wait to see where you go next.",
    rotation: 5,
    color: "white" as const,
    size: "lg" as const,
  },
  {
    title: "The way you think about world",
    expandedText: "I know that I often criticize your worldview, but at end of the day you're a native New Yorker...that alone can translate into life experiences that most only dream of.",
    rotation: -4,
    color: "pink" as const,
    size: "md" as const,
  },
  {
    title: "Your focus face when you're locked in on Fortnite",
    expandedText: "Can't believe we actually got a win. Now you have to try Valorant!",
    rotation: 2,
    color: "cream" as const,
    size: "md" as const,
  },
];

export default function ThingsILove() {
  return (
    <div className="scrapbook-page paper-texture overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            Things I Love About You
          </h2>
          <p className="font-body text-brown-light/70 text-sm sm:text-base">
            (not edible, but just as sweet)
          </p>
        </motion.div>

        {/* Sticky notes - scattered layout */}
        <div className="relative min-h-[500px] sm:min-h-[600px]">
          {/* Desktop: Absolute positioning for scattered effect */}
          <div className="hidden md:block">
            <div className="absolute top-0 left-[5%]">
              <StickyNote {...loveNotes[0]} delay={0.2} />
            </div>
            <div className="absolute top-4 right-[10%]">
              <StickyNote {...loveNotes[1]} delay={0.35} />
            </div>
            <div className="absolute top-[180px] left-[25%]">
              <StickyNote {...loveNotes[2]} delay={0.5} />
            </div>
            <div className="absolute top-[160px] right-[5%]">
              <StickyNote {...loveNotes[3]} delay={0.65} />
            </div>
            <div className="absolute top-[340px] left-[8%]">
              <StickyNote {...loveNotes[4]} delay={0.8} />
            </div>
            <div className="absolute top-[360px] right-[20%]">
              <StickyNote {...loveNotes[5]} delay={0.95} />
            </div>
          </div>

          {/* Mobile: Grid layout */}
          <div className="md:hidden grid grid-cols-2 gap-4 justify-items-center">
            {loveNotes.map((note, index) => (
              <StickyNote
                key={note.title}
                {...note}
                delay={0.2 + index * 0.12}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Decorative elements - positioned in far corners to avoid content */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute top-2 right-2 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-2xl">🍡</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="absolute bottom-2 left-2 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-2xl">🍡</span>
        </motion.div>

        <LoveNoteHeart x="10%" y="15%" delay={0.3} rotation={8} />
        <LoveNoteHeart x="85%" y="70%" delay={0.4} rotation={-3} />

        <FloatingHeart delay={0.9} x="5%" y="40%" size={18} rotation={-7} />
        <FloatingHeart delay={1.3} x="92%" y="25%" size={20} rotation={8} />
        <FloatingHeart delay={1.6} x="12%" y="75%" size={16} rotation={5} />
        <FloatingHeart delay={1.9} x="88%" y="60%" size={17} rotation={-6} />
      </div>
    </div>
  );
}
