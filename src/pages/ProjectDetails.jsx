import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout';
import { ProjectHero } from '../components/project';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';
import {
  ProjectContent,
  ProjectPrototypeSection,
  ProjectNextSection,
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

  // Structured data for the project (CreativeWork)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.heroImage,
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
        image={project.heroImage}
        type="article"
        keywords={`${project.title}, ${project.subtitle}, Case Study`}
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        <ProjectHero
          title={project.title}
          description={project.description}
          heroImage={project.heroImage}
        />

        <ProjectContent sections={project.sections} projectTitle={project.title} />

        <ProjectPrototypeSection figmaUrl={project.figmaUrl} title={project.title} />

        <ProjectNextSection onNext={() => navigate('/')} />
      </main>
    </PageTransition>
  );
};

export default ProjectDetails;
