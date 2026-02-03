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
    expandedText: "I could get lost in them forever. They light up when you talk about things you love, and I never want to look away.",
    rotation: -3,
    color: "cream" as const,
    size: "lg" as const,
  },
  {
    title: "Your thoughtfulness",
    expandedText: "You always know exactly what someone needs, even before they do. It's like you have a superpower for caring.",
    rotation: 4,
    color: "pink" as const,
    size: "md" as const,
  },
  {
    title: "Your patience",
    expandedText: "Even when I'm being ridiculous (which is often), you're there with that calm, steady presence. Thank you for that.",
    rotation: -2,
    color: "sage" as const,
    size: "md" as const,
  },
  {
    title: "Your growth",
    expandedText: "Watching you become who you are is one of the most beautiful things I've ever witnessed. You inspire me every day.",
    rotation: 5,
    color: "white" as const,
    size: "lg" as const,
  },
  {
    title: "The way you get excited explaining recipes",
    expandedText: "Your whole face lights up. Your hands start moving. It's adorable and I could listen to you talk about baking forever.",
    rotation: -4,
    color: "pink" as const,
    size: "md" as const,
  },
  {
    title: "Your focus face when something's in the oven",
    expandedText: "That little crinkle between your eyebrows, the way you watch through the glass... it makes my heart so full.",
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

        {/* Decorative hearts */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute top-32 right-4 hidden lg:block"
          aria-hidden="true"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-blush" aria-hidden="true">
            <path
              d="M20 36C20 36 4 24 4 14C4 8 8 4 14 4C17 4 20 7 20 7C20 7 23 4 26 4C32 4 36 8 36 14C36 24 20 36 20 36Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="absolute bottom-40 left-4 hidden lg:block"
          aria-hidden="true"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" className="text-sage" aria-hidden="true">
            <path
              d="M15 27C15 27 3 18 3 10.5C3 6 6 3 10.5 3C12.75 3 15 5.25 15 5.25C15 5.25 17.25 3 19.5 3C24 3 27 6 27 10.5C27 18 15 27 15 27Z"
              fill="currentColor"
            />
          </svg>
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
