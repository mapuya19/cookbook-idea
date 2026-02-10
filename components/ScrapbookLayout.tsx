"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import CursorTrail from "./effects/CursorTrail";
import MusicPlayer from "./MusicPlayer";
import { useRouterNavigation } from "./hooks/useScrapbookNavigation";
import NavigationArrows from "./ui/NavigationArrows";
import NavigationDots from "./ui/NavigationDots";
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

  // Use the shared router-based navigation hook
  const { goToPage, nextPage, prevPage } = useRouterNavigation({
    pages,
    currentPage,
  });

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
        setDirection={setDirection}
        useRouter={true}
      />

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
