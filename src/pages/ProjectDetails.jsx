import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/layout';
import { ProjectHero, ProjectInfo, ContentBlock } from '../components/project';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';

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
        <main className="pt-32 pb-20">
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
      <main className="pb-20">
        <div className="container pt-28">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-smooth mb-8"
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.button>
        </div>

        <ProjectHero
          title={project.title}
          description={project.description}
          heroImage={project.heroImage}
        />

        <ProjectInfo info={project.info} />

        <section className="py-16">
          <div className="container space-y-16">
            {project.sections.map((section, index) => (
              <ContentBlock key={index} section={section} />
            ))}
          </div>
        </section>

        {project.figmaUrl && (
          <section className="py-16 bg-gray-50">
            <div className="container">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="heading-md mb-8"
              >
                Interactive Prototype
              </motion.h2>
              <ContentBlock
                section={{ type: 'figma', url: project.figmaUrl, title: project.title }}
              />
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-muted mb-4">Next Project</p>
              <Button onClick={() => navigate('/')} variant="secondary">
                View All Projects
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
};

export default ProjectDetails;
