"use client";

import { motion } from "framer-motion";
import RecipeCard from "../ui/RecipeCard";

interface FutureRecipesProps {
  onNext: () => void;
  onPrev: () => void;
}

const futureRecipes = [
  {
    title: "Cinnamon rolls on a slow Sunday morning",
    description: "Warm, gooey, and made with nowhere to be",
  },
  {
    title: "That complicated recipe you keep saving",
    description: "The one you've bookmarked a hundred times — let's finally try it",
  },
  {
    title: "Something we'll definitely mess up together",
    description: "And laugh about while eating it anyway",
  },
  {
    title: "Birthday cake for each other",
    description: "Homemade, imperfect, and full of love",
  },
  {
    title: "A surprise bake just because",
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

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.15, rotate: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute top-16 right-4 hidden lg:block"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" className="text-blush">
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
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-32 left-4 hidden lg:block"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-sage">
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
            className="font-handwritten text-lg text-brown-light/60 hover:text-blush transition-colors flex items-center gap-2 mx-auto group"
          >
            one more thing...
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
