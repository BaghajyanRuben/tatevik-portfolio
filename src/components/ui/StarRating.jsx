import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const StarRating = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false 
}) => {
  const handleClick = (rating) => {
    if (!disabled) {
      onChange({ target: { name, value: rating } });
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <motion.button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(rating);
              }
            }}
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            whileTap={{ scale: disabled ? 1 : 0.9 }}
            disabled={disabled}
            className={`p-1 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={`Rate ${rating} stars`}
          >
            <Star
              size={32}
              className={`transition-colors ${
                rating <= value 
                  ? 'fill-primary text-primary' 
                  : 'text-primary/20'
              }`}
            />
          </motion.button>
        ))}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default StarRating;
