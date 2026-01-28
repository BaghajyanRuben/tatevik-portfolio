import { motion } from 'framer-motion';
import { useScrollAnimation, staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const CredentialsSection = ({ certifications, languages }) => {
  const { ref: certRef, isInView: certInView } = useScrollAnimation();
  const { ref: langRef, isInView: langInView } = useScrollAnimation();

  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            ref={certRef}
            initial="hidden"
            animate={certInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="section-heading-sm">
              Certifications
            </motion.h2>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-primary/10"
                >
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-primary">{cert}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            ref={langRef}
            initial="hidden"
            animate={langInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="section-heading-sm">
              Languages
            </motion.h2>
            <div className="space-y-3">
              {languages.map((lang, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary/10"
                >
                  <span className="font-medium text-primary">{lang.language}</span>
                  <span className="text-sm text-muted">{lang.level}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
