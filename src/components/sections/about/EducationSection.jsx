import { motion } from 'framer-motion';
import { useScrollAnimation, staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const EducationSection = ({ education }) => {
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
            Education
          </motion.h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <motion.div key={index} variants={staggerItem} className="info-card">
                <div>
                  <h3 className="font-semibold text-primary">{edu.school}</h3>
                  <p className="text-muted">{edu.degree}</p>
                  <p className="text-sm text-muted/70">{edu.location}</p>
                </div>
                <p className="text-sm text-muted mt-2 md:mt-0">{edu.period}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;
