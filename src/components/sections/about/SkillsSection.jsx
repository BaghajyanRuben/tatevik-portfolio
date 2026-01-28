import { motion } from 'framer-motion';
import { useScrollAnimation, staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const SkillsSection = ({ skills }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-muted">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.h2 variants={staggerItem} className="section-heading">
            Skills & Tools
          </motion.h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <motion.span key={skill} variants={staggerItem} className="badge-chip">
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
