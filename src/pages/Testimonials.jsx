import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import SEO from '../components/SEO';
import testimonialsData from '../data/testimonials.json';
import { staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

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
      <main className="pt-32 sm:pt-32 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-12"
          >
            <h1 className="heading-lg mb-4">Testimonials</h1>
            <p className="body-md max-w-2xl">
              Feedback from clients and collaborators.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {testimonialsData.testimonials.map((testimonial) => (
              <motion.article
                key={`${testimonial.clientName}-${testimonial.projectTitle}`}
                variants={staggerItem}
                className="rounded-2xl border border-primary/10 bg-white p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted">Project</p>
                    <p className="font-medium text-primary">{testimonial.projectTitle}</p>
                  </div>
                  <div className="flex items-center gap-1" aria-label={`Rating: ${testimonial.rating} out of 5`}>
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

                <p className="body-md mb-6 text-primary/80">
                  “{testimonial.feedback}”
                </p>

                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-primary">{testimonial.clientName}</p>
                  <p className="text-sm text-muted">
                    {testimonial.startDate} – {testimonial.endDate}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Testimonials;
