import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/testimonials', label: 'Testimonials' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-md"
    >
      <div className="container">
        <nav className="relative flex flex-col gap-4 py-4 md:py-0 md:flex-row md:items-center md:h-20">
          <div className="flex items-center justify-between w-full gap-4 md:contents">
            <Link
              to="/"
              className="text-lg sm:text-xl font-display font-semibold text-primary hover:text-accent transition-smooth"
            >
              Tatevik Petrosyan
            </Link>
            <Button
              onClick={() => navigate('/projects')}
              size="sm"
              className="gap-2 sm:px-6 sm:py-3 sm:text-base md:ml-auto"
            >
              <span>Projects</span>
            </Button>
          </div>

          <ul className="w-full md:w-auto flex flex-wrap items-center justify-start gap-4 sm:gap-6 md:absolute md:left-1/2 md:-translate-x-1/2 md:gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative text-sm font-medium transition-smooth ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
