"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import { useConfetti } from "../effects/Confetti";
import { TRIVIA_QUESTIONS, getCategoryColor, getRankMessage, getPersonalMessage } from "@/data/triviaQuestions";
import { playQuizCorrect, playQuizIncorrect } from "@/utils/sounds";

interface TriviaQuizProps {
  onBack: () => void;
}

export default function TriviaQuiz({ onBack }: TriviaQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const { fireConfetti } = useConfetti();

  const currentQuestion = useMemo(() => TRIVIA_QUESTIONS[currentQuestionIndex], [currentQuestionIndex]);
  const totalQuestions = TRIVIA_QUESTIONS.length;
  const isAnswered = answeredQuestions.has(currentQuestionIndex);

  const progress = useMemo(() => {
    return ((currentQuestionIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100;
  }, [currentQuestionIndex, isAnswered, totalQuestions]);



  const handleAnswer = useCallback((answer: typeof currentQuestion.answers[0]) => {
    if (isAnswered) return;

    const isCorrect = answer.isCorrect;

    setSelectedAnswer(answer.id);
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));

    if (isCorrect) {
      const streakBonus = streak * 10;
      const points = 100 + streakBonus;
      setScore(s => s + points);
      setStreak(s => s + 1);
      playQuizCorrect();

      if (streak >= 2) {
        fireConfetti();
      }
    } else {
      setStreak(0);
      playQuizIncorrect();
    }

    setTimeout(() => {
      setSelectedAnswer(null);

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setQuizFinished(true);
        const finalScore = score + (isCorrect ? 100 + streak * 10 : 0);
        if (finalScore >= 800) {
          fireConfetti();
        }
      }
    }, 2500);
  }, [isAnswered, currentQuestionIndex, totalQuestions, score, streak, fireConfetti, currentQuestion]);

  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setSelectedAnswer(null);
    setQuizFinished(false);
    setScore(0);
    setStreak(0);
  }, []);

  const getAnswerButtonClass = useCallback((
    answer: typeof currentQuestion.answers[0],
    isSelected: boolean
  ) => {
    const baseClasses = 'w-full p-4 rounded-xl text-left transition-all shadow-md hover:scale-102 active:scale-98';

    if (!isAnswered) {
      return `${baseClasses} bg-white`;
    }

    if (answer.isCorrect) {
      return `${baseClasses} bg-sage text-white`;
    }

    if (isSelected) {
      return `${baseClasses} bg-error-rose text-white`;
    }

    return `${baseClasses} bg-white/50 opacity-50`;
  }, [isAnswered, currentQuestion]);

  if (quizFinished) {
    const finalScore = Math.round((score / (totalQuestions * 100)) * 100);

    return (
      <div className="scrapbook-page paper-texture relative overflow-hidden">
        <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
          <div>
            <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
              Quiz Complete! 🎉
            </h2>
            <p className="font-body text-brown-light">
              Here&apos;s how you did
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mb-6">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#E8C9A0" strokeWidth="12" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#7B9E6C"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${finalScore * 4.4} 440`}
                  style={{
                    strokeDashoffset: 440 - (finalScore * 4.4),
                    transition: 'strokeDashoffset 1.5s ease-out'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-handwritten text-4xl text-blush">
                    {finalScore}%
                  </span>
                </div>
              </svg>
            </div>

            <h3 className="font-handwritten text-3xl text-brown mb-2">
              {getRankMessage(finalScore)}
            </h3>
            <p className="font-body text-brown-light mb-4">
              You answered {answeredQuestions.size} out of {totalQuestions} questions
            </p>
            <div className="bg-cream rounded-xl p-4 mb-6">
              <p className="font-body text-brown">
                {getPersonalMessage(finalScore)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blush text-white font-body font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:scale-105 hover:bg-brown-light/30 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            How well do you know Matthew? 💕
          </h2>

          <div className="w-full bg-brown-light/20 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-blush h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="font-body text-sm text-brown-light mt-2">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        {streak > 1 && (
          <div className="text-center mb-4">
            <span className="font-body text-sm text-brown">
              🔥 {streak} in a row!
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            <div className="flex justify-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-body ${getCategoryColor(currentQuestion.category)}`}>
                {currentQuestion.category}
              </span>
            </div>

            <h3 className="font-handwritten text-2xl text-brown text-center mb-6">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswer(answer)}
                  disabled={isAnswered}
                  className={getAnswerButtonClass(answer, selectedAnswer === answer.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-body font-semibold text-sm flex-shrink-0
                      ${isAnswered && answer.isCorrect ? 'bg-sage text-white' : 'bg-brown-light/20'}
                    `}>
                      {answer.id.toUpperCase()}
                    </span>
                    <span className="font-body flex-1">{answer.text}</span>
                    {isAnswered && answer.isCorrect && (
                      <span className="text-2xl flex-shrink-0">
                        ✅
                      </span>
                    )}
                    {isAnswered && !answer.isCorrect && selectedAnswer === answer.id && (
                      <span className="text-2xl flex-shrink-0">
                        ❌
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center">
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2"
          >
            Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}
