import { motion, AnimatePresence } from "framer-motion";

interface VolumeSliderProps {
  show: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

/**
 * Volume slider control for music playback
 * Shows on hover/tap with smooth animation
 */
export function VolumeSlider({ show, volume, onVolumeChange }: VolumeSliderProps) {
  return (
    <AnimatePresence>
      {show && (
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
            aria-hidden="true"
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
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1.5 bg-brown-light/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blush [&::-webkit-slider-thumb]:cursor-pointer"
            aria-label="Volume control"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
