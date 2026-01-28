import { motion } from 'framer-motion';

const ProjectsIntro = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="section-intro"
    >
      <h1 className="heading-lg mb-4">Projects</h1>
      <p className="body-md max-w-2xl">
        A full selection of UI/UX, product, and icon design work.
      </p>
    </motion.div>
  );
};

export default ProjectsIntro;
