import { motion } from 'framer-motion';

const ProjectHero = ({ title, description, heroImage }) => {
  return (
    <section className="">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mb-12"
        >
          <h1 className="heading-xl mb-6">{title}</h1>
          <p className="body-lg">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-2xl overflow-hidden bg-gray-100"
        >
          <img
            src={heroImage}
            alt={title}
            width={1200}
            height={675}
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectHero;
