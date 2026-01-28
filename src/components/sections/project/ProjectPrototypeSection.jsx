import { motion } from 'framer-motion';
import { ContentBlock } from '../../project';

const ProjectPrototypeSection = ({ figmaUrl, title }) => {
  if (!figmaUrl) {
    return null;
  }

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading"
        >
          Interactive Prototype
        </motion.h2>
        <ContentBlock section={{ type: 'figma', url: figmaUrl, title }} />
      </div>
    </section>
  );
};

export default ProjectPrototypeSection;
