import { PageTransition } from '../components/layout';
import { HomeHero, SelectedWork } from '../components/sections/home';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';
import aboutData from '../data/about.json';

const Home = () => {
  // Structured data for the portfolio/collection page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Design Portfolio",
    "description": "A collection of UI/UX and icon design projects",
    "url": "https://tatevikpetrosyan.com/",
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
        title="Portfolio"
        description="Explore my UI/UX design portfolio featuring mobile apps, web designs, icon systems, and comprehensive case studies. See how I create intuitive, beautiful digital experiences."
        url="/"
        keywords="UI/UX Portfolio, Design Projects, Mobile App Design, Web Design, Icon Design, Case Studies, Product Design"
        structuredData={structuredData}
      />
      <main className="page-main page-main-top">
        <div className="container">
          <HomeHero ctaUrl={aboutData.social?.upwork} />
          <SelectedWork projects={projectsData.projects} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;
