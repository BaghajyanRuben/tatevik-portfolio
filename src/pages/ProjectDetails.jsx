import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout';
import { ProjectHero } from '../components/project';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';
import {
  ProjectPrototypeSection,
  ProjectOverviewSection,
  ProjectGallerySection,
  ProjectCategoriesSection,
  InfoSection,
} from '../components/sections/project';

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = projectsData.projects.find((p) => p.id === slug);

  if (!project) {
    return (
      <PageTransition>
        <SEO
          title="Project Not Found"
          description="The project you're looking for doesn't exist."
          url={`/project/${slug}`}
        />
        <main className="page-main page-main-top">
          <div className="container text-center">
            <h1 className="heading-lg mb-4">Project Not Found</h1>
            <p className="body-md mb-8">
              The project you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </main>
      </PageTransition>
    );
  }

  // Get hero image for SEO (use first mockup if no heroImage)
  const seoImage = project.heroImage || (project.heroMockups && project.heroMockups[0]) || project.thumbnail;

  // Structured data for the project (CreativeWork)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": seoImage,
    "url": `https://tatevikpetrosyan.com/project/${project.id}`,
    "creator": {
      "@type": "Person",
      "name": "Tatevik Petrosyan"
    },
    "thumbnailUrl": project.thumbnail
  };

  return (
    <PageTransition>
      <SEO
        title={project.title}
        description={project.description}
        url={`/project/${project.id}`}
        image={seoImage}
        type="article"
        keywords={`${project.title}, ${project.subtitle}, Case Study`}
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        {/* Hero Section - Always shown */}
        <ProjectHero
          title={project.title}
          subtitle={project.subtitle}
          detailedPageInfo={project.detailedPageInfo}
          description={project.description}
          industry={project.industry}
          client={project.client}
          heroImage={project.heroImage}
          heroMockups={project.heroMockups}
        />

        {/* Overview Section - Shown if overview data exists */}
        <ProjectOverviewSection overview={project.overview} />

        {/* Info Sections - Dynamically render all info sections */}
        {project.infoSections && project.infoSections.length > 0 && (
          project.infoSections.map((info, index) => (
            <InfoSection
              key={index}
              info={info}
              projectTitle={project.title}
            />
          ))
        )}

        {/* Gallery Section - Shown if gallery images exist */}
        <ProjectGallerySection 
          gallery={project.gallery} 
          projectTitle={project.title} 
        />

        {/* Prototype Section - Shown if figmaUrl exists */}
        <ProjectPrototypeSection 
          figmaUrl={project.figmaUrl} 
          title={project.title} 
        />

        {/* Categories Section - Navigation to project categories */}
        <ProjectCategoriesSection />
      </main>
    </PageTransition>
  );
};

export default ProjectDetails;
