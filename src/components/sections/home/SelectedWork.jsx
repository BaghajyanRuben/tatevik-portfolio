import { motion } from 'framer-motion';
import { ProjectGrid } from '../../home';

const SelectedWork = ({ projects }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider">
          Selected Work
        </h2>
      </motion.div>

      <ProjectGrid projects={projects} />
    </>
  );
};

export default SelectedWork;
