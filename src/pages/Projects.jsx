import { PageTransition } from '../components/layout';
import SEO from '../components/SEO';
import { ProductCategory } from '../components/sections/projects';
import sectionsData from '../data/sections.json';

const Projects = () => {
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
            {sectionsData.map((section) => (
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
