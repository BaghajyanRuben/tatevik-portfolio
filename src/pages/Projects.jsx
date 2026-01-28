import { PageTransition } from '../components/layout';
import { ProjectsIntro, ProjectsList } from '../components/sections/projects';
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
      <main className="page-main page-main-top">
        <div className="container">
          <ProjectsIntro />
          <ProjectsList projects={projectsData.projects} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Projects;
