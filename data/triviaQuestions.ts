/**
 * Personal trivia questions about your relationship together
 * Customize these questions to make them more personal!
 */

export interface TriviaAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  reaction?: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  category: 'sweet' | 'funny' | 'memories' | 'favorites';
  answers: TriviaAnswer[];
  funFact?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'q1',
    question: "Where did we go on our first date?",
    category: 'memories',
    answers: [
      { id: 'a', text: "Coffee Shop", isCorrect: false },
      { id: 'b', text: "The Met", isCorrect: true },
      { id: 'c', text: "Movie Theater", isCorrect: false },
      { id: 'd', text: "Park Picnic", isCorrect: false }
    ],
    funFact: "We stayed there for 3 hours just talking!",
    difficulty: 'easy'
  },


  {
    id: 'q2',
    question: "What's our favorite thing to do together on weekends?",
    category: 'favorites',
    answers: [
      { id: 'a', text: "Watch movies and cuddle", isCorrect: true },
      { id: 'b', text: "Go hiking", isCorrect: false },
      { id: 'c', text: "Try new restaurants", isCorrect: false },
      { id: 'd', text: "Sleep in", isCorrect: false }
    ],
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: "What's Matthew's favorite thing that Kezia bakes?",
    category: 'favorites',
    answers: [
      { id: 'a', text: "Chocolate Chip Cookies", isCorrect: false },
      { id: 'b', text: "Vanilla Cake", isCorrect: false },
      { id: 'c', text: "Matcha Cookies", isCorrect: true },
      { id: 'd', text: "Everything she makes!", isCorrect: false }
    ],
    funFact: "You've eaten over 100 batches!",
    difficulty: 'easy'
  },
  {
    id: 'q4',
    question: "What's the most romantic thing Matthew has done for Kezia?",
    category: 'sweet',
    answers: [
      { id: 'a', text: "Built this scrapbook", isCorrect: true },
      { id: 'b', text: "Bought flowers", isCorrect: false },
      { id: 'c', text: "Cooked dinner", isCorrect: false },
      { id: 'd', text: "Wrote a poem", isCorrect: false }
    ],
    difficulty: 'easy'
  },
  {
    id: 'q5',
    question: "What do we always argue about (in a funny way)?",
    category: 'funny',
    answers: [
      { id: 'a', text: "What to eat for dinner", isCorrect: true },
      { id: 'b', text: "Who loves who more", isCorrect: false },
      { id: 'c', text: "Netflix vs movies", isCorrect: false },
      { id: 'd', text: "We never argue", isCorrect: false }
    ],
    difficulty: 'easy'
  },
  {
    id: 'q6',
    question: "What's our inside joke that only we understand?",
    category: 'memories',
    answers: [
      { id: 'a', text: "Racism", isCorrect: true },
      { id: 'b', text: "We don't have one", isCorrect: false },
      { id: 'c', text: "That's your job to remember", isCorrect: false },
      { id: 'd', text: "What happens in Vegas stays in Vegas", isCorrect: false }
    ],
    difficulty: 'hard'
  },
  {
    id: 'q7',
    question: "What did we do on our most memorable anniversary?",
    category: 'memories',
    answers: [
      { id: 'a', text: "Went to Paris", isCorrect: false },
      { id: 'b', text: "Massage", isCorrect: true },
      { id: 'c', text: "Flew to Japan", isCorrect: false },
      { id: 'd', text: "Exchanged gifts", isCorrect: false }
    ],
    difficulty: 'medium'
  },
  {
    id: 'q8',
    question: "What's Matthew's nickname for Kezia?",
    category: 'sweet',
    answers: [
      { id: 'a', text: "Kiki", isCorrect: false },
      { id: 'b', text: "Loser", isCorrect: true },
      { id: 'c', text: "Kezzy", isCorrect: false },
      { id: 'd', text: "I don't have one", isCorrect: false }
    ],
    difficulty: 'easy'
  },
  {
    id: 'q9',
    question: "What makes our relationship special?",
    category: 'sweet',
    answers: [
      { id: 'a', text: "We support each other's dreams", isCorrect: true },
      { id: 'b', text: "We love the same food", isCorrect: false },
      { id: 'c', text: "We both like baking", isCorrect: false },
      { id: 'd', text: "All of the above", isCorrect: true }
    ],
    funFact: "This was the easiest question to write!",
    difficulty: 'easy'
  }
];

// Helper to get category color class
export function getCategoryColor(category: TriviaQuestion['category']): string {
  switch (category) {
    case 'sweet':
      return 'bg-blush/20 text-blush';
    case 'funny':
      return 'bg-sage/20 text-sage';
    case 'memories':
      return 'bg-brown/20 text-brown';
    case 'favorites':
      return 'bg-blush-light/30 text-blush';
    default:
      return 'bg-brown-light/20 text-brown';
  }
}

// Helper to get rank message based on score
export function getRankMessage(score: number): string {
  if (score === 100) return "Perfect Score! 🌟";
  if (score >= 90) return "Amazing! You know me so well! 💕";
  if (score >= 80) return "Wonderful! Almost perfect! ✨";
  if (score >= 70) return "Great job! You're pretty close! 🎉";
  if (score >= 60) return "Not bad! There's always more to learn! 📚";
  return "Well... we need to spend more time together! 😄";
}

// Helper to get personal message based on score
export function getPersonalMessage(score: number): string {
  if (score >= 90) {
    return "You truly understand what makes me special. Every answer shows how much you care. 💖";
  } else if (score >= 70) {
    return "You know the important things! The little details make our relationship special. 🍪";
  } else {
    return "Hey, it's the thought that counts! Besides, I love that you want to learn more about me! 💕";
  }
}
