import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { LogoGrid, LogoBanner } from '../components/sections/logo';
import SEO from '../components/SEO';
import sectionsData from '../data/sections.json';
import { staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

const IconsProjects = () => {
  // Find the icons section from sections data
  const iconsSection = sectionsData.find((section) => section.id === 'icons');
  const sections = iconsSection?.sections || [];

  // Structured data for the Icons projects page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Icon Design Projects',
    description:
      'A collection of icon design projects showcasing interface icons and visual design work',
    url: 'https://tatevikpetrosyan.com/projects/icons',
  };

  return (
    <PageTransition>
      <SEO
        title="Icon Design Projects"
        description="Explore my icon design portfolio featuring interface icons that simplify user experiences. Discover icons that guide users and enhance digital products."
        url="/projects/icons"
        keywords="Icon Design, Interface Icons, UI Icons, Iconography, Visual Design, Portfolio"
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        <div className="container">
          {/* Hero Section */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-12 md:mb-16"
          >
            <motion.div variants={staggerItem}>
              <h1 className="text-[clamp(2.5rem,6vw,4rem)] leading-tight mb-6">
                <span className="block text-primary">Icons</span>
                <span className="block text-muted">
                  That simplify interfaces and guide users
                </span>
              </h1>
            </motion.div>
            <motion.p
              variants={staggerItem}
              className="text-muted text-lg md:text-xl max-w-2xl"
            >
              A collection of carefully crafted icons designed for clarity, consistency, and seamless integration across digital platforms.
            </motion.p>
          </motion.section>

          {/* Dynamic Sections */}
          <section className="flex flex-col gap-8 md:gap-12">
            {sections.map((section, index) => {
              if (section.type === 'grid') {
                return <LogoGrid key={`grid-${index}`} images={section.images} />;
              }
              if (section.type === 'banner') {
                return (
                  <LogoBanner
                    key={`banner-${index}`}
                    bannerImage={section.bannerImage}
                    alt={section.alt || 'Icon banner'}
                  />
                );
              }
              return null;
            })}
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default IconsProjects;
