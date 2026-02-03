"use client";

import { motion } from "framer-motion";

interface BakingMemoriesProps {
  onNext: () => void;
  onPrev: () => void;
}

const memories = [
  {
    title: "The Miffy Cookie Adventure",
    description: "When we made the cutest cookies ever",
    detail: "Those little bunny faces looking up at us from the baking sheet... I'll never forget how proud you looked. And how delicious they were.",
    icon: "cookie",
  },
  {
    title: "Heart Pizza Night",
    description: "You turned dinner into something I'll never forget",
    detail: "It wasn't just pizza. It was you, putting love into every ingredient, shaping it into a heart. That's when I knew you were special.",
    icon: "pizza",
  },
  {
    title: "Mango Mochi Magic",
    description: "Sticky hands, happy hearts",
    detail: "We were covered in mochi flour, laughing at our messy attempts. But somehow, they turned out perfect. Just like us.",
    icon: "mochi",
  },
];

const MemoryIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "cookie":
      return (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <circle cx="30" cy="30" r="25" fill="#E8CBA8" />
          <circle cx="22" cy="25" r="4" fill="#5D4037" />
          <circle cx="38" cy="22" r="3" fill="#5D4037" />
          <circle cx="28" cy="38" r="4" fill="#5D4037" />
          <circle cx="40" cy="35" r="3" fill="#5D4037" />
        </svg>
      );
    case "pizza":
      return (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <path
            d="M30 50C30 50 10 35 10 22C10 12 17 5 27 5C30 5 30 10 30 10C30 10 30 5 33 5C43 5 50 12 50 22C50 35 30 50 30 50Z"
            fill="#F5C89A"
          />
          <circle cx="25" cy="25" r="4" fill="#D32F2F" />
          <circle cx="35" cy="28" r="3" fill="#D32F2F" />
          <circle cx="30" cy="38" r="4" fill="#D32F2F" />
        </svg>
      );
    case "mochi":
      return (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <ellipse cx="30" cy="32" rx="22" ry="18" fill="#FFECD2" />
          <ellipse cx="30" cy="32" rx="12" ry="10" fill="#FFB347" opacity="0.7" />
          <ellipse cx="24" cy="28" rx="4" ry="3" fill="white" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
};

export default function BakingMemories({ onNext }: BakingMemoriesProps) {
  return (
    <div className="scrapbook-page paper-texture">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            Baking Memories
          </h2>
          <p className="font-body text-brown-light/70 text-sm sm:text-base">
            moments I hold close to my heart
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute left-6 sm:left-1/2 top-0 w-0.5 bg-gradient-to-b from-blush via-sage to-blush-light hidden sm:block"
            style={{ transform: "translateX(-50%)" }}
          />

          {/* Memory items */}
          <div className="space-y-8 sm:space-y-12">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.3, duration: 0.6 }}
                className={`relative flex items-start gap-4 sm:gap-8 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.3, type: "spring" }}
                  className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blush rounded-full border-4 border-cream z-10"
                />

                {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-warm-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow inline-block text-left"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 mb-3">
                      <MemoryIcon type={memory.icon} />
                    </div>

                    {/* Title */}
                    <h3 className="font-handwritten text-2xl sm:text-3xl text-brown mb-1">
                      {memory.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-sm text-blush font-medium mb-2">
                      {memory.description}
                    </p>

                    {/* Detail */}
                    <p className="font-body text-sm text-brown-light leading-relaxed">
                      {memory.detail}
                    </p>
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden sm:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.5 }}
          className="absolute top-20 right-4 hidden lg:block"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" className="text-sage">
            <path
              d="M40 10 L45 30 L65 30 L50 42 L55 62 L40 50 L25 62 L30 42 L15 30 L35 30 Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        {/* Continue hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-center mt-8 sm:mt-12"
        >
          <button
            onClick={onNext}
            className="font-handwritten text-lg text-brown-light/60 hover:text-blush transition-colors flex items-center gap-2 mx-auto group"
          >
            what&apos;s next for us?
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
