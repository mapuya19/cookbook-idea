"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "./pages/CoverPage";
import SignatureBakes from "./pages/SignatureBakes";
import ThingsILove from "./pages/ThingsILove";
import FutureRecipes from "./pages/FutureRecipes";
import ScratchCard from "./pages/ScratchCard";
import PhotoBooth from "./pages/PhotoBooth";
import ValentinePage from "./pages/ValentinePage";
import GameSelect from "./pages/GameSelect";
import PageFooter from "./ui/PageFooter";
import LoadingScreen from "./LoadingScreen";
import CursorTrail from "./effects/CursorTrail";
import { playPageFlip } from "@/utils/sounds";

// Images to preload for smooth experience
const imagesToPreload = [
  "/images/matcha-cookies.jpg",
  "/images/cake-class.jpg",
  "/images/miffy-dessert.jpg",
  "/images/heart-pizza.jpg",
];

const pages = [
  { component: CoverPage, showFooter: false, name: "Cover" },
  { component: SignatureBakes, showFooter: true, name: "Signature Bakes" },
  { component: ThingsILove, showFooter: true, name: "Things I Love" },
  { component: FutureRecipes, showFooter: true, name: "Future Recipes" },
  { component: ScratchCard, showFooter: false, name: "Scratch Card" },
  { component: PhotoBooth, showFooter: false, name: "Photo Booth" },
  { component: ValentinePage, showFooter: false, name: "Valentine" },
  { component: GameSelect, showFooter: false, name: "Games" },
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
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // cubic-bezier for smooth, natural feel
  duration: 0.5,
};

export default function Scrapbook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex === currentPage) return;
    playPageFlip();
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  }, [currentPage]);

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      playPageFlip();
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      playPageFlip();
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Space
          e.preventDefault();
          nextPage();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevPage();
          break;
        case "Escape":
          e.preventDefault();
          if (currentPage !== 0) {
            playPageFlip();
            setDirection(-1);
            setCurrentPage(0);
          }
          break;
        case "Home":
          e.preventDefault();
          goToPage(0);
          break;
        case "End":
          e.preventDefault();
          goToPage(pages.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, nextPage, prevPage, goToPage]);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const CurrentPageComponent = pages[currentPage].component;
  const showFooter = pages[currentPage].showFooter;

  // Show loading screen
  if (isLoading) {
    return (
      <LoadingScreen 
        onLoadComplete={handleLoadComplete} 
        imagesToPreload={imagesToPreload}
      />
    );
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-cream flour-pattern">
      {/* Cursor trail effect */}
      <CursorTrail />

      {/* Navigation Arrows - optimized for mobile touch */}
      {currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={prevPage}
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

      {currentPage < pages.length - 1 && currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={nextPage}
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

      {/* Page Dots Navigation - compact on mobile */}
      {currentPage > 0 && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 sm:gap-2 bg-warm-white/70 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-sm sm:shadow-md"
          style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
          aria-label="Scrapbook pages"
          role="navigation"
        >
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`page-dot w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation ${
                index === currentPage
                  ? "bg-blush scale-125"
                  : "bg-brown-light/30 active:bg-brown-light/50 sm:hover:bg-brown-light/50"
              }`}
              aria-label={`Go to ${page.name} page${index === currentPage ? " (current)" : ""}`}
              aria-current={index === currentPage ? "page" : undefined}
            />
          ))}
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
