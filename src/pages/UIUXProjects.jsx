import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { ProjectGrid } from '../components/home';
import { ProjectCategoriesSection } from '../components/sections/project';
import SEO from '../components/SEO';
import { getPublishedProjects } from '../services/projectService';
import { staggerContainer, staggerItem } from '../hooks/useScrollAnimation';

const UIUXProjects = () => {
  const [uiuxProjects, setUiuxProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getPublishedProjects();
        // Filter projects that have "UX/UI Projects" in their categories
        const filtered = projects.filter((project) =>
          project.categories?.includes('UX/UI Projects')
        );
        setUiuxProjects(filtered);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
            className=""
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
          <section className="mt-12 md:mt-16">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <ProjectGrid projects={uiuxProjects} />
            )}
          </section>
        </div>

        {/* Category Navigation */}
        <ProjectCategoriesSection excludePath="/projects/ui-ux" />
      </main>
    </PageTransition>
  );
};

export default UIUXProjects;
