import { motion } from 'framer-motion';

const TestimonialsIntro = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="section-intro"
    >
      <h1 className="heading-lg mb-4">Testimonials</h1>
      <p className="body-md max-w-2xl">Feedback from clients and collaborators.</p>
    </motion.div>
  );
};

export default TestimonialsIntro;
