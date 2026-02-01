import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WorkWithMeButton } from '../../ui';

const CHAR_DELAY = 0.03; // seconds per character
const INITIAL_DELAY = 0.3; // initial delay before typing starts

const Cursor = ({ isVisible }) => {
  return (
    <motion.span
      className="inline-block w-[3px] h-[1em] bg-current ml-[1px] align-middle"
      initial={{ opacity: 1 }}
      animate={isVisible ? { opacity: [1, 0, 1] } : { opacity: 0 }}
      transition={
        isVisible
          ? { duration: 0.8, repeat: Infinity, ease: 'steps(1)' }
          : { duration: 0.3 }
      }
    />
  );
};

const TypeWriter = ({ text, className, delay = 0, cursorIndex = -1 }) => {
  const characters = text.split('');

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: CHAR_DELAY,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={child} className="relative">
          {char}
          {cursorIndex === index && <Cursor isVisible={true} />}
        </motion.span>
      ))}
    </motion.span>
  );
};

const HomeHero = ({ ctaUrl }) => {
  const mainText = "Discover the works of Tatevik Petrosyan. ";
  const secondaryText = "Let's shape your brand into a masterpiece together.";
  const totalLength = mainText.length + secondaryText.length;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const isTypingComplete = currentIndex >= totalLength;

  // Start typing animation automatically on mount
  useEffect(() => {
    const startTime = Date.now();
    const initialDelayMs = INITIAL_DELAY * 1000;
    const charDelayMs = CHAR_DELAY * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < initialDelayMs) {
        setCurrentIndex(-1);
        return;
      }

      const charIndex = Math.floor((elapsed - initialDelayMs) / charDelayMs);
      if (charIndex >= totalLength) {
        setCurrentIndex(totalLength);
        clearInterval(interval);
      } else {
        setCurrentIndex(charIndex);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [totalLength]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="section-intro-lg"
    >
      <h1 className="mb-6 font-sans font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
        <TypeWriter
          text={mainText}
          delay={INITIAL_DELAY}
          cursorIndex={!isTypingComplete && currentIndex < mainText.length ? currentIndex : -1}
        />
        <TypeWriter
          text={secondaryText}
          className="text-[#ababab]"
          delay={INITIAL_DELAY + mainText.length * CHAR_DELAY}
          cursorIndex={!isTypingComplete && currentIndex >= mainText.length ? currentIndex - mainText.length : -1}
        />
      </h1>
      {ctaUrl && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INITIAL_DELAY + totalLength * CHAR_DELAY + 0.3 }}
        >
          <WorkWithMeButton href={ctaUrl} tone="dark" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomeHero;
