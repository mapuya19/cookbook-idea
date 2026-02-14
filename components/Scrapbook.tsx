"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "./pages/CoverPage";
import SignatureBakes from "./pages/SignatureBakes";
import ThingsILove from "./pages/ThingsILove";
import FutureRecipes from "./pages/FutureRecipes";
import ScratchCard from "./pages/ScratchCard";
import PhotoBooth from "./pages/PhotoBooth";
import ValentinePage from "./pages/ValentinePage";
import TimeTogether from "./pages/TimeTogether";
import GameSelect from "./pages/GameSelect";
import LoadingScreen from "./LoadingScreen";
import CursorTrail from "./effects/CursorTrail";
import MusicPlayer from "./MusicPlayer";
import { useScrapbookNavigation } from "./hooks/useScrapbookNavigation";
import NavigationArrows from "./ui/NavigationArrows";
import NavigationDots from "./ui/NavigationDots";

// localStorage key for persisting current page
const CURRENT_PAGE_KEY = "scrapbook_current_page";

// Images to preload for smooth experience
const imagesToPreload = [
  "/images/matcha-cookies.jpg",
  "/images/cake-class.jpg",
  "/images/miffy-dessert.jpg",
  "/images/heart-pizza.jpg",
];

const pages = [
  { component: CoverPage, name: "Cover" },
  { component: SignatureBakes, name: "Signature Bakes" },
  { component: ThingsILove, name: "Things I Love" },
  { component: FutureRecipes, name: "Future Recipes" },
  { component: ScratchCard, name: "Scratch Card" },
  { component: PhotoBooth, name: "Photo Booth" },
  { component: TimeTogether, name: "Time Together" },
  { component: ValentinePage, name: "Valentine" },
  { component: GameSelect, name: "Games" },
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
  const [isLoading, setIsLoading] = useState(true);
  const [savedPage] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const savedPageValue = localStorage.getItem(CURRENT_PAGE_KEY);
      if (savedPageValue !== null) {
        const pageIndex = parseInt(savedPageValue, 10);
        if (!isNaN(pageIndex) && pageIndex >= 0 && pageIndex < pages.length) {
          return pageIndex;
        }
      }
    }
    return null;
  });

  // Save current page to localStorage whenever it changes
  const handlePageChange = useCallback((pageIndex: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_PAGE_KEY, pageIndex.toString());
    }
  }, []);

  // Use the shared navigation hook with saved page or default to 0
  const { currentPage, direction, goToPage, nextPage, prevPage } = useScrapbookNavigation({
    pages,
    currentPage: savedPage ?? 0,
    onPageChange: handlePageChange,
  });

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const CurrentPageComponent = pages[currentPage].component;

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

      {/* Background music player */}
      <MusicPlayer />

      {/* Navigation Arrows - optimized for mobile touch */}
      <NavigationArrows
        currentPage={currentPage}
        totalPages={pages.length}
        onNext={nextPage}
        onPrev={prevPage}
      />

      {/* Page Dots Navigation - compact on mobile */}
      <NavigationDots
        pages={pages}
        currentPage={currentPage}
        onGoToPage={goToPage}
        useRouter={false}
      />

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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
