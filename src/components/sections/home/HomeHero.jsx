import { motion } from 'framer-motion';
import { WorkWithMeButton } from '../../ui';

const HomeHero = ({ ctaUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="section-intro-lg"
    >
      <h1 className="mb-6 font-sans font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
        Discover the works of Tatevik Petrosyan.{' '}
        <span className="text-[#ababab]">
          Let’s shape your brand into a masterpiece together.
        </span>
      </h1>
      {ctaUrl && (
        <div className="mt-8">
          <WorkWithMeButton href={ctaUrl} tone="dark" />
        </div>
      )}
    </motion.div>
  );
};

export default HomeHero;
