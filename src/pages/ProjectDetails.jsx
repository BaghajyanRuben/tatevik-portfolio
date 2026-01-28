import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout';
import { ProjectHero, ProjectInfo } from '../components/project';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';
import {
  ProjectBackLink,
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
    "dateCreated": project.info.year,
    "creator": {
      "@type": "Person",
      "name": "Tatevik Petrosyan",
      "jobTitle": project.info.role
    },
    "genre": project.info.type,
    "keywords": project.info.tools.join(', '),
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
        keywords={`${project.title}, ${project.subtitle}, ${project.info.tools.join(', ')}, ${project.info.type}, Case Study`}
        structuredData={structuredData}
      />
      <main className="page-main">
        <ProjectBackLink onBack={() => navigate(-1)} />

        <ProjectHero
          title={project.title}
          description={project.description}
          heroImage={project.heroImage}
        />

        <ProjectInfo info={project.info} />

        <ProjectContent sections={project.sections} />

        <ProjectPrototypeSection figmaUrl={project.figmaUrl} title={project.title} />

        <ProjectNextSection onNext={() => navigate('/')} />
      </main>
    </PageTransition>
  );
};

export default ProjectDetails;
