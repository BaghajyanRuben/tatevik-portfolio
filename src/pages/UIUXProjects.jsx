import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { ProjectGrid } from '../components/home';
import DesigningSuccess from '../components/sections/home/DesigningSuccess';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';
import { staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

const UIUXProjects = () => {
  // Filter projects that have "UX/UI Projects" in their categories
  const uiuxProjects = projectsData.projects.filter((project) =>
    project.categories?.includes('UX/UI Projects')
  );

  // Structured data for the UI/UX projects page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "UI/UX Design Projects",
    "description": "A collection of UI/UX design projects showcasing interface and experience design work",
    "url": "https://tatevikpetrosyan.com/projects/ui-ux",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": uiuxProjects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": project.title,
        "url": `https://tatevikpetrosyan.com/project/${project.id}`
      }))
    }
  };

  return (
    <PageTransition>
      <SEO
        title="UI/UX Design Projects"
        description="Explore my UI/UX design portfolio featuring interface and experience design projects. Discover products that blend creativity, function, and meaningful design."
        url="/projects/ui-ux"
        keywords="UI/UX Design, Interface Design, Experience Design, Product Design, Mobile App Design, Web Design, Portfolio"
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
                <span className="block text-primary">Interface &</span>
                <span className="block text-primary">Experience Design</span>
              </h1>
            </motion.div>
            <motion.p
              variants={staggerItem}
              className="text-muted text-lg md:text-xl max-w-2xl"
            >
              Explore the unique blended products that blend creativity, function, and
              meaningful design.
            </motion.p>
          </motion.section>

          {/* Projects Grid */}
          <section className="mb-16 md:mb-24">
            <ProjectGrid projects={uiuxProjects} />
          </section>

          {/* Designing Success Section */}
          <section className="mb-16">
            <DesigningSuccess />
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default UIUXProjects;
