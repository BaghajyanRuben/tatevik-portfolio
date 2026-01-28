import { motion } from 'framer-motion';
import { useScrollAnimation, staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const ExperienceSection = ({ experience }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.h2 variants={staggerItem} className="section-heading">
            Experience
          </motion.h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <motion.div key={index} variants={staggerItem} className="info-card">
                <div>
                  <h3 className="font-semibold text-primary">{exp.title}</h3>
                  <p className="text-muted">{exp.company}</p>
                </div>
                <p className="text-sm text-muted mt-2 md:mt-0">{exp.period}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
