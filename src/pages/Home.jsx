import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout';
import { ProjectGrid } from '../components/home';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import projectsData from '../data/projects.json';
import aboutData from '../data/about.json';
import arrow45 from '../assets/arrow-45.svg';

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
      <main className="pt-32 sm:pt-32 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-16"
          >
            <h1 className="mb-6 font-sans font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
              Discover the works of Tatevik Petrosyan.{' '}
              <span className="text-[#ababab]">
                Let’s shape your brand into a masterpiece together.
              </span>
            </h1>
            {aboutData.social?.upwork && (
              <div className="mt-8">
                <Button
                  href={aboutData.social.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span>Work with me</span>
                  <img src={arrow45} alt="" className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">
              Selected Work
            </h2>
          </motion.div>

          <ProjectGrid projects={projectsData.projects} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;
