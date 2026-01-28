import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const TestimonialsGrid = ({ testimonials }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="section-grid"
    >
      {testimonials.map((testimonial) => (
        <motion.article
          key={`${testimonial.clientName}-${testimonial.projectTitle}`}
          variants={staggerItem}
          className="soft-card"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-muted">Project</p>
              <p className="font-medium text-primary">{testimonial.projectTitle}</p>
            </div>
            <div
              className="flex items-center gap-1"
              aria-label={`Rating: ${testimonial.rating} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={index < testimonial.rating ? 'text-primary' : 'text-primary/20'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <p className="body-md mb-6 text-primary/80">“{testimonial.feedback}”</p>

          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-primary">{testimonial.clientName}</p>
            <p className="text-sm text-muted">
              {testimonial.startDate} – {testimonial.endDate}
            </p>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default TestimonialsGrid;
