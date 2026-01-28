import { motion } from 'framer-motion';
import { Button } from '../../ui';

const HomeHero = ({ ctaUrl, ctaIcon }) => {
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
          <Button
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <span>Work with me</span>
            {ctaIcon && (
              <img src={ctaIcon} alt="" className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default HomeHero;
