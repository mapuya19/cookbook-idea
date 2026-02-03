"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LoadingScreen from "./LoadingScreen";
import CursorTrail from "./effects/CursorTrail";
import MusicPlayer from "./MusicPlayer";
import { playPageFlip } from "../utils/sounds";

// External store for navigation state (direction and previous path)
// This avoids using refs during render while maintaining proper React patterns
interface NavigationStore {
  direction: number;
  prevPath: string;
}
let navigationStore: NavigationStore = { direction: 0, prevPath: "/" };
const navigationListeners = new Set<() => void>();

function subscribeToNavigation(callback: () => void) {
  navigationListeners.add(callback);
  return () => navigationListeners.delete(callback);
}

function getNavigationSnapshot(): NavigationStore {
  return navigationStore;
}

function setDirection(newDirection: number) {
  navigationStore = { ...navigationStore, direction: newDirection };
  navigationListeners.forEach(listener => listener());
}

function updatePrevPath(pathname: string) {
  if (navigationStore.prevPath !== pathname) {
    navigationStore = { ...navigationStore, prevPath: pathname };
    navigationListeners.forEach(listener => listener());
  }
}

// Images to preload for smooth experience
const imagesToPreload = [
  "/images/matcha-cookies.jpg",
  "/images/cake-class.jpg",
  "/images/miffy-dessert.jpg",
  "/images/heart-pizza.jpg",
];

// Global flag to track if app has been loaded (survives re-renders but not page refreshes)
let hasLoadedOnce = false;


export const pages = [
  { path: "/", name: "Cover" },
  { path: "/signature-bakes", name: "Signature Bakes" },
  { path: "/things-i-love", name: "Things I Love" },
  { path: "/future-recipes", name: "Future Recipes" },
  { path: "/scratch-card", name: "Scratch Card" },
  { path: "/photo-booth", name: "Photo Booth" },
  { path: "/valentine", name: "Valentine" },
  { path: "/games", name: "Games" },
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
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 0.5,
};

interface ScrapbookLayoutProps {
  children: React.ReactNode;
}

export default function ScrapbookLayout({ children }: ScrapbookLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Only show loading screen if we haven't loaded once already
  const [isLoading, setIsLoading] = useState(!hasLoadedOnce);
  const navState = useSyncExternalStore(subscribeToNavigation, getNavigationSnapshot, getNavigationSnapshot);
  const direction = navState.direction;

  // Find current page index
  const currentPageIndex = pages.findIndex((p) => p.path === pathname);
  const currentPage = currentPageIndex === -1 ? 0 : currentPageIndex;

  // Handle direction updates for external navigation (browser back/forward)
  useEffect(() => {
    const prevPath = navState.prevPath;
    if (prevPath !== pathname) {
      const prevIndex = pages.findIndex((p) => p.path === prevPath);
      const newIndex = pages.findIndex((p) => p.path === pathname);
      // Only update direction if navigating via browser back/forward
      if (prevIndex !== -1 && newIndex !== -1 && prevIndex !== newIndex) {
        const expectedDirection = newIndex > prevIndex ? 1 : -1;
        if (navState.direction !== expectedDirection) {
          setDirection(expectedDirection);
        }
      }
      updatePrevPath(pathname);
    }
  }, [pathname, navState.prevPath, navState.direction]);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex === currentPage) return;
    playPageFlip();
    setDirection(pageIndex > currentPage ? 1 : -1);
    router.push(pages[pageIndex].path);
  }, [currentPage, router]);

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      playPageFlip();
      setDirection(1);
      router.push(pages[currentPage + 1].path);
    }
  }, [currentPage, router]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      playPageFlip();
      setDirection(-1);
      router.push(pages[currentPage - 1].path);
    }
  }, [currentPage, router]);

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
            router.push("/");
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
  }, [currentPage, nextPage, prevPage, goToPage, router]);

  const handleLoadComplete = useCallback(() => {
    hasLoadedOnce = true;
    setIsLoading(false);
  }, []);

  // Show loading screen only on initial load
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
            <Link
              key={page.path}
              href={page.path}
              onClick={() => {
                if (index !== currentPage) {
                  playPageFlip();
                  setDirection(index > currentPage ? 1 : -1);
                }
              }}
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

      {/* Page Content with transitions */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="min-h-dvh w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Export navigation helpers for use in page components
export function useScrapbookNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  
  const currentPageIndex = pages.findIndex((p) => p.path === pathname);
  const currentPage = currentPageIndex === -1 ? 0 : currentPageIndex;

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      playPageFlip();
      router.push(pages[currentPage + 1].path);
    }
  }, [currentPage, router]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      playPageFlip();
      router.push(pages[currentPage - 1].path);
    }
  }, [currentPage, router]);

  return { nextPage, prevPage, currentPage, pages };
}
