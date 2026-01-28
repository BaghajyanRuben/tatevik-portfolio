import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WorkWithMeButton } from '../ui';
import aboutData from '../../data/about.json';

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

          <p className="text-sm text-white/80 sm:text-base md:text-lg lg:text-xl lg:text-center">
            Designed by Tatevik. Built by AI. Zero drama.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
