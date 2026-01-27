import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const AboutHero = ({ name, title, photo, bio, bioExtended, location }) => {
  return (
    <section className="pt-32 sm:pt-32 pb-12 sm:pb-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="order-2 lg:order-1"
          >
            <h1 className="heading-xl mb-4">{name}</h1>
            <p className="text-lg sm:text-xl text-accent font-medium mb-2">{title}</p>
            {location && (
              <p className="flex items-center gap-1 text-muted mb-4 sm:mb-6">
                <MapPin size={16} />
                <span>{location}</span>
              </p>
            )}
            <p className="body-lg mb-4 sm:mb-6">{bio}</p>
            <p className="body-md">{bioExtended}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
