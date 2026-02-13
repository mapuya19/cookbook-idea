"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LoveNoteHeart } from "../effects/LoveNotes";

const FloatingHeart = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <div
    className="absolute pointer-events-none animate-float-slow"
    style={{
      left: x,
      top: y,
      fontSize: size,
      color: "#A8C69F",
      animationDelay: `${delay}s`,
      opacity: '0.6',
      transform: `rotate(${rotation}deg)`
    }}
    aria-hidden="true"
  >
    🍵
  </div>
);

interface TimeTogetherProps {
  onNext: () => void;
  onPrev: () => void;
}

const startDate = new Date("2024-06-19T00:00:00");

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TimeTogether({ onNext, onPrev }: TimeTogetherProps) {
  const [timeUnits, setTimeUnits] = useState<TimeUnits>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUnits({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeCard = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
    <div
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex-1 min-w-[100px] sm:min-w-[120px] text-center"
    >
      <div
        className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-blush mb-2"
      >
        {value.toLocaleString()}
      </div>
      <div className="font-body text-sm sm:text-base text-brown-light">
        {label}
      </div>
    </div>
  );

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-brown mb-3">
            Time Together 💕
          </h2>
          <p className="font-body text-brown-light text-base sm:text-lg">
            Since June 19, 2024
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12"
        >
          <TimeCard value={timeUnits.days} label="Days" delay={0.4} />
          <TimeCard value={timeUnits.hours} label="Hours" delay={0.5} />
          <TimeCard value={timeUnits.minutes} label="Minutes" delay={0.6} />
          <TimeCard value={timeUnits.seconds} label="Seconds" delay={0.7} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="font-handwritten text-xl sm:text-2xl text-brown-light text-center leading-relaxed"
        >
          Every minute with you is a gift I treasure forever
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            className="px-5 py-2.5 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-brown-light/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="px-5 py-2.5 bg-blush text-white font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 touch-manipulation active:scale-95"
          >
            Continue
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 0.08, rotate: -10 }}
        transition={{ delay: 1.5 }}
        className="absolute top-4 right-4 text-4xl pointer-events-none hidden xl:block"
        aria-hidden="true"
      >
        💕
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 10 }}
        animate={{ opacity: 0.08, rotate: 10 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-4 left-4 text-4xl pointer-events-none hidden xl:block"
        aria-hidden="true"
      >
        💕
      </motion.div>

      <LoveNoteHeart x="75%" y="65%" delay={2.5} rotation={7} />

      <FloatingHeart delay={0.8} x="8%" y="22%" size={19} rotation={-5} />
      <FloatingHeart delay={1.1} x="89%" y="18%" size={17} rotation={8} />
      <FloatingHeart delay={1.4} x="80%" y="75%" size={20} rotation={-9} />
    </div>
  );
}
