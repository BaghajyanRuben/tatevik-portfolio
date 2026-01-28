import { PageTransition } from '../components/layout';
import SEO from '../components/SEO';
import testimonialsData from '../data/testimonials.json';
import { TestimonialsIntro, TestimonialsGrid } from '../components/sections/testimonials';

const Testimonials = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Testimonials",
    "description": "Client feedback and testimonials",
    "url": "https://tatevikpetrosyan.com/testimonials"
  };

  return (
    <PageTransition>
      <SEO
        title="Testimonials"
        description="Client feedback and testimonials."
        url="/testimonials"
        keywords="Testimonials, Client Feedback, UI/UX Designer, Product Design"
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        <div className="container">
          <TestimonialsIntro />
          <TestimonialsGrid testimonials={testimonialsData.testimonials} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Testimonials;
