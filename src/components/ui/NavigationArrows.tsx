import { motion } from "framer-motion";

interface NavigationArrowsProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  showNext?: boolean;
}

/**
 * Navigation arrows for scrapbook page navigation
 * Optimized for mobile touch with proper accessibility
 */
export default function NavigationArrows({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  showNext = true,
}: NavigationArrowsProps) {
  // Show previous arrow on all pages except first
  const showPrev = currentPage > 0;

  // Show next arrow on pages between first and last
  const showNextButton = showNext && currentPage < totalPages - 1 && currentPage > 0;

  return (
    <>
      {/* Previous Arrow */}
      {showPrev && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={onPrev}
          className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3 min-w-[44px] min-h-[44px] rounded-full bg-warm-white/90 backdrop-blur-sm shadow-lg active:scale-95 sm:hover:bg-white sm:hover:scale-110 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation"
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-brown group-hover:text-blush transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
      )}

      {/* Next Arrow */}
      {showNextButton && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={onNext}
          className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3 min-w-[44px] min-h-[44px] rounded-full bg-warm-white/90 backdrop-blur-sm shadow-lg active:scale-95 sm:hover:bg-white sm:hover:scale-110 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation"
          aria-label="Next page"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-brown group-hover:text-blush transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      )}
    </>
  );
}
