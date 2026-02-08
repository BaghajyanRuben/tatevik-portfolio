import { PageTransition } from '../components/layout';
import SEO from '../components/SEO';
import feedbackData from '../data/feedback.json';
import { FeedbackIntro, FeedbackGrid } from '../components/sections/feedback';

const Feedback = () => {
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
          <FeedbackGrid feedbacks={feedbackData.feedbacks} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Feedback;
