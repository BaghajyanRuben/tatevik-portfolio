import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { LogoGrid, LogoBanner } from '../components/sections/logo';
import { ProjectCategoriesSection } from '../components/sections/project';
import SEO from '../components/SEO';
import sectionsData from '../data/sections.json';
import { staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

const LogoProjects = () => {
  // Find the logo section from sections data
  const logoSection = sectionsData.find((section) => section.id === 'logo');
  const sections = logoSection?.sections || [];

  // Structured data for the Logo projects page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Logo Design Projects',
    description:
      'A collection of logo design projects showcasing brand identity and visual design work',
    url: 'https://tatevikpetrosyan.com/projects/logo',
  };

  return (
    <PageTransition>
      <SEO
        title="Logo Design Projects"
        description="Explore my logo design portfolio featuring brand identity and visual design projects. Discover timeless brand symbols that transform ideas into memorable identities."
        url="/projects/logo"
        keywords="Logo Design, Brand Identity, Visual Design, Branding, Graphic Design, Portfolio"
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        <div className="container">
          {/* Hero Section */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className=""
          >
            <motion.div variants={staggerItem}>
              <h1 className="text-[clamp(2.5rem,6vw,4rem)] leading-tight mb-6">
                <span className="block text-primary">Logo</span>
                <span className="block text-muted">
                  Crafting distinctive brand identities
                </span>
              </h1>
            </motion.div>
            <motion.p
              variants={staggerItem}
              className="text-muted text-lg md:text-xl max-w-2xl"
            >
              This collection presents thoughtfully crafted logos designed for clarity, recognition, and cross-platform use.
            </motion.p>
          </motion.section>

          {/* Dynamic Sections */}
          <section className="flex flex-col gap-8 md:gap-12 mt-12 md:mt-16">
            {sections.map((section, index) => {
              if (section.type === 'grid') {
                return <LogoGrid key={`grid-${index}`} images={section.images} />;
              }
              if (section.type === 'banner') {
                return (
                  <LogoBanner
                    key={`banner-${index}`}
                    bannerImage={section.bannerImage}
                    alt={section.alt || 'Logo banner'}
                  />
                );
              }
              return null;
            })}
          </section>
        </div>

        {/* Category Navigation */}
        <ProjectCategoriesSection excludePath="/projects/logo" />
      </main>
    </PageTransition>
  );
};

export default LogoProjects;
