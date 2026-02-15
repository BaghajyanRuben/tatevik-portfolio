import { useState, useEffect } from 'react';
import { PageTransition } from '../components/layout';
import { HomeHero, TopProjects } from '../components/sections/home';
import ClientsSection from '../components/sections/home/ClientsSection';
import SEO from '../components/SEO';
import { getAllProjects } from '../services/projectService';
import aboutData from '../data/about.json';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects();
        console.log('🏠 Home: All projects:', allProjects.length);
        // Filter only published projects
        const publishedProjects = allProjects.filter(
          (project) => project.status === 'published' || !project.status
        );
        console.log('🏠 Home: Published projects:', publishedProjects.length);
        setProjects(publishedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Structured data for the portfolio/collection page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Design Portfolio",
    "description": "A collection of UI/UX and icon design projects",
    "url": "https://tatevikpetrosyan.com/",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((project, index) => ({
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
          {loading ? (
            <div className="py-20">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <TopProjects projects={projects} />
          )}
          <div className="mt-16">
            <ClientsSection />
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;
