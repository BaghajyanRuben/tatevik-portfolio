import { motion } from 'framer-motion';
import { CheckCircle, Trash2, Clock } from 'lucide-react';
import Button from '../ui/Button';

const FeedbackCard = ({ feedback, onApprove, onDelete, isProcessing }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card border-l-4 border-primary"
    >
      {/* Status Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[feedback.status]}`}>
          {feedback.status === 'pending' ? <Clock size={14} /> : <CheckCircle size={14} />}
          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
        </span>
        
        <div className="flex items-center gap-1">
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

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="font-medium text-primary text-lg">{feedback.clientName}</p>
            <p className="text-sm text-muted">{feedback.projectTitle}</p>
          </div>
          <p className="text-sm text-muted whitespace-nowrap">
            {feedback.startDate} – {feedback.endDate}
          </p>
        </div>

        <p className="body-md text-primary/80 mb-4">"{feedback.feedback}"</p>

        <div className="text-xs text-muted space-y-1">
          <p>Submitted: {formatDate(feedback.submittedAt)}</p>
          {feedback.approvedAt && (
            <p>Approved: {formatDate(feedback.approvedAt)} by {feedback.approvedBy}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-primary/10">
        {feedback.status === 'pending' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApprove(feedback.id)}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Approve
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(feedback.id)}
          disabled={isProcessing}
          className="flex items-center gap-2 text-red-500 hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default FeedbackCard;
