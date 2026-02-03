"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "./pages/CoverPage";
import SignatureBakes from "./pages/SignatureBakes";
import ThingsILove from "./pages/ThingsILove";
import FutureRecipes from "./pages/FutureRecipes";
import ValentinePage from "./pages/ValentinePage";
import GameSelect from "./pages/GameSelect";
import PageFooter from "./ui/PageFooter";

const pages = [
  { component: CoverPage, showFooter: false },
  { component: SignatureBakes, showFooter: true },
  { component: ThingsILove, showFooter: true },
  { component: FutureRecipes, showFooter: true },
  { component: ValentinePage, showFooter: false },
  { component: GameSelect, showFooter: false },
];

// Modern slide transition - smooth horizontal movement with gentle fade
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "40%" : "-40%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "40%" : "-40%",
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smooth, natural feel
  duration: 0.5,
};

export default function Scrapbook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToPage = useCallback((pageIndex: number) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  }, [currentPage]);

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const CurrentPageComponent = pages[currentPage].component;
  const showFooter = pages[currentPage].showFooter;

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-cream flour-pattern">
      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={prevPage}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-warm-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
          aria-label="Previous page"
        >
          <svg
            className="w-6 h-6 text-brown group-hover:text-blush transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
      )}

      {currentPage < pages.length - 1 && currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={nextPage}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-warm-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
          aria-label="Next page"
        >
          <svg
            className="w-6 h-6 text-brown group-hover:text-blush transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      )}

      {/* Page Dots Navigation */}
      {currentPage > 0 && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2"
          aria-label="Scrapbook pages"
          role="navigation"
        >
          {pages.map((_, index) => {
            const pageNames = ["Cover", "Signature Bakes", "Things I Love", "Future Recipes", "Valentine", "Games"];
            return (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 ${
                  index === currentPage
                    ? "bg-blush scale-125"
                    : "bg-brown-light/30 hover:bg-brown-light/50"
                }`}
                aria-label={`Go to ${pageNames[index]} page${index === currentPage ? " (current)" : ""}`}
                aria-current={index === currentPage ? "page" : undefined}
              />
            );
          })}
        </motion.nav>
      )}

      {/* Page Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="min-h-dvh w-full"
        >
          <CurrentPageComponent onNext={nextPage} onPrev={prevPage} />
          
          {showFooter && (
            <PageFooter 
              currentPage={currentPage} 
              totalPages={pages.length - 1} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
