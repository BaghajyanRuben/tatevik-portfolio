import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const LogoGrid = ({ images = [] }) => {
  if (!images.length) return null;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="w-full"
    >
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            className="relative aspect-square overflow-hidden rounded-[20px] md:rounded-[30px]"
          >
            <img
              src={image}
              alt={`Logo design ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default LogoGrid;
