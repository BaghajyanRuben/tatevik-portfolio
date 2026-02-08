import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../hooks/useScrollAnimation';

const FeedbackGrid = ({ feedbacks }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="section-grid mb-8"
    >
      {feedbacks.map((feedback) => (
        <motion.article
          key={`${feedback.clientName}-${feedback.projectTitle}`}
          variants={staggerItem}
          className="soft-card"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-muted">Project</p>
              <p className="font-medium text-primary">{feedback.projectTitle}</p>
            </div>
            <div
              className="flex items-center gap-1"
              aria-label={`Rating: ${feedback.rating} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={index < feedback.rating ? 'text-primary' : 'text-primary/20'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <p className="body-md mb-6 text-primary/80">"{feedback.feedback}"</p>

          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-primary">{feedback.clientName}</p>
            <p className="text-sm text-muted">
              {feedback.startDate} – {feedback.endDate}
            </p>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default FeedbackGrid;
