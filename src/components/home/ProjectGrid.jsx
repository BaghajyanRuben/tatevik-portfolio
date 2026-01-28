import { motion } from 'framer-motion';
import { Card } from '../ui';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const ProjectGrid = ({ projects }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="section-grid-3"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={staggerItem}>
          <Card
            title={project.title}
            subtitle={project.subtitle}
            image={project.thumbnail}
            href={`/project/${project.id}`}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
