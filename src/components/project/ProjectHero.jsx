import { motion } from 'framer-motion';

const ProjectHero = ({ title, subtitle, detailedPageInfo, description, industry, client, heroImage, heroMockups }) => {
  const hasHeroMockups = heroMockups && heroMockups.length > 0;
  
  // Determine grid columns based on number of mockups
  const getMockupGridClass = () => {
    const count = heroMockups?.length || 0;
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 4) return 'grid-cols-2 md:grid-cols-4';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-4';
  };

  // Get title text - use detailedPageInfo if available, otherwise fall back to subtitle
  const darkText = detailedPageInfo?.darkText || subtitle?.split(' ')[0] || '';
  const lightText = detailedPageInfo?.lightText || subtitle?.split(' ').slice(1).join(' ') || '';

  return (
    <section>
      <div className="container">
        {/* Industry & Client Info */}
        {(industry || client) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 mb-6 text-sm"
          >
            {industry && (
              <div>
                <span className="text-muted">Industry</span>
                <span className="mx-4 text-muted">|</span>
                <span className="font-medium">{industry}</span>
              </div>
            )}
            {client && (
              <div>
                <span className="text-muted">Client</span>
                <span className="mx-4 text-muted">|</span>
                <span className="font-medium">{client}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Title - Dark text on top, Light text below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium">
            <span className="block text-primary">{darkText}</span>
            <span className="block text-muted">{lightText}</span>
          </h1>
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="body-md text-muted max-w-4xl"
          >
            {description}
          </motion.p>
        )}

        {/* Hero Mockups Grid */}
        {hasHeroMockups && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={`pt-8 grid ${getMockupGridClass()} gap-4 md:gap-6`}
          >
            {heroMockups.map((mockup, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="rounded-2xl overflow-hidden"
              >
                <img
                  src={mockup}
                  alt={`${title} mockup ${index + 1}`}
                  width={400}
                  height={600}
                  loading={index < 4 ? "eager" : "lazy"}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Single Hero Image */}
        {heroImage && !hasHeroMockups && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="pt-8 rounded-2xl overflow-hidden"
          >
            <img
              src={heroImage}
              alt={title}
              width={1200}
              height={675}
              loading="eager"
              fetchPriority="high"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectHero;
