import { motion } from 'framer-motion';
import { Button } from '../../ui';

const ProjectNextSection = ({ onNext }) => {
  return (
    <section className="section">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted mb-4">Next Project</p>
          <Button onClick={onNext} variant="secondary">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectNextSection;
