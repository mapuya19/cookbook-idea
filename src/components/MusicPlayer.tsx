"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AudioPromptModal } from "./AudioPromptModal";
import { VolumeSlider } from "./VolumeSlider";

/**
 * Music player component with autoplay handling and volume control
 * Shows a modal prompt once per session if autoplay is blocked
 */
export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
  }, [volume]);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2"
      onMouseEnter={handleShowVolume}
      onMouseLeave={handleHideVolume}
    >
      {/* Volume slider - shows on hover/tap */}
      <VolumeSlider
        show={showVolume}
        volume={volume}
        onVolumeChange={setVolume}
      />

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
      <AudioPromptModal
        show={showAudioPrompt}
        onEnable={handleEnableSound}
        onDismiss={handleDismissPrompt}
      />
    </motion.div>
  );
}
