import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Card = ({
  title,
  subtitle,
  image,
  href,
  className = ''
}) => {
  return (
    <Link to={href}>
      <motion.article
        className={`group relative overflow-hidden rounded-2xl bg-white cursor-pointer ${className}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-primary/60 flex items-end p-6"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-1">
                {title}
              </h3>
              <p className="text-white/80 text-sm">{subtitle}</p>
            </div>
          </motion.div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-display font-semibold text-primary group-hover:text-accent transition-smooth">
            {title}
          </h3>
          <p className="text-muted text-sm mt-1">{subtitle}</p>
        </div>
      </motion.article>
    </Link>
  );
};

export default Card;
