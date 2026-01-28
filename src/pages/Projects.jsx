import { PageTransition } from '../components/layout';
import SEO from '../components/SEO';
import { ProductCategory } from '../components/sections/projects';
import projectsData from '../data/projects.json';

const Projects = () => {
  const sections = [
    {
      id: 'ui-ux',
      titleDarkLines: ['UX / UI Design', 'Products'],
      titleLight: 'Designing Seamless Digital Experiences',
      mode: 'left',
      imageSrc: projectsData.projects[0]?.thumbnail,
    },
    {
      id: 'logo',
      titleDarkLines: ['logo'],
      titleLight: 'Transforming ideas into timeless brand symbols.',
      mode: 'right',
      imageSrc: projectsData.projects[1]?.thumbnail,
    },
    {
      id: 'icons',
      titleDarkLines: ['Icons'],
      titleLight: 'that simplify interfaces and guide users.',
      mode: 'left',
      imageSrc: projectsData.projects[2]?.thumbnail,
    },
  ];

  return (
    <PageTransition>
      <SEO
        title="Projects"
        description="Explore UI/UX, logo, and icon design work."
        url="/projects"
        keywords="Projects, UI/UX, Logo Design, Icon Design, Portfolio"
      />
      <main className="page-main page-main-top">
        <div className="container">
          <div className="flex flex-col gap-8 md:gap-16">
            {sections.map((section) => (
              <ProductCategory
                key={section.id}
                titleDarkLines={section.titleDarkLines}
                titleLight={section.titleLight}
                mode={section.mode}
                imageSrc={section.imageSrc}
                imageAlt={`${section.titleDarkLines.join(' ')} preview`}
              />
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Projects;
