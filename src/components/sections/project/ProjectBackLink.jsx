import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const ProjectBackLink = ({ onBack }) => {
  return (
    <div className="container page-main-top-md">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onBack}
        className="back-link"
        aria-label="Go back to previous page"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>
    </div>
  );
};

export default ProjectBackLink;
