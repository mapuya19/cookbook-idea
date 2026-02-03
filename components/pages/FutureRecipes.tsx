"use client";

import { motion } from "framer-motion";
import RecipeCard from "../ui/RecipeCard";

interface FutureRecipesProps {
  onNext: () => void;
  onPrev: () => void;
}

const futureRecipes = [
  {
    title: "Cinnamoroll cinnamon rolls",
    description: "As cute as the character, twice as delicious",
  },
  {
    title: "Mango mochi dessert",
    description: "Soft, chewy, and bursting with tropical sweetness",
  },
  {
    title: "Something we'll definitely mess up together",
    description: "And laugh about while eating it anyway",
  },
  {
    title: "Birthday cupcakes for each other",
    description: "Homemade, decorated with love (and probably too much frosting)",
  },
  {
    title: "A surprise (just because)",
    description: "No occasion needed, just wanting to see you smile",
  },
];

export default function FutureRecipes({ onNext }: FutureRecipesProps) {
  return (
    <div className="scrapbook-page paper-texture">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            Future Recipes
          </h2>
          <p className="font-body text-brown-light/70 text-sm sm:text-base">
            things I want to make with you
          </p>
        </motion.div>

        {/* Recipe cards */}
        <div className="space-y-4">
          {futureRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.title}
              title={recipe.title}
              description={recipe.description}
              delay={0.2 + index * 0.12}
            />
          ))}
        </div>

        {/* Decorative note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="font-handwritten text-lg text-brown-light/60 italic">
            (check them off as we go... or don&apos;t, they&apos;re just dreams for now)
          </p>
        </motion.div>

        {/* Decorative elements - positioned in far corners to avoid content */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.1, rotate: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute top-2 right-2 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <svg width="60" height="60" viewBox="0 0 100 100" className="text-blush" aria-hidden="true">
            {/* Mixing bowl */}
            <ellipse cx="50" cy="70" rx="40" ry="20" fill="currentColor" />
            <ellipse cx="50" cy="65" rx="35" ry="15" fill="#FDF6E3" />
            {/* Whisk */}
            <rect x="70" y="20" width="4" height="30" rx="2" fill="#8B7355" opacity="0.5" />
            <ellipse cx="72" cy="55" rx="8" ry="12" stroke="#8B7355" strokeWidth="2" fill="none" opacity="0.5" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-2 left-2 hidden xl:block pointer-events-none"
          aria-hidden="true"
        >
          <svg width="45" height="45" viewBox="0 0 60 60" className="text-sage" aria-hidden="true">
            {/* Rolling pin */}
            <rect x="5" y="25" width="50" height="10" rx="5" fill="currentColor" />
            <rect x="0" y="27" width="8" height="6" rx="3" fill="currentColor" />
            <rect x="52" y="27" width="8" height="6" rx="3" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Continue hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={onNext}
            className="font-handwritten text-lg text-brown-light/60 hover:text-blush transition-colors flex items-center gap-2 mx-auto group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            one more thing...
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
