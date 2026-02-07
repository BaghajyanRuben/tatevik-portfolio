import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { WorkWithMeButton } from '../ui';
import aboutData from '../../data/about.json';

const TypewriterText = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-50px' });
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isInView) {
      // Reset when out of view
      setDisplayedText('');
      return;
    }

    let currentIndex = 0;
    const typingSpeed = 50; // milliseconds per character

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [isInView, text]);

  return (
    <p ref={ref} className={className}>
      {displayedText}
      <span
        className={`ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-white/80 ${
          isInView ? 'cursor-blink' : 'opacity-0'
        }`}
      />
    </p>
  );
};

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/projects', label: 'Projects' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-auto bg-black text-white"
    >
      <div className="container py-16 sm:py-20">
        <div className="flex flex-col gap-10 lg:gap-16">
          <WorkWithMeButton href={aboutData.social?.upwork} tone="light" />

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <h2 className="max-w-4xl text-4xl font-medium leading-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-[80px] lg:leading-[97px]">
              Let&apos;s start creating together
            </h2>

            <nav
              aria-label="Footer navigation"
              className="lg:ml-auto lg:flex lg:justify-end"
            >
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-base sm:text-lg lg:grid-cols-1 lg:justify-items-start lg:text-left">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="inline-flex w-fit text-white/90 transition-smooth hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <TypewriterText
            text="Designed by Tatevik. Built by AI. Zero drama."
            className="font-mono text-sm text-[#FF07DE] sm:text-base md:text-lg lg:text-xl lg:text-center"
          />
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
