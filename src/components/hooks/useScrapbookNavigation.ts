import { useCallback, useEffect, useState } from "react";
import { playPageFlip } from "@/utils/sounds";

export interface Page {
  path?: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
}

export interface NavigationOptions {
  pages: Page[];
  currentPage: number;
  onPageChange?: (pageIndex: number) => void;
}

/**
 * Shared navigation hook for scrapbook navigation
 * Handles keyboard events, page transitions, and direction tracking
 */
export function useScrapbookNavigation(options: NavigationOptions) {
  const { pages, currentPage: initialPage = 0, onPageChange } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [direction, setDirection] = useState(0);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex === currentPage) return;
    playPageFlip();
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
    onPageChange?.(pageIndex);
  }, [currentPage, onPageChange]);

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      playPageFlip();
      setDirection(1);
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, pages.length, onPageChange]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      playPageFlip();
      setDirection(-1);
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, onPageChange]);

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
            onPageChange?.(0);
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
  }, [currentPage, nextPage, prevPage, goToPage, pages.length, onPageChange]);

  return {
    currentPage,
    direction,
    setDirection,
    goToPage,
    nextPage,
    prevPage,
    pages,
  };
}


