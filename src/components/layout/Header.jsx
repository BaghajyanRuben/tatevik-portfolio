import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import arrow45 from '../../assets/arrow-45.svg';

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
        <nav className="relative flex items-center h-20">
          <Link
            to="/"
            className="text-xl font-display font-semibold text-primary hover:text-accent transition-smooth"
          >
            Tatevik Petrosyan
          </Link>

          <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
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

          <div className="ml-auto">
            <Button onClick={() => navigate('/projects')} className="gap-2">
              <span>Projects</span>
            </Button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
