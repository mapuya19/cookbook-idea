"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const promptShownRef = useRef(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/audio/background-music-compressed.mp3");
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Attempt autoplay
    const tryAutoplay = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked - show modal prompt (only once per session)
        if (!promptShownRef.current) {
          promptShownRef.current = true;
          // Show prompt after a short delay for better UX
          setTimeout(() => setShowAudioPrompt(true), 1500);
        }
      });
    };

    // Try autoplay after a short delay
    const autoplayTimeout = setTimeout(tryAutoplay, 500);

    return () => {
      clearTimeout(autoplayTimeout);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, that's okay
      });
    }
    setIsPlaying(!isPlaying);
    // Dismiss audio prompt when user manually toggles
    setShowAudioPrompt(false);
  };

  const handleEnableSound = () => {
    togglePlay();
    setShowAudioPrompt(false);
  };

  const handleDismissPrompt = () => {
    setShowAudioPrompt(false);
  };

  // Handle showing volume with delay for hiding
  const handleShowVolume = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowVolume(true);
  }, []);

  const handleHideVolume = useCallback(() => {
    // Delay hiding to allow mouse to move to volume slider
    hideTimeoutRef.current = setTimeout(() => {
      setShowVolume(false);
    }, 300);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2"
      onMouseEnter={handleShowVolume}
      onMouseLeave={handleHideVolume}
    >
      {/* Volume slider - shows on hover/tap */}
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-warm-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 text-brown-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-brown-light/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blush [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-warm-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-brown hover:text-blush transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>

      {/* Audio prompt modal */}
      <AnimatePresence>
        {showAudioPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={handleDismissPrompt}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-warm-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm mx-auto text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Music icon animation */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-blush/10 flex items-center justify-center"
              >
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-blush"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </motion.div>

              <h3 className="text-xl sm:text-2xl font-display text-brown mb-2">
                Turn up the sound! 🎵
              </h3>
              <p className="text-brown-light text-sm sm:text-base mb-6 leading-relaxed">
                This scrapbook is best experienced with music and sound effects
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnableSound}
                  className="flex-1 bg-blush text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
                >
                  Enable Sound
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismissPrompt}
                  className="flex-1 bg-brown-light/10 text-brown px-6 py-3 rounded-full font-medium hover:bg-brown-light/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-light focus-visible:ring-offset-2"
                >
                  Maybe Later
                </motion.button>
              </div>

              <p className="text-brown-light/50 text-xs mt-4">
                You can always toggle sound using the button in the corner
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
