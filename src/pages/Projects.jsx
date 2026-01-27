import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { ProjectGrid } from '../components/home';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';

const Projects = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Projects",
    "description": "All design projects and case studies",
    "url": "https://tatevikpetrosyan.com/projects",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projectsData.projects.map((project, index) => ({
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
        title="Projects"
        description="Explore all projects and case studies."
        url="/projects"
        keywords="Projects, Case Studies, UI/UX Portfolio, Product Design"
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
            <h1 className="heading-lg mb-4">Projects</h1>
            <p className="body-md max-w-2xl">
              A full selection of UI/UX, product, and icon design work.
            </p>
          </motion.div>

          <ProjectGrid projects={projectsData.projects} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Projects;
