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
        className={`card group ${className}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="card-media">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
          <div className="card-overlay">
            <div>
              <h3 className="text-[36px] font-sans font-semibold text-white mb-1">
                {title}
              </h3>
              <p className="text-white/80 text-sm font-sans">{subtitle}</p>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default Card;
