"use client";

import { motion } from "framer-motion";

interface PageFooterProps {
  currentPage: number;
  totalPages: number;
}

export default function PageFooter({ currentPage, totalPages }: PageFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40"
    >
      <p className="font-handwritten text-lg text-brown-light/60 italic">
        Page {currentPage} of {totalPages} — made just for you
      </p>
    </motion.div>
  );
}
