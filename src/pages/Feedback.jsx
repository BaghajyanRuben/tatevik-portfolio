import { PageTransition } from '../components/layout';
import SEO from '../components/SEO';
import { FeedbackIntro, FeedbackGrid } from '../components/sections/feedback';
import FeedbackForm from '../components/sections/feedback/FeedbackForm';
import { FeedbackGridSkeleton } from '../components/feedback/FeedbackSkeleton';
import { ToastContainer } from '../components/ui/Toast';
import { useFeedback } from '../hooks/useFeedback';
import { useToast } from '../hooks/useToast';

const Feedback = () => {
  const { feedbacks, loading, error } = useFeedback();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Feedback",
    "description": "Client feedback and reviews",
    "url": "https://tatevikpetrosyan.com/feedback"
  };

  return (
    <PageTransition>
      <SEO
        title="Feedback"
        description="Client feedback and reviews."
        url="/feedback"
        keywords="Feedback, Client Reviews, UI/UX Designer, Product Design"
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        <div className="container">
          <FeedbackIntro />
          
          {loading ? (
            <FeedbackGridSkeleton />
          ) : error ? (
            <div className="soft-card text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="soft-card text-center py-12">
              <p className="text-muted">No feedback available yet.</p>
            </div>
          ) : (
            <FeedbackGrid feedbacks={feedbacks} />
          )}

          <div className="mt-16 mb-16">
            <FeedbackForm onSuccess={showSuccess} onError={showError} />
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </PageTransition>
  );
};

export default Feedback;
