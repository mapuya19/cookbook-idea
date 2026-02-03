"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { playScratchSound, playRevealSound } from "@/utils/sounds";
import { useConfetti } from "../effects/Confetti";

interface ScratchCardProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function ScratchCard({ onNext }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const lastScratchSoundRef = useRef(0);
  const { fireConfetti } = useConfetti();

  // Coupon content - easily customizable
  const couponText = "Good for one baking date of your choice";
  const couponSubtext = "Redeemable anytime with your favorite baker";

  // Initialize canvas with scratch layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Fill with scratch-off layer (silver/gray)
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#C0C0C0");
    gradient.addColorStop(0.5, "#D8D8D8");
    gradient.addColorStop(1, "#A8A8A8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add some texture/pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add "Scratch Here!" text
    ctx.fillStyle = "#888";
    ctx.font = "bold 24px var(--font-quicksand), sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Here!", rect.width / 2, rect.height / 2 - 15);
    
    ctx.font = "16px var(--font-quicksand), sans-serif";
    ctx.fillText("Use your finger or mouse", rect.width / 2, rect.height / 2 + 15);
  }, []);

  // Calculate scratch percentage
  const calculateScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    return (transparentPixels / (pixels.length / 4)) * 100;
  }, []);

  // Scratch function
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Erase in a circle
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(
      (x - rect.left) * scaleX / window.devicePixelRatio,
      (y - rect.top) * scaleY / window.devicePixelRatio,
      25,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Play scratch sound (throttled)
    const now = Date.now();
    if (now - lastScratchSoundRef.current > 100) {
      playScratchSound();
      lastScratchSoundRef.current = now;
    }

    // Check percentage
    const percentage = calculateScratchPercentage();
    setScratchPercentage(percentage);

    // Auto-reveal when 60% scratched
    if (percentage >= 60 && !isRevealed) {
      setIsRevealed(true);
      playRevealSound();
      fireConfetti();
    }
  }, [isRevealed, calculateScratchPercentage, fireConfetti]);

  // Mouse/touch handlers - optimized for iOS
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent iOS scroll/zoom
    setIsScratching(true);
    const point = "touches" in e ? e.touches[0] : e;
    scratch(point.clientX, point.clientY);
  }, [scratch]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault(); // Prevent iOS scroll during scratch
    const point = "touches" in e ? e.touches[0] : e;
    scratch(point.clientX, point.clientY);
  }, [isScratching, scratch]);

  const handleEnd = useCallback(() => {
    setIsScratching(false);
  }, []);

  // Force reveal button
  const handleReveal = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    playRevealSound();
    fireConfetti();
  }, [isRevealed, fireConfetti]);

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            A Little Surprise
          </h2>
          <p className="font-body text-brown-light text-sm sm:text-base">
            Scratch to reveal your special coupon!
          </p>
        </motion.div>

        {/* Scratch card container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mx-auto mb-6"
          style={{ maxWidth: "340px" }}
        >
          {/* Coupon background (revealed content) */}
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-dashed border-blush-light">
            {/* Decorative top */}
            <div className="bg-blush/20 py-3 px-4">
              <p className="font-handwritten text-blush text-lg">Love Coupon</p>
            </div>

            {/* Main coupon content */}
            <div className="p-6 min-h-[180px] flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isRevealed ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-handwritten text-2xl sm:text-3xl text-brown mb-3 leading-tight">
                  {couponText}
                </p>
                <p className="font-body text-sm text-brown-light">
                  {couponSubtext}
                </p>
              </motion.div>

              {/* Decorative hearts */}
              <div className="flex gap-2 mt-4" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: isRevealed ? 1 : 0 }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="text-blush"
                  >
                    <path
                      d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z"
                      fill="currentColor"
                    />
                  </motion.svg>
                ))}
              </div>
            </div>

            {/* Decorative bottom */}
            <div className="bg-sage/10 py-2 px-4 flex justify-between items-center">
              <span className="font-body text-xs text-brown-light/60">No expiration</span>
              <span className="font-body text-xs text-brown-light/60">Valid forever</span>
            </div>
          </div>

          {/* Scratch canvas overlay */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.canvas
                ref={canvasRef}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full rounded-2xl cursor-crosshair select-none"
                style={{ touchAction: 'none' }} // More reliable than touch-none class on iOS
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onTouchCancel={handleEnd}
                aria-label="Scratch card - scratch to reveal"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress indicator */}
        {!isRevealed && scratchPercentage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <p className="font-body text-sm text-brown-light">
              {scratchPercentage < 30 && "Keep scratching..."}
              {scratchPercentage >= 30 && scratchPercentage < 60 && "Almost there!"}
            </p>
          </motion.div>
        )}

        {/* Revealed message */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <p className="font-handwritten text-2xl text-blush mb-2">
                You found it! 
              </p>
              <p className="font-body text-brown-light text-sm">
                This coupon is redeemable anytime you want
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center"
        >
          {!isRevealed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReveal}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 touch-manipulation active:scale-95"
            >
              Just reveal it
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blush text-white font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            Continue
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.8 }}
          className="absolute top-16 right-6 text-5xl pointer-events-none hidden sm:block"
          aria-hidden="true"
        >
          🎁
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1 }}
          className="absolute bottom-24 left-6 text-4xl pointer-events-none hidden sm:block"
          aria-hidden="true"
        >
          💝
        </motion.div>
      </div>
    </div>
  );
}
