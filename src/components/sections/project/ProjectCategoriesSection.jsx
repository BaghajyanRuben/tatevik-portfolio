import { motion } from 'framer-motion';
import { useScrollAnimation, scrollVariants } from '../../../hooks/useScrollAnimation';

const ProjectCategoriesSection = ({ categories }) => {
  const { ref, isInView } = useScrollAnimation();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="section pt-0">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={scrollVariants}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="px-5 py-2.5 rounded-full border border-border bg-white text-sm font-medium text-foreground hover:bg-gray-50 transition-colors duration-200"
            >
              {category}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectCategoriesSection;
