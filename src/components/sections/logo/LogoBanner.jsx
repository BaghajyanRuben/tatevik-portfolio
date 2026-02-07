import { motion } from 'framer-motion';
import { staggerItem } from '../../../hooks/useScrollAnimation';

const LogoBanner = ({ bannerImage, alt = 'Logo banner' }) => {
  if (!bannerImage) return null;

  return (
    <motion.section
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="w-full"
    >
      <div className="overflow-hidden rounded-[20px] md:rounded-[30px]">
        <img
          src={bannerImage}
          alt={alt}
          loading="lazy"
          className="w-full h-auto"
        />
      </div>
    </motion.section>
  );
};

export default LogoBanner;
