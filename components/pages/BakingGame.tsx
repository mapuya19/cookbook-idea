"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useConfetti } from "../effects/Confetti";
import { playPopSound, playSuccessSound } from "@/utils/sounds";

interface BakingGameProps {
  onNext: () => void;
  onPrev: () => void;
}

// Baking-themed items for the memory game
const bakingItems = [
  { id: "cookie", emoji: "🍪", name: "Cookie" },
  { id: "cupcake", emoji: "🧁", name: "Cupcake" },
  { id: "cake", emoji: "🎂", name: "Cake" },
  { id: "heart", emoji: "💖", name: "Heart" },
  { id: "strawberry", emoji: "🍓", name: "Strawberry" },
  { id: "matcha", emoji: "🍵", name: "Matcha" },
];

interface Card {
  id: number;
  itemId: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createCards(): Card[] {
  const cards: Card[] = [];
  bakingItems.forEach((item, index) => {
    // Create pairs
    cards.push({
      id: index * 2,
      itemId: item.id,
      emoji: item.emoji,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: index * 2 + 1,
      itemId: item.id,
      emoji: item.emoji,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    });
  });
  // Shuffle
  return cards.sort(() => Math.random() - 0.5);
}

export default function BakingGame({ onPrev }: BakingGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const { fireConfetti } = useConfetti();

  // Initialize game
  useEffect(() => {
    setCards(createCards());
  }, []);

  const handleCardClick = useCallback((cardId: number) => {
    if (isLocked) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    playPopSound();
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard && secondCard && firstCard.itemId === secondCard.itemId) {
        // Match found!
        playSuccessSound();
        setCards(prev => prev.map(c => 
          c.id === firstId || c.id === secondId 
            ? { ...c, isMatched: true } 
            : c
        ));
        setFlippedCards([]);
        setIsLocked(false);
        
        // Check for win
        const matchedCount = cards.filter(c => c.isMatched).length + 2;
        if (matchedCount === cards.length) {
          setIsWon(true);
          fireConfetti();
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isLocked, fireConfetti]);

  const resetGame = useCallback(() => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setIsLocked(false);
  }, []);

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            Memory Match! 🍪
          </h2>
          <p className="font-body text-brown-light text-sm sm:text-base">
            Match all the baking goodies!
          </p>
        </motion.div>

        {/* Moves counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-4"
        >
          <span className="font-body text-brown-light">
            Moves: <span className="font-semibold text-blush">{moves}</span>
          </span>
        </motion.div>

        {/* Game board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 px-2 sm:px-0"
        >
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isLocked}
              className={`
                aspect-square rounded-lg sm:rounded-xl relative
                transition-all duration-300 transform-gpu touch-manipulation
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2
                ${card.isMatched 
                  ? 'bg-sage-light/50 cursor-default' 
                  : card.isFlipped 
                    ? 'bg-white shadow-lg' 
                    : 'bg-blush-light active:bg-blush sm:hover:bg-blush active:scale-95 sm:hover:scale-105 cursor-pointer shadow-md'
                }
              `}
              style={{ perspective: '1000px' }}
              aria-label={card.isFlipped || card.isMatched ? card.name : 'Hidden card'}
            >
              <AnimatePresence mode="wait">
                {(card.isFlipped || card.isMatched) ? (
                  <motion.span
                    key="front"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl"
                  >
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-2xl text-white/60" aria-hidden="true">?</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>

        {/* Win message */}
        <AnimatePresence>
          {isWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-6"
            >
              <motion.p
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="font-handwritten text-3xl sm:text-4xl text-blush mb-2"
              >
                You did it! 🎉
              </motion.p>
              <p className="font-body text-brown-light">
                Completed in <span className="font-semibold text-brown">{moves}</span> moves!
              </p>
              <p className="font-handwritten text-xl text-sage mt-2">
                Sweet as your baking! 💕
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-sage text-white font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            {isWon ? 'Play Again' : 'Restart'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            Back to Scrapbook
          </motion.button>
        </motion.div>

        {/* Decorative elements - positioned in far corners to avoid content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay: 1 }}
          className="absolute top-2 right-2 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-3xl">🧁</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-2 left-2 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-3xl">🍪</span>
        </motion.div>
      </div>
    </div>
  );
}
