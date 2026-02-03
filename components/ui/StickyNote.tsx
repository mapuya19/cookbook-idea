"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface StickyNoteProps {
  title: string;
  expandedText?: string;
  rotation?: number;
  delay?: number;
  color?: "cream" | "pink" | "sage" | "white";
  size?: "sm" | "md" | "lg";
}

const colorClasses = {
  cream: "bg-gradient-to-br from-warm-white to-cream",
  pink: "bg-gradient-to-br from-blush-light/40 to-blush-light/20",
  sage: "bg-gradient-to-br from-sage-light/40 to-sage-light/20",
  white: "bg-gradient-to-br from-white to-warm-white",
};

const tapeColors = {
  cream: "bg-sage/50",
  pink: "bg-blush/40",
  sage: "bg-brown-light/30",
  white: "bg-blush/40",
};

const sizeClasses = {
  sm: "w-36 sm:w-40 p-3",
  md: "w-44 sm:w-52 p-4",
  lg: "w-52 sm:w-64 p-5",
};

export default function StickyNote({
  title,
  expandedText,
  rotation = 0,
  delay = 0,
  color = "cream",
  size = "md",
}: StickyNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotation - 8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.5, 
        ease: "easeOut",
        rotate: { type: "spring", stiffness: 100 }
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        y: -5,
        transition: { duration: 0.2 }
      }}
      onClick={() => expandedText && setIsExpanded(!isExpanded)}
      className={`
        sticky-note relative cursor-pointer
        ${colorClasses[color]}
        ${sizeClasses[size]}
        shadow-md hover:shadow-lg transition-shadow
      `}
      style={{ ["--rotation" as string]: `${rotation}deg` }}
    >
      {/* Tape at top */}
      <div 
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 ${tapeColors[color]} rotate-1`}
        style={{ clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)" }}
      />

      {/* Content */}
      <motion.div
        animate={{ height: "auto" }}
        className="relative z-10"
      >
        <p className="font-handwritten text-lg sm:text-xl text-brown leading-snug">
          {title}
        </p>
        
        {isExpanded && expandedText && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="font-body text-sm text-brown-light mt-2 leading-relaxed"
          >
            {expandedText}
          </motion.p>
        )}

        {expandedText && !isExpanded && (
          <p className="font-body text-xs text-brown-light/50 mt-2 italic">
            tap to read more...
          </p>
        )}
      </motion.div>

      {/* Corner fold effect */}
      <div 
        className="absolute bottom-0 right-0 w-6 h-6"
        style={{
          background: `linear-gradient(135deg, transparent 50%, rgba(139, 115, 85, 0.1) 50%)`,
        }}
      />
    </motion.div>
  );
}
