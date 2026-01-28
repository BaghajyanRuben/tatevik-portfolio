import { motion } from 'framer-motion';
import { SocialLinks } from '../../about';

const ContactSection = ({ social }) => {
  return (
    <section className="section-muted">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="heading-md mb-4">Let's Work Together</h2>
          <p className="body-md mb-8">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to collaborate. Let's create something amazing.
          </p>
          <SocialLinks social={social} />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
