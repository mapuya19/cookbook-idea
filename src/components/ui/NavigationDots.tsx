import { motion } from "framer-motion";
import { playPageFlip } from "@/utils/sounds";

interface Page {
  name: string;
}

interface NavigationDotsProps {
  pages: Page[];
  currentPage: number;
  onGoToPage?: (index: number) => void;
}

/**
 * Navigation dots for direct page access
 * Compact on mobile with proper accessibility
 */
export function NavigationDots({
  pages,
  currentPage,
  onGoToPage,
}: NavigationDotsProps) {
  const handleClick = (index: number) => {
    if (index === currentPage) return;
    playPageFlip();
    onGoToPage?.(index);
  };

  // Don't show dots on cover page
  if (currentPage === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 sm:gap-2 bg-warm-white/70 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-sm sm:shadow-md"
      style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="Scrapbook pages"
      role="navigation"
    >
      {pages.map((page, index) => {
        const isActive = index === currentPage;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            className={`page-dot w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation ${
              isActive
                ? "bg-blush scale-125"
                : "bg-brown-light/30 active:bg-brown-light/50 sm:hover:bg-brown-light/50"
            }`}
            aria-label={`Go to ${page.name} page${isActive ? " (current)" : ""}`}
            aria-current={isActive ? "page" : undefined}
          />
        );
      })}
    </motion.nav>
  );
}

export default NavigationDots;
