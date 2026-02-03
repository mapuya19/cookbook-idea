"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface PolaroidProps {
  imageSrc?: string;
  title: string;
  caption: string;
  rotation?: number;
  delay?: number;
  placeholder?: "cookie" | "pizza" | "mochi" | "bread";
}

// Placeholder illustrations for when photos aren't available
const PlaceholderIllustration = ({ type }: { type: string }) => {
  switch (type) {
    case "cookie":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#FDF6E3" />
          {/* Miffy-style cookie */}
          <ellipse cx="100" cy="100" rx="70" ry="65" fill="#F5E6D3" />
          <ellipse cx="100" cy="100" rx="65" ry="60" fill="#E8D4BC" />
          {/* Miffy face */}
          <ellipse cx="85" cy="90" rx="4" ry="6" fill="#5D4037" />
          <ellipse cx="115" cy="90" rx="4" ry="6" fill="#5D4037" />
          <path d="M95 105 L100 110 L105 105" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Ears */}
          <ellipse cx="75" cy="55" rx="12" ry="25" fill="#E8D4BC" stroke="#D4C4AC" strokeWidth="2" />
          <ellipse cx="125" cy="55" rx="12" ry="25" fill="#E8D4BC" stroke="#D4C4AC" strokeWidth="2" />
          {/* Decorative dots */}
          <circle cx="60" cy="120" r="5" fill="#F4A5AE" opacity="0.6" />
          <circle cx="140" cy="80" r="4" fill="#A8C69F" opacity="0.6" />
          <circle cx="130" cy="130" r="6" fill="#F4A5AE" opacity="0.5" />
        </svg>
      );
    case "pizza":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#FDF6E3" />
          {/* Heart-shaped pizza */}
          <path
            d="M100 160C100 160 40 110 40 75C40 50 55 35 75 35C88 35 100 50 100 50C100 50 112 35 125 35C145 35 160 50 160 75C160 110 100 160 100 160Z"
            fill="#E8A87C"
          />
          <path
            d="M100 150C100 150 50 108 50 78C50 58 62 45 78 45C88 45 100 57 100 57C100 57 112 45 122 45C138 45 150 58 150 78C150 108 100 150 100 150Z"
            fill="#F5C89A"
          />
          {/* Toppings */}
          <circle cx="80" cy="85" r="8" fill="#D32F2F" opacity="0.8" />
          <circle cx="120" cy="90" r="7" fill="#D32F2F" opacity="0.8" />
          <circle cx="100" cy="115" r="9" fill="#D32F2F" opacity="0.8" />
          <circle cx="90" cy="100" r="5" fill="#388E3C" opacity="0.7" />
          <circle cx="115" cy="105" r="4" fill="#388E3C" opacity="0.7" />
          {/* Cheese drips */}
          <ellipse cx="75" cy="95" rx="6" ry="4" fill="#FFF9C4" opacity="0.8" />
          <ellipse cx="125" cy="100" rx="5" ry="3" fill="#FFF9C4" opacity="0.8" />
        </svg>
      );
    case "mochi":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#FDF6E3" />
          {/* Mochi balls */}
          <ellipse cx="70" cy="120" rx="35" ry="30" fill="#FFECD2" />
          <ellipse cx="130" cy="115" rx="38" ry="32" fill="#FFE4B5" />
          <ellipse cx="100" cy="85" rx="32" ry="28" fill="#FFF8DC" />
          {/* Mango filling peek */}
          <ellipse cx="100" cy="85" rx="15" ry="12" fill="#FFB347" opacity="0.7" />
          <ellipse cx="70" cy="120" rx="16" ry="13" fill="#FFB347" opacity="0.7" />
          <ellipse cx="130" cy="115" rx="17" ry="14" fill="#FFB347" opacity="0.7" />
          {/* Shine */}
          <ellipse cx="90" cy="78" rx="6" ry="4" fill="white" opacity="0.5" />
          <ellipse cx="60" cy="112" rx="5" ry="3" fill="white" opacity="0.5" />
          <ellipse cx="120" cy="108" rx="6" ry="4" fill="white" opacity="0.5" />
          {/* Decorative leaves */}
          <path d="M155 90 Q165 85 170 95 Q165 100 155 95 Z" fill="#A8C69F" />
          <path d="M40 105 Q30 100 28 110 Q33 115 40 110 Z" fill="#A8C69F" />
        </svg>
      );
    case "bread":
    default:
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#FDF6E3" />
          {/* Cookie stack */}
          <ellipse cx="100" cy="140" rx="55" ry="20" fill="#C4A77D" />
          <ellipse cx="100" cy="135" rx="50" ry="18" fill="#D4B896" />
          <ellipse cx="100" cy="115" rx="52" ry="19" fill="#C4A77D" />
          <ellipse cx="100" cy="110" rx="48" ry="17" fill="#E8CBA8" />
          <ellipse cx="100" cy="90" rx="50" ry="18" fill="#C4A77D" />
          <ellipse cx="100" cy="85" rx="46" ry="16" fill="#D4B896" />
          <ellipse cx="100" cy="65" rx="48" ry="17" fill="#C4A77D" />
          <ellipse cx="100" cy="60" rx="44" ry="15" fill="#E8CBA8" />
          {/* Chocolate chips on top cookie */}
          <circle cx="85" cy="58" r="5" fill="#5D4037" />
          <circle cx="105" cy="55" r="4" fill="#5D4037" />
          <circle cx="115" cy="62" r="5" fill="#5D4037" />
          <circle cx="90" cy="68" r="4" fill="#5D4037" />
        </svg>
      );
  }
};

export default function Polaroid({
  imageSrc,
  title,
  caption,
  rotation = 0,
  delay = 0,
  placeholder = "cookie",
}: PolaroidProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = imageSrc && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation - 5 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -8, 
        rotate: 0, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      aria-label={`${title}: ${caption}`}
      className="polaroid w-36 sm:w-44 md:w-48 lg:w-56"
      style={{ ["--rotation" as string]: `${rotation}deg` }}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-cream overflow-hidden">
        {showImage ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderIllustration type={placeholder} />
        )}
      </div>

      {/* Caption area */}
      <div className="pt-2 sm:pt-3 pb-1 px-1">
        <p className="font-handwritten text-base sm:text-lg md:text-xl text-brown text-center leading-tight">
          {title}
        </p>
        <p className="font-body text-xs sm:text-sm text-brown-light/70 text-center mt-0.5 sm:mt-1 italic line-clamp-2">
          {caption}
        </p>
      </div>

      {/* Tape decoration */}
      <div 
        className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-4 sm:h-5 bg-sage/40 rotate-2" 
        style={{ clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
