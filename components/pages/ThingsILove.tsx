"use client";

import { motion } from "framer-motion";
import StickyNote from "../ui/StickyNote";

interface ThingsILoveProps {
  onNext: () => void;
  onPrev: () => void;
}

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
    expandedText: "Somehow I can never seem to keep up with the way you keep everyone's preferences in mind when it comes to gift-giving and overall social cues.",
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
    expandedText: "It hasn't been easy for you, but you've stayed strong and resilient throughout it all--I'm proud of the person you've become and can't wait to see where you go next.",
    rotation: 5,
    color: "white" as const,
    size: "lg" as const,
  },
  {
    title: "The way you think about the world",
    expandedText: "I know that I often criticize your worldview, but at the end of the day you're a native New Yorker...that alone can translate into life experiences that most only dream of.",
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

export default function ThingsILove({ onNext }: ThingsILoveProps) {
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

        {/* Continue hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-4 sm:mt-8"
        >
          <button
            onClick={onNext}
            className="font-handwritten text-lg text-brown-light/60 hover:text-blush transition-colors flex items-center gap-2 mx-auto group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            there&apos;s more
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
