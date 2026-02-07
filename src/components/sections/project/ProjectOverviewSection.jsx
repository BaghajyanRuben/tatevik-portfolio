import { motion } from 'framer-motion';
import { useScrollAnimation, scrollVariants } from '../../../hooks/useScrollAnimation';

const ProjectOverviewSection = ({ overview }) => {
  const { ref, isInView } = useScrollAnimation();

  if (!overview) return null;

  const { text, role, duration, tools } = overview;

  return (
    <section className="section py-0">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={scrollVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
        >
          {/* Main Overview Text */}
          <div className="lg:col-span-7">
            <h2 className="heading-md mb-6">Overview</h2>
            <p className="body-lg text-muted">{text}</p>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8">
              {role && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <p className="text-sm text-muted uppercase tracking-wider mb-2">Role</p>
                  <p className="body-md font-medium">{role}</p>
                </motion.div>
              )}

              {duration && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <p className="text-sm text-muted uppercase tracking-wider mb-2">Duration</p>
                  <p className="body-md font-medium">{duration}</p>
                </motion.div>
              )}

              {tools && tools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <p className="text-sm text-muted uppercase tracking-wider mb-2">Tools</p>
                  <p className="body-md font-medium">{tools.join(', ')}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectOverviewSection;
