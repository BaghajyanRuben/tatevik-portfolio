import { PageTransition } from '../components/layout';
import { AboutHero } from '../components/about';
import {
  SkillsSection,
  ExperienceSection,
  EducationSection,
  CredentialsSection,
  ContactSection,
} from '../components/sections/about';
import SEO from '../components/SEO';
import aboutData from '../data/about.json';

const About = () => {
  const photoUrl = `${import.meta.env.BASE_URL}${aboutData.photo.replace(/^\/+/, '')}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": aboutData.name,
      "jobTitle": aboutData.title,
      "description": aboutData.bio,
      "image": photoUrl,
      "url": "https://tatevikpetrosyan.com/about",
      "sameAs": [
        aboutData.social.behance,
        aboutData.social.upwork,
        aboutData.social.linkedin
      ].filter(Boolean),
      "knowsAbout": aboutData.skills,
      "email": aboutData.social.email,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Yerevan",
        "addressCountry": "Armenia"
      }
    }
  };

  return (
    <PageTransition>
      <SEO
        title="About"
        description={`${aboutData.bio} ${aboutData.bioExtended}`}
        url="/about"
        image={photoUrl}
        keywords={`${aboutData.name}, UI/UX Designer, ${aboutData.skills.join(', ')}, Designer Bio, Design Experience, Yerevan, Armenia`}
        structuredData={structuredData}
      />
      <main className="page-main">
        <AboutHero
          name={aboutData.name}
          title={aboutData.title}
          photo={photoUrl}
          bio={aboutData.bio}
          bioExtended={aboutData.bioExtended}
          location={aboutData.location}
        />
        <SkillsSection skills={aboutData.skills} />
        <ExperienceSection experience={aboutData.experience} />
        <EducationSection education={aboutData.education} />
        <CredentialsSection
          certifications={aboutData.certifications}
          languages={aboutData.languages}
        />
        <ContactSection social={aboutData.social} />
      </main>
    </PageTransition>
  );
};

export default About;
