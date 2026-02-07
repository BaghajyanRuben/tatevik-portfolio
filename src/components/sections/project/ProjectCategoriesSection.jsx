import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useScrollAnimation, scrollVariants } from '../../../hooks/useScrollAnimation';

const categoryLinks = [
  { path: '/projects/ui-ux', label: 'UX / UI Design Products' },
  { path: '/projects/logo', label: 'Logo' },
  { path: '/projects/icons', label: 'Icons' },
];

const ProjectCategoriesSection = () => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section py-0">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={scrollVariants}
          className="flex flex-wrap justify-start gap-3"
        >
          {categoryLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={link.path}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-normal leading-6 text-secondary transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectCategoriesSection;
