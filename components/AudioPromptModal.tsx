import { motion, AnimatePresence } from "framer-motion";

interface AudioPromptModalProps {
  show: boolean;
  onEnable: () => void;
  onDismiss: () => void;
}

/**
 * Modal that prompts users to enable audio for the best experience
 * Shown once per session when autoplay is blocked
 */
export function AudioPromptModal({ show, onEnable, onDismiss }: AudioPromptModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onDismiss}
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
                onClick={onEnable}
                className="flex-1 bg-blush text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
              >
                Enable Sound
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
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
  );
}
