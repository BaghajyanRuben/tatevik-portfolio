import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Navigate back to explore Tatevik Petrosyan's UI/UX and icon design portfolio."
        url="/404"
      />
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[120px] md:text-[160px] font-bold leading-none text-neutral-200 select-none mb-6"
            aria-hidden="true"
          >
            404
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-neutral-600 mb-10 text-lg">
              Oops! The page you're looking for seems to have wandered off. 
              Let's get you back on track.
            </p>
          </motion.div>

          {/* Navigation Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
            >
              <Home size={18} />
              Go Home
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors"
            >
              <Search size={18} />
              View Projects
            </Link>
          </motion.div>

          {/* Back Link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => window.history.back()}
            className="mt-10 inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go back to previous page
          </motion.button>
        </motion.div>
      </main>
    </>
  );
};

export default NotFound;
