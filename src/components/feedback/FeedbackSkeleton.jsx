import { motion } from 'framer-motion';

const FeedbackSkeleton = () => {
  return (
    <div className="soft-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="h-3 w-16 bg-primary/10 rounded mb-2 animate-pulse"></div>
          <div className="h-5 w-32 bg-primary/10 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-6 h-6 bg-primary/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-4 bg-primary/10 rounded animate-pulse"></div>
        <div className="h-4 bg-primary/10 rounded w-5/6 animate-pulse"></div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="h-5 w-32 bg-primary/10 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-primary/10 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export const FeedbackGridSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="section-grid mb-8"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <FeedbackSkeleton key={index} />
      ))}
    </motion.div>
  );
};

export default FeedbackSkeleton;
