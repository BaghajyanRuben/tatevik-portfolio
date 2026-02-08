import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import FeedbackCard from '../../components/admin/FeedbackCard';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllFeedbacks, 
  getFeedbacksByStatus, 
  approveFeedback, 
  deleteFeedback 
} from '../../services/feedbackService';
import SEO from '../../components/SEO';

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [processing, setProcessing] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { currentUser } = useAuth();

  const fetchFeedbacks = async (status = 'all') => {
    try {
      setLoading(true);
      const data = status === 'all' 
        ? await getAllFeedbacks() 
        : await getFeedbacksByStatus(status);
      setFeedbacks(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(activeTab);
  }, [activeTab]);

  const handleApprove = async (feedbackId) => {
    if (!currentUser?.email) {
      showError('Authentication error. Please login again.');
      return;
    }

    setProcessing(true);
    try {
      await approveFeedback(feedbackId, currentUser.email);
      showSuccess('Feedback approved successfully!');
      await fetchFeedbacks(activeTab);
    } catch (error) {
      showError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    setProcessing(true);
    try {
      await deleteFeedback(feedbackId);
      showSuccess('Feedback deleted successfully!');
      await fetchFeedbacks(activeTab);
    } catch (error) {
      showError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Feedbacks' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' }
  ];

  return (
    <AdminLayout>
      <SEO title="Manage Feedbacks" noindex />
      
      <div className="mb-8">
        <h1 className="heading-lg mb-2">Manage Feedbacks</h1>
        <p className="body-md text-muted">Review, approve, or delete feedback submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-white text-primary/70 hover:bg-primary/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="soft-card">
              <div className="h-48 animate-pulse bg-primary/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="soft-card text-center py-12"
        >
          <p className="text-muted">No feedbacks found in this category.</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {feedbacks.map(feedback => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onApprove={handleApprove}
              onDelete={handleDelete}
              isProcessing={processing}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default ManageFeedback;
